<script lang="ts">
  import { chatResults, chats, filter } from "$lib/stores/chats.svelte";
  import ChatPreview from "@atoms/chat-preview.svelte";
  import EmptyState from "@atoms/empty-state.svelte";

  const chatsToShow = $derived(
    filter.chats === "full" ? chats : chatResults.chats
  );

  const sortedChats = $derived(
    Object.values(chatsToShow).toSorted((c1, c2) => {
      const c1Time = c1.lastMessage ? +new Date(c1.lastMessage.sentAt) : 0;
      const c2Time = c2.lastMessage ? +new Date(c2.lastMessage.sentAt) : 0;
      return c2Time - c1Time;
    })
  );
</script>

{#if sortedChats.length}
  <div class="mt-4 flex flex-col gap-4">
    {#each sortedChats as chat (chat.chatId)}
      <ChatPreview chatId={chat.chatId} />
    {/each}
  </div>
{:else if !chatResults.isLoading}
  <EmptyState />
{/if}
