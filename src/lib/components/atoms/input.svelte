<script lang="ts">
  import type { HTMLInputAttributes } from "svelte/elements";
  type Props = HTMLInputAttributes & {};

  const { ...inputProps }: Props = $props();
</script>

<div class="w-full">
  <input
    {...inputProps}
    type="text"
    class="w-full bg-secondary/20 p-4 placeholder:text-muted"
  />
</div>
