<script lang="ts">
  import BaseHexagon from "./base-hexagon.svelte";
</script>

<div class="relative">
  <BaseHexagon />
  <BaseHexagon strokeWidth={10} class="absolute left-0 top-0 blur-lg" />
</div>
