<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { createChat } from "$lib/stores/chats.svelte";
  import ChatNavbar from "@molecules/chat-navbar.svelte";
  import Chat from "@organisms/chat.svelte";

  const chatId = page.params.chat;
  let shouldRender = $state(true);

  $effect(() => {
    (async () => {
      shouldRender = !page.url.searchParams.get("isnew");
      // If isnew search param is passed - chatId is actually
      // a user id we should create a chat with
      if (!shouldRender) {
        const realChatId = await createChat(chatId);
        goto(`/${realChatId}`);
      }
    })();
  });
</script>

{#if shouldRender}
  <ChatNavbar {chatId} />
  <Chat {chatId} />
{/if}
