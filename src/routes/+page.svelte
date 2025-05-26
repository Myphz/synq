<script lang="ts">
  import { chats } from "$lib/stores/sync.svelte";
</script>

<h1 class="text-h-1">SYNQ</h1>

{#each chats as chat (chat.chatId)}
  <a href="/{chat.chatId}">{chat.name}</a>
{/each}
