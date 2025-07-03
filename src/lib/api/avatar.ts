import { getUserId } from "$lib/supabase/auth/utils";
import { supabase } from "$lib/supabase/client";
import { pickImage } from "@utils/files/pick";
import { readFileAsBlob } from "@utils/files/read";

export const uploadAvatar = async () => {
  const file = await pickImage();
  if (!file) return;

  const blob = await readFileAsBlob(file);
  const mime = file.mimeType || "image/jpeg";

  const userId = await getUserId();
  const ext = mime.split("/")[1] ?? "png";
  const objectPath = `${userId}/avatar.${ext}`;

  const { error: upErr } = await supabase.storage
    .from("avatars")
    .upload(objectPath, blob, {
      contentType: mime,
      cacheControl: "3600",
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
};
