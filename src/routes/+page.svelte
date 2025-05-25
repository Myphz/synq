<script lang="ts">
  import { chats } from "$lib/stores/sync.svelte";
</script>

{#each chats as chat (chat.chatId)}
  <a href="/{chat.chatId}">{chat.name}</a>
{/each}
