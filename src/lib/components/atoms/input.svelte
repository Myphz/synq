<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  type Props = HTMLInputAttributes & {};

  const { ...inputProps }: Props = $props();
</script>

<div
  class="cyberpunk cyberpunk-tl cyberpunk-br relative bg-secondary p-4 after:absolute after:inset-px after:bg-secondary/20"
>
  <input
    {...inputProps}
    type="text"
    class="relative z-10 w-full bg-secondary/20 placeholder:text-muted"
  />
</div>

<style>
  div::after {
    clip-path: inherit;
  }
</style>
