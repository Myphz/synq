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
    `cyberpunk ${cyberpunkStyle} relative flex items-center gap-2 bg-secondary p-4 *:relative *:z-10 after:absolute after:inset-px after:bg-accent`,
    className
  )}
>
  {#if children}
    {@render children()}
  {/if}
  <input
    {...inputProps}
    type="text"
    class="w-full bg-accent placeholder:text-muted"
  />
</div>

<style>
  div::after {
    clip-path: inherit;
  }
</style>
