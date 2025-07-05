<script lang="ts" module>
  const HEIGHT_PER_LINE = 14;
</script>

<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import Icon from "./icon.svelte";

  type Props = HTMLTextareaAttributes & {
    cyberpunkStyle?: string;
    class?: string;
  };

  let textareaEl: HTMLTextAreaElement;
  let value = $state("");

  export const resetSize = () => {
    textareaEl.style.height = `${HEIGHT_PER_LINE}px`;
  };

  export const resize = () => {
    // Auto-shrink
    textareaEl.style.height = "auto";
    // Calculate lines
    const lines = Math.ceil(textareaEl.scrollHeight / HEIGHT_PER_LINE) - 1;
    textareaEl.style.height = `${(lines || 1) * HEIGHT_PER_LINE}px`;
  };

  const onInput = (e: Event) => {
    resize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    textareaProps?.oninput?.(e as any);
  };

  const {
    class: className,
    cyberpunkStyle = "cyberpunk-tl cyberpunk-br",
    ...textareaProps
  }: Props = $props();
</script>

<div
  class={twMerge(
    `cyberpunk ${cyberpunkStyle} relative flex items-center gap-2 bg-secondary p-4 *:relative *:z-10 after:absolute after:inset-px after:bg-accent`,
    className
  )}
>
  <textarea
    {...textareaProps}
    oninput={onInput}
    bind:this={textareaEl}
    bind:value
    autocomplete="off"
    rows="1"
    class="epic-transition max-h-[6em] min-h-0 w-[90%] resize-none break-words bg-accent transition-all placeholder:text-muted"
  ></textarea>

  {#if value}
    <button type="submit" class="!absolute bottom-3 right-4 text-h-4">
      <Icon name="send" class="align-bottom" />
    </button>
  {/if}
</div>

<style>
  div::after {
    clip-path: inherit;
  }
</style>
