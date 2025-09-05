<script lang="ts">
  import { socket } from "$lib/stores/socket.svelte";

  const isConnected = $derived(
    socket.value && socket.value.readyState !== WebSocket.CLOSED
  );
</script>

<div>
  {isConnected ? "ONLINE" : "OFFLINE"}
</div>
