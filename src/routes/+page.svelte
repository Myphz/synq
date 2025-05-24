<script lang="ts">
  import type { ServerMessage } from "$lib/api/protocol";
  import { onMessage } from "$lib/api/ws";
  import { getJWT } from "$lib/supabase/client";

  let chats = $state<Extract<ServerMessage, { type: "INITIAL_SYNC" }>["chats"]>(
    []
  );

  onMessage((msg) => {
    chats = msg.chats.map((chat) => ({
      ...chat,
      name:
        chat.name ||
        chat.members.find((member) => member.id !== getJWT().id)?.name ||
        "UNKNOWN"
    }));
  }, "INITIAL_SYNC");
</script>

{#each chats as chat (chat.chatId)}
  <a href="/{chat.chatId}">{chat.name}</a>
{/each}
