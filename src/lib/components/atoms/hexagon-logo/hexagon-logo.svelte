<script lang="ts">
  import BaseHexagon from "./base-hexagon.svelte";
</script>

<div class="relative">
  <BaseHexagon />
  <BaseHexagon strokeWidth={10} class="absolute top-0 left-0 blur-md" />
</div>
