<script lang="ts">
  import { useZoomImageWheel } from "@zoom-image/svelte";
  import { onMount } from "svelte";

  type Props = {
    src: string;
    onZoomStateChange?: (isZoomed: boolean) => unknown;
  };

  const { src, onZoomStateChange }: Props = $props();
  let container: HTMLDivElement;

  let isZoomed = false;

  const { createZoomImage, zoomImageState: s } = useZoomImageWheel();

  onMount(() => {
    createZoomImage(container, { maxZoom: 7, wheelZoomRatio: 0.1 });
  });

  const updateZoomState = (newZoomState: boolean) => {
    isZoomed = newZoomState;
    onZoomStateChange?.(isZoomed);
  };

  $effect(() => {
    if ($s.currentZoom > 1 && !isZoomed) updateZoomState(true);
    if ($s.currentZoom === 1 && isZoomed) updateZoomState(false);
  });
</script>

<div
  bind:this={container}
  style="--x: {$s.currentPositionX}px; --y: {$s.currentPositionY /
    2}px; --zoom: {$s.currentZoom}"
  class="flex h-full w-full items-center justify-center"
>
  {#key src}
    <img {src} alt="Fullscreen" class="max-h-full w-full pb-8" />
  {/key}
</div>

<style>
  /*
    Override zoom library default styles 
    fix image Y position, to keep it centered even when zooming
  */

  img {
    transform: initial !important;
    translate: var(--x) var(--y);
    scale: var(--zoom);
  }
</style>
