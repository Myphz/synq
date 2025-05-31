<script lang="ts">
  import { getSocket } from "$lib/api/ws";
  import ChatsList from "@molecules/chats-list.svelte";
  import { onMount } from "svelte";

  onMount(() => {
    getSocket();
  });
</script>

<ChatsList />
