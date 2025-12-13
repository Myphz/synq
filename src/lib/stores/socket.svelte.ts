import {
  serverMessageSchema,
  type ClientMessage,
  type ServerMessage
} from "$lib/api/protocol";

import { getSupabaseSession } from "$lib/supabase/auth/utils";
import { sleep } from "@utils/sleep";

import { debugLog } from "@utils/debug";
import { clearMonitorConnection, monitorConnection } from "./connection.svelte";
import { withMutex } from "@utils/mutex";
import { restoreAppState, saveAppState } from "$lib/api/cache";
import {
  getSingleton,
  resetSingleton,
  toAsyncSingleton
} from "@utils/async-singleton";

const SERVER_URL = "wss://synq.fly.dev";
const SOCKET_SINGLETON_ID = "socket";

const listeners = new Map<
  ServerMessage["type"],
  ((msg: ServerMessage) => unknown)[]
>();

export const connect = toAsyncSingleton(async () => {
  const session = await getSupabaseSession();
  if (!session) throw new Error("connect(): unauthenticated");

  const { access_token: jwt } = session;

  const newSocket = new WebSocket(SERVER_URL, ["synq", jwt]);
  setupSocket(newSocket);

  setTimeout(monitorConnection, 100);
  return newSocket;
}, SOCKET_SINGLETON_ID);

const setupSocket = (sock: WebSocket) => {
  sock.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    debugLog(message);
    listeners.get(message.type)?.forEach((fn) => fn(message));
  });

  sock.addEventListener("close", onSocketClose);

  sock.addEventListener("error", (e) => {
    console.error("SOCK ERROR", e);
  });
};

export const addEventListener = withMutex(
  <T extends ServerMessage["type"]>(
    type: T,
    listener: (msg: Extract<ServerMessage, { type: T }>) => unknown
  ) => {
    const existingListeners = listeners.get(type);
    const newListeners = [...(existingListeners || []), listener];
    // @ts-expect-error its ok
    listeners.set(type, newListeners);
  }
);

export const waitForMessage = async <T extends ServerMessage["type"]>(
  type: T
): Promise<Extract<ServerMessage, { type: T }>> => {
  const socket = await connect();

  return await new Promise((res) => {
    const onMessage = (msg: MessageEvent) => {
      const message = serverMessageSchema.parse(JSON.parse(msg.data));
      if (message.type === type) {
        // @ts-expect-error its ok
        res(message);
        socket.removeEventListener("message", onMessage);
      }
    };

    socket.addEventListener("message", onMessage);
  });
};

export const waitForConnection = async () => {
  const socket = await connect();
  while (socket.readyState !== WebSocket.OPEN) await sleep(50);
  return socket;
};

export const sendMessage = async (message: ClientMessage) => {
  const sock = await waitForConnection();
  sock.send(JSON.stringify(message));
};

export const onSocketClose = async () => {
  await resetSocket();
  await sleep(100);
  await connect();
};

export const resetSocket = async () => {
  // Mark all chats data as dirty
  await saveAppState();
  await restoreAppState();

  clearMonitorConnection();
  resetSingleton(SOCKET_SINGLETON_ID);
};

export const getSocket = () =>
  getSingleton(SOCKET_SINGLETON_ID) as WebSocket | undefined;

export const disconnect = withMutex(async () => {
  getSocket()?.removeEventListener("close", onSocketClose);
  getSocket()?.close();
  await resetSocket();
});
