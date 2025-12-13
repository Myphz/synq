<script lang="ts">
  import Icon from "@atoms/icon.svelte";
  import type { Message } from "@utils/message";

  type Props = Message;
  const message: Props = $props();
</script>

{#if message.isRead}
  <Icon name="done_all" class="-ml-1 shrink-0" />
{:else}
  <Icon name="check" class="text-text -ml-1 shrink-0" />
{/if}
