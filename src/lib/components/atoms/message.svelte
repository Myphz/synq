<script lang="ts">
  import type { ServerMessage } from "$lib/api/protocol";

  type Message = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"][number];

  const message: Message = $props();
</script>

<div>{message.content}</div>
