<script lang="ts" module>
  const ENTRIES = [
    {
      icon: "manage_accounts",
      name: "PROFILE",
      href: "/profile"
    }
  ] as const;
</script>

<script lang="ts">
  import { getDefaultAvatar } from "$lib/api/avatar";
  import {
    createUserProfileResource,
    getUserProfileResource
  } from "$lib/stores/me.svelte";

  import CyberImage from "@atoms/cyber-image.svelte";
  import Icon from "@atoms/icon.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  import { portal } from "@utils/portal";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  type Props = { closeMenu: () => unknown; isOpen: boolean };
  const { closeMenu, isOpen }: Props = $props();

  onMount(() => createUserProfileResource());

  const profile = $derived(getUserProfileResource());
</script>

<aside
  use:clickoutside
  onclickoutside={closeMenu}
  class={twMerge(
    "epic-transition fixed left-0 top-0 z-20 h-dvh w-0 min-w-0 overflow-hidden bg-accent pt-10 *:px-4",
    isOpen && "min-w-[70%]"
  )}
>
  {#if profile}
    <header class="flex items-center gap-4 border-b border-secondary pb-4">
      <CyberImage
        src={profile.avatar_url || getDefaultAvatar(profile.id)}
        class="size-16"
      />

      <div class="flex flex-col gap-1 *:leading-none">
        <span class="text-h-3 capitalize">{profile.name}</span>
        <span class="text-primary">@{profile.username}</span>
      </div>
    </header>

    <ul class="py-4">
      {#each ENTRIES as entry (entry.href)}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <li onclick={closeMenu} class="flex items-center gap-2 text-h-4">
          <Icon name={entry.icon} class="text-primary" />
          <a href={entry.href}>{entry.name}</a>
        </li>
      {/each}
    </ul>
  {/if}
</aside>

<div
  use:portal={"body"}
  class={twMerge(
    "fixed inset-0 bg-[#000000]",
    isOpen && "z-0 bg-opacity-50",
    !isOpen && "-z-10 bg-opacity-0"
  )}
></div>

<style>
  aside {
    box-shadow: 0 0 5px black;
  }
</style>
