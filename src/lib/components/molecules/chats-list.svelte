<script lang="ts">
  import { chats } from "$lib/stores/sync.svelte";
  import ChatPreview from "@atoms/chat-preview.svelte";
</script>

<div class="flex flex-col gap-4">
  {#each chats as chat (chat.chatId)}
    <ChatPreview {...chat} />
  {/each}
</div>
