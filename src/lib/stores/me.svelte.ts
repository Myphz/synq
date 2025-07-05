import { getUserId } from "$lib/supabase/auth/utils";
import { supabase } from "$lib/supabase/client";
import {
  createDynamicResource,
  getDynamicResource,
  refetchDynamicResource
} from "./resources.svelte";

export const createUserProfileResource = () =>
  createDynamicResource("profile", async () => {
    const id = await getUserId();
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single()
      .throwOnError();

    return data;
  });

export const getUserProfileResource = () =>
  getDynamicResource<typeof createUserProfileResource>("profile").value;

export const refetchUserProfileResource = () =>
  refetchDynamicResource("profile");
