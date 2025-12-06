<script lang="ts">
  import CyberElement from "./cyber-element.svelte";

  type Props = {
    class?: string;
    src: string;
  };

  const { class: className, src }: Props = $props();
</script>

<CyberElement class={className}>
  <img {src} class="h-full w-full object-cover" alt="Profile" />
</CyberElement>
