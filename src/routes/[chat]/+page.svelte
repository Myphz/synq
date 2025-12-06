<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { createChat, getChat } from "$lib/stores/chats.svelte";
  import ChatNavbar from "@molecules/chat-navbar.svelte";
  import Chat from "@organisms/chat.svelte";

  const chatId = $derived(Number(page.params.chat));
  const chat = $derived(getChat(chatId));

  $effect(() => {
    (async () => {
      if (!chat?.isNew) return;
      // If the chat is new, it only has 1 member (the other)
      const realChatId = await createChat(chat.members[0].id);
      goto(`/${realChatId}`, { replaceState: true });
    })();
  });
</script>

<ChatNavbar {chatId} />
<Chat {chatId} />
