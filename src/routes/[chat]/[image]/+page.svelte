<script lang="ts">
  import { page } from "$app/state";

  const messageId = $derived(page.params.image);
</script>

<div>{messageId}</div>
