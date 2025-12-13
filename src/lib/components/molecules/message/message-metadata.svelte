<script lang="ts">
  import { toTime } from "@utils/dates";
  import type { Message } from "@utils/message";
  import ViewIndicator from "./view-indicator.svelte";
  import { getUserId } from "$lib/supabase/auth/utils";

  type Props = Message;
  const message: Props = $props();

  let ourId = $state("");
  // eslint-disable-next-line unicorn/prefer-top-level-await
  getUserId().then((userId) => (ourId = userId));
</script>

<span class="text-small text-muted shrink-0">{toTime(message.sentAt)}</span>
{#if message.senderId === ourId}
  <ViewIndicator {...message} />
{/if}
