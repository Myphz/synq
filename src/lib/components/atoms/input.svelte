<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLInputAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  type Props = HTMLInputAttributes & {
    children?: Snippet;
    cyberpunkStyle?: string;
    class?: string;
  };

  const {
    children,
    class: className,
    cyberpunkStyle = "cyberpunk-tl cyberpunk-br",
    ...inputProps
  }: Props = $props();
</script>

<div
  class={twMerge(
    `cyberpunk ${cyberpunkStyle} bg-secondary after:bg-accent relative flex items-center gap-2 p-4 *:relative *:z-10 after:absolute after:inset-px`,
    className
  )}
>
  {#if children}
    {@render children()}
  {/if}
  <input
    {...inputProps}
    type="text"
    class="bg-accent placeholder:text-muted w-full"
  />
</div>

<style>
  div::after {
    clip-path: inherit;
  }
</style>
