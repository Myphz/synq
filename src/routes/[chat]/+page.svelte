<script lang="ts">
  import { page } from "$app/state";
  import Chat from "@organisms/chat.svelte";

  const chatId = page.params.chat;
</script>

<Chat {chatId} />
