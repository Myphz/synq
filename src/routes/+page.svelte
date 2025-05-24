<script lang="ts">
  import type { ServerMessage } from "$lib/api/protocol";
  import { onMessage } from "$lib/api/ws";

  let chats = $state<Extract<ServerMessage, { type: "INITIAL_SYNC" }>["chats"]>(
    []
  );

  onMessage((msg) => {
    chats = msg.chats;
  }, "INITIAL_SYNC");
</script>

{#each chats as chat (chat.chatId)}
  <a href="/{chat.chatId}">{chat.name}</a>
{/each}
