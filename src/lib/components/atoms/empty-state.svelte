<script lang="ts">
  import { filter } from "$lib/stores/chats.svelte";
  import Icon from "./icon.svelte";
</script>

<article
  class="bg-accent after:bg-primary relative mt-2 flex w-full flex-col gap-2 px-5 py-6 leading-none! after:absolute after:bottom-0 after:left-0 after:-z-10 after:h-[50%] after:w-full after:blur-sm"
>
  <header class="text-h-2 text-primary">No chats found</header>
  <span class="text-h-4 text-muted flex items-center gap-[0.25em]">
    {#if filter.chats === "full"}
      Tap on <Icon class="text-h-3" name="search" /> to search for a friend
    {:else}
      No results found
    {/if}
  </span>

  <div class="absolute -top-1 -left-1 aspect-square w-[10%]">
    <div class="decoration bg-primary absolute top-0 left-0 h-full w-0.5"></div>
    <div class="decoration bg-primary absolute top-0 left-0 h-0.5 w-full"></div>
  </div>

  <div class="absolute -top-1 -right-1 aspect-square w-[10%]">
    <div
      class="decoration bg-primary absolute top-0 right-0 h-full w-0.5"
    ></div>
    <div class="decoration bg-primary absolute top-0 left-0 h-0.5 w-full"></div>
  </div>
</article>

<style>
  .decoration {
    color: var(--color-primary);
    box-shadow: 0 0 5px currentColor;
  }
</style>
