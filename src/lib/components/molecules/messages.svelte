<script lang="ts">
  import type { ServerMessage } from "$lib/api/protocol";
  import Message from "@atoms/message.svelte";

  type Messages = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"];

  const messages: Messages = $props();
</script>

<div class="flex flex-col gap-2">
  {#each messages as msg (msg.id)}
    <Message {...msg} />
  {/each}
</div>
