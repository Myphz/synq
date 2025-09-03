<script lang="ts" module>
  const HEIGHT_PER_LINE = 14;
  const TRANSITION_CLASS = "epic-transition";
</script>

<script lang="ts">
  import type { HTMLTextareaAttributes } from "svelte/elements";
  import { twMerge } from "tailwind-merge";
  import Icon from "./icon.svelte";
  import { sleep } from "@utils/sleep";

  type Props = HTMLTextareaAttributes & {
    cyberpunkStyle?: string;
    class?: string;
    onresize?: (forced?: boolean) => unknown;
  };

  let textareaEl: HTMLTextAreaElement;
  let value = $state("");

  export const resetSize = () => {
    textareaEl.style.height = `${HEIGHT_PER_LINE}px`;
    textareaEl.focus();
  };

  const resize = () => {
    const prevHeight = textareaEl.style.height;

    // Auto-shrink
    textareaEl.style.height = "auto";
    // Calculate lines
    const lines = Math.ceil(textareaEl.scrollHeight / HEIGHT_PER_LINE) - 1;

    textareaEl.style.height = prevHeight;
    const newHeight = `${(lines || 1) * HEIGHT_PER_LINE}px`;

    onresize?.();

    if (prevHeight !== newHeight) {
      textareaEl.classList.add(TRANSITION_CLASS);
      requestAnimationFrame(async () => {
        textareaEl.style.height = newHeight;
        await sleep(150);
        requestAnimationFrame(() => onresize?.(true));
        textareaEl.classList.remove(TRANSITION_CLASS);
      });
    }
  };

  const onInput = (e: Event) => {
    resize();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    textareaProps?.oninput?.(e as any);
  };

  const {
    class: className,
    cyberpunkStyle = "cyberpunk-tl cyberpunk-br",
    onresize,
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
    class="epic-transition max-h-[20vh] min-h-0 w-[90%] resize-none break-words bg-accent placeholder:text-muted"
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
