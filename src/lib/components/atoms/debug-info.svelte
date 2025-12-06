<script lang="ts">
  import { latestMessageLog } from "$lib/stores/debug.svelte";
  import { socket } from "$lib/stores/socket.svelte";
  import { onMount } from "svelte";

  const SOCKET_READY_STATE_LABELS: Record<number, string> = {
    0: "CONNECTING...",
    1: "CONNECTED",
    2: "CLOSING...",
    3: "CLOSED"
  };

  let rerenderKey = 0;

  onMount(() => {
    setInterval(() => (rerenderKey = Math.random()), 10);
  });
</script>

{#key rerenderKey}
  <div class="absolute right-2 top-2 w-[50vw] bg-background bg-opacity-50 p-4">
    {#if !socket.value}
      <div>Socket IS UNDEFINED!</div>
    {:else}
      <div>
        Connection status: {SOCKET_READY_STATE_LABELS[socket.value.readyState]}
      </div>
    {/if}

    {#if latestMessageLog.log}
      <div class="line-clamp-3">Latest log: {latestMessageLog.log}</div>
    {/if}
  </div>
{/key}
