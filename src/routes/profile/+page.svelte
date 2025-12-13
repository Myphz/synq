<script lang="ts">
  import { page } from "$app/state";
  import { getProfile } from "$lib/api/auth";
  import { getDefaultAvatar } from "$lib/api/avatar";
  import { isUserOnline } from "$lib/stores/chats.svelte";
  import { isConnected } from "$lib/stores/connection.svelte";
  import { getUserProfileResource } from "$lib/stores/me.svelte";
  import CyberImage from "@atoms/cyber-image.svelte";
  import AvatarEditor from "@molecules/avatar-editor.svelte";
  import { authGuard } from "@utils/auth-guard";
  import { formatUserStatus } from "@utils/dates";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  onMount(() => {
    authGuard();
  });

  // Empty = viewing its current profile
  const userId = $derived(page.url.searchParams.get("id") || "");
  // If viewing another profile, no need for reactivity
  const profile = $derived(
    userId ? getProfile(userId) : getUserProfileResource()
  );
  const isOnline = $derived(userId ? isUserOnline(userId) : true);
</script>

<section class="mt-4 flex flex-col gap-8">
  <header class="text-h-2">Profile</header>

  {#if profile}
    {#await profile then realProfile}
      <div class="flex items-center gap-6">
        <div class="relative">
          <CyberImage
            src={realProfile.avatar_url || getDefaultAvatar(realProfile.id)}
            class="size-32"
          />
          {#if !userId}
            <AvatarEditor />
          {/if}
        </div>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1 *:leading-none!">
            <span class="text-h-3">{realProfile.name}</span>
            <span class="text-primary">@{realProfile.username}</span>
          </div>

          <div class="flex items-center gap-1">
            <div
              class={twMerge(
                "size-4 rounded-full",
                isOnline ? "bg-primary" : "bg-muted"
              )}
            ></div>
            {#if isConnected.value}
              <span class={isOnline ? "text-primary" : "text-muted"}>
                {isOnline
                  ? "Online"
                  : formatUserStatus({
                      lastSeen: realProfile.last_seen,
                      exact: true
                    })}
              </span>
            {:else}
              <span class="text-[#ff0000]">DISCONNECTED</span>
            {/if}
          </div>
        </div>
      </div>
    {/await}
  {/if}
</section>
