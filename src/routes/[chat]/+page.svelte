<script lang="ts">
  import { page } from "$app/state";
  import ChatNavbar from "@molecules/chat-navbar.svelte";
  import Chat from "@organisms/chat.svelte";

  const chatId = page.params.chat;
</script>

<ChatNavbar {chatId} />
<Chat {chatId} />
