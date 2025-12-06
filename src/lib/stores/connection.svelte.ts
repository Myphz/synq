import { connect, socket } from "./socket.svelte";

let intervalId: NodeJS.Timeout | null = null;
export const isConnected = $state<{ value: boolean }>({ value: false });

export const clearMonitorConnection = () => {
  if (intervalId) clearInterval(intervalId);
};

// Not the most elegant way to do this... But who cares.
export const monitorConnection = () => {
  clearMonitorConnection();

  intervalId = setInterval(() => {
    isConnected.value =
      !!socket.value && socket.value.readyState === WebSocket.OPEN;
    if (!isConnected.value) connect();
  }, 500);
};
