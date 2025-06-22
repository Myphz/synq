<script lang="ts">
  import { page } from "$app/state";
  import { getProfile } from "$lib/api/auth";
  import { isUserOnline } from "$lib/stores/chats.svelte";
  import CyberImage from "@atoms/cyber-image.svelte";
  import { authGuard } from "@utils/auth-guard";
  import { formatUserStatus } from "@utils/dates";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  onMount(() => {
    authGuard();
  });

  // Empty = viewing its current profile
  const userId = $derived(page.url.searchParams.get("id") || "");
  const profilePromise = $derived(getProfile(userId));
  const isOnline = $derived(userId ? isUserOnline(userId) : true);
</script>

<section class="flex flex-col gap-8">
  <header class="text-h-2">Profile</header>

  {#await profilePromise then profile}
    <div class="flex items-center gap-6">
      <CyberImage
        src="https://media.newyorker.com/photos/5e49bf473399bf0008132231/master/pass/Kenseth-CatProfile.jpg"
        class="size-32"
      />
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1 *:leading-none">
          <span class="text-h-3">{profile.name}</span>
          <span class="text-primary">@{profile.username}</span>
        </div>

        <div class="flex items-center gap-1">
          <div
            class={twMerge(
              "size-4 rounded-full",
              isOnline ? "bg-primary" : "bg-muted"
            )}
          ></div>
          <span class={isOnline ? "text-primary" : "text-muted"}>
            {isOnline
              ? "Online"
              : formatUserStatus({
                  lastSeen: profile.last_seen
                })}
          </span>
        </div>
      </div>
    </div>
  {/await}
</section>
