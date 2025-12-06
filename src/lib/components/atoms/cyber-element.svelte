<script lang="ts">
  import type { Snippet } from "svelte";
  import { twMerge } from "tailwind-merge";

  type Props = {
    class?: string;
    containerWidth?: string;
    containerOffset?: string;
    lineThickness?: string;
    reversed?: boolean;
    children: Snippet;
  };

  const {
    class: className,
    containerWidth = "50%",
    containerOffset = "7%",
    lineThickness = "5%",
    reversed,
    children
  }: Props = $props();

  const yAxis = reversed ? "top" : "bottom";
  const oppositeYAxis = reversed ? "bottom" : "top";
</script>

<div class="p-[3px]">
  <div class={twMerge("relative", className)}>
    {@render children()}
    <div
      class="absolute aspect-square"
      style="width: {containerWidth}; {yAxis}: -{containerOffset}; left: -{containerOffset}"
    >
      <div
        class="absolute {yAxis}-0 left-0 h-full bg-secondary"
        style="width: {lineThickness}"
      ></div>
      <div
        class="absolute {yAxis}-0 left-0 w-full bg-secondary"
        style="height: {lineThickness}"
      ></div>
    </div>

    <div
      class="absolute aspect-square"
      style="width: {containerWidth}; right: -{containerOffset}; {oppositeYAxis}: -{containerOffset}"
    >
      <div
        class="absolute right-0 {oppositeYAxis}-0 h-full bg-secondary"
        style="width: {lineThickness}"
      ></div>
      <div
        class="absolute right-0 {oppositeYAxis}-0 w-full bg-secondary"
        style="height: {lineThickness}"
      ></div>
    </div>
  </div>
</div>
