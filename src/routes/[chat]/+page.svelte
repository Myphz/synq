<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { createChat } from "$lib/stores/chats.svelte";
  import ChatNavbar from "@molecules/chat-navbar.svelte";
  import Chat from "@organisms/chat.svelte";

  const chatId = $derived(page.params.chat);

  $effect(() => {
    (async () => {
      const isNew = !!page.url.searchParams.get("isnew");
      if (!isNew) return;

      const realChatId = await createChat(chatId);
      goto(`/${realChatId}`);
    })();
  });
</script>

<ChatNavbar {chatId} />
<Chat {chatId} />
