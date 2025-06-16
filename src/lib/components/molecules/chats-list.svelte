<script lang="ts">
  import { chatResults, chats } from "$lib/stores/chats.svelte";
  import ChatPreview from "@atoms/chat-preview.svelte";
  import { isObjectBlank } from "@utils/objects";

  const chatsToShow = $derived(
    isObjectBlank(chatResults) ? chats : chatResults
  );

  const sortedChats = $derived(
    Object.values(chatsToShow).toSorted((c1, c2) => {
      const c1Time = c1.lastMessage ? +new Date(c1.lastMessage.sentAt) : 0;
      const c2Time = c2.lastMessage ? +new Date(c2.lastMessage.sentAt) : 0;
      return c2Time - c1Time;
    })
  );
</script>

<div class="flex flex-col gap-4 pt-4">
  {#each sortedChats as chat (chat.chatId)}
    <ChatPreview chatId={chat.chatId} />
  {/each}
</div>
