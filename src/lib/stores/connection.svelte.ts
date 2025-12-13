import { getSocket } from "./socket.svelte";

let intervalId: NodeJS.Timeout | null = null;
export const isConnected = $state<{ value: boolean }>({ value: false });

export const clearMonitorConnection = () => {
  if (intervalId) clearInterval(intervalId);
};

// Not the most elegant way to do this... But who cares.
export const monitorConnection = () => {
  clearMonitorConnection();

  intervalId = setInterval(() => {
    const socket = getSocket();
    isConnected.value = !!socket && socket.readyState === WebSocket.OPEN;
  }, 100);
};
