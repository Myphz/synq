<script lang="ts">
  import { filter } from "$lib/stores/chats.svelte";
  import Icon from "./icon.svelte";
</script>

<article
  class="relative mt-2 flex w-full flex-col gap-2 bg-accent px-5 py-6 !leading-none after:absolute after:bottom-0 after:left-0 after:-z-10 after:h-[50%] after:w-full after:bg-primary after:blur-sm"
>
  <header class="text-h-2 text-primary">No chats found</header>
  <span class="flex items-center gap-[0.25em] text-h-4 text-muted">
    {#if filter.chats === "full"}
      Tap on <Icon class="text-h-3" name="search" /> to search for a friend
    {:else}
      No results found
    {/if}
  </span>

  <div class="absolute -left-1 -top-1 aspect-square w-[10%]">
    <div class="decoration absolute left-0 top-0 h-full w-0.5 bg-primary"></div>
    <div class="decoration absolute left-0 top-0 h-0.5 w-full bg-primary"></div>
  </div>

  <div class="absolute -right-1 -top-1 aspect-square w-[10%]">
    <div
      class="decoration absolute right-0 top-0 h-full w-0.5 bg-primary"
    ></div>
    <div class="decoration absolute left-0 top-0 h-0.5 w-full bg-primary"></div>
  </div>
</article>

<style lang="postcss">
  .decoration {
    @apply text-primary;
    box-shadow: 0 0 5px currentColor;
  }
</style>
