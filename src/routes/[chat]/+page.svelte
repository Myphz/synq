<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { createChat, getChat } from "$lib/stores/chats.svelte";
  import { sendMessage } from "$lib/stores/socket.svelte";
  import ChatNavbar from "@molecules/chat-navbar.svelte";
  import Chat from "@organisms/chat.svelte";
  import { emptyChatResults } from "@utils/chat";
  import { untrack } from "svelte";

  const chatId = $derived(Number(page.params.chat));
  const chat = $derived(getChat(chatId));

  const shouldRefetchMessages = $derived(
    !chat?.isNew && !chat?.hasLatestUpdates
  );

  // NB: We need to $derive shouldRefetchMessages instead of calculating
  // it statically inside this $effect because otherwise
  // $effect deps checker gets confused and runs this many times.
  // Same for untrack() - without it, this gets called 4+ times instead of once.
  // It is probably because those values "jitter", or something.
  $effect(() => {
    if (shouldRefetchMessages) {
      untrack(() => {
        sendMessage({ type: "REQUEST_MESSAGES", chatId });
      });
    }
  });

  $effect(() => {
    if (chat?.isNew)
      (async () => {
        // If the chat is new, it only has 1 member (the other)
        const realChatId = await createChat(chat.members[0].id);
        await goto(`/${realChatId}`, { replaceState: true });
        emptyChatResults();
      })();
  });
</script>

<ChatNavbar {chatId} />
<Chat {chatId} />
