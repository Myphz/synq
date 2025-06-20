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
  import CyberImage from "@atoms/cyber-image.svelte";
  import Icon from "@atoms/icon.svelte";
  import { clickoutside } from "@svelte-put/clickoutside";
  import { portal } from "@utils/portal";
  import { twMerge } from "tailwind-merge";

  type Props = { closeMenu: () => unknown; isOpen: boolean };
  const { closeMenu, isOpen }: Props = $props();
</script>

<aside
  use:clickoutside
  onclickoutside={closeMenu}
  use:portal={"body"}
  class={twMerge(
    "epic-transition absolute left-0 top-0 h-dvh w-0 min-w-0 overflow-hidden bg-secondary/20 pt-10 *:px-4",
    isOpen && "min-w-[70%]"
  )}
>
  <header class="flex items-center gap-4 border-b border-secondary pb-4">
    <CyberImage
      src="https://media.newyorker.com/photos/5e49bf473399bf0008132231/master/pass/Kenseth-CatProfile.jpg"
      class="size-16"
    />

    <div class="flex flex-col gap-1 *:leading-none">
      <span class="text-h-3">DANIEL</span>
      <span class="text-primary">@daniel</span>
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
</aside>

<style>
  aside {
    box-shadow: 0 0 5px black;
  }
</style>
