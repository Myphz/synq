import { getProfile } from "$lib/api/auth";
import {
  createDynamicResource,
  getDynamicResource,
  refetchDynamicResource
} from "./resources.svelte";

export const createUserProfileResource = () =>
  createDynamicResource("profile", getProfile);

export const getUserProfileResource = () =>
  getDynamicResource<typeof createUserProfileResource>("profile").value;

export const refetchUserProfileResource = () =>
  refetchDynamicResource("profile");
