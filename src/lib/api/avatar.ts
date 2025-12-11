import { getUserId } from "$lib/supabase/auth/utils";
import { supabase } from "$lib/supabase/client";
import { readImageAndCompress } from "@utils/files/read";
import { refetchUserProfileResource } from "$lib/stores/me.svelte";
import { pickFiles } from "@utils/files/pick";

export const getDefaultAvatar = (id: string) =>
  `https://api.dicebear.com/9.x/identicon/svg?seed=${id}&flip=true&backgroundRotation=0&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`;

export const uploadAvatar = async () => {
  const [image] = await pickFiles({ type: "image" });
  if (!image) return;

  const { data: blob } = await readImageAndCompress(image);

  const userId = await getUserId();
  const objectPath = `${userId}/${Date.now()}.webp`;

  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(objectPath, blob, {
      contentType: "image/webp",
      cacheControl: "99999999999",
      upsert: true
    });
  if (upErr) throw upErr;

  const { publicUrl } = supabase.storage
    .from("avatars")
    .getPublicUrl(objectPath).data;

  await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", userId)
    .throwOnError();

  refetchUserProfileResource();
};

export const deleteAvatar = async () => {
  const userId = await getUserId();

  const { data: profile } = await supabase
    .from("profiles")
    .select("avatar_url")
    .eq("id", userId)
    .single()
    .throwOnError();

  const url = profile.avatar_url;
  if (!url) return;

  const marker = `/storage/v1/object/public/avatars/`;

  const idx = url.indexOf(marker);
  if (idx === -1) throw new Error("Can't get avatar object path?");

  const objectPath = url.slice(idx + marker.length);

  const { error: delErr } = await supabase.storage
    .from("avatars")
    .remove([objectPath]);
  if (delErr) throw delErr;

  await supabase
    .from("profiles")
    .update({ avatar_url: null })
    .eq("id", userId)
    .throwOnError();

  refetchUserProfileResource();
};
