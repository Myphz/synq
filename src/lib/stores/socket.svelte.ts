import {
  serverMessageSchema,
  type ClientMessage,
  type ServerMessage
} from "$lib/api/protocol";

import { getSupabaseSession } from "$lib/supabase/auth/utils";
import { sleep } from "@utils/sleep";

import {
  initializeChats,
  markMessageAsRead,
  updateUser,
  setChatMessages,
  addChatMessage
} from "./chats.svelte";
import { scrollChatToBottomIfNear } from "@utils/chat";
import { page } from "$app/state";
import { debugLog } from "@utils/debug";
import { clearMonitorConnection, monitorConnection } from "./connection.svelte";
import { sendNotification } from "@utils/notifications";
import { toAtomic } from "@utils/atomic";
import { restoreAppState, saveAppState } from "$lib/api/cache";
import { throwError } from "@utils/throw-error";

const SERVER_URL = "wss://synq.fly.dev";

export const socket = $state<{ value: WebSocket | null }>({
  value: null
});

const setupSocket = (sock: WebSocket) => {
  sock.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    debugLog(message);
  });

  sock.addEventListener("close", onSocketClose);

  // Setup socket server events handlers
  onMessage("INITIAL_SYNC", (msg) => initializeChats(msg.chats), sock);
  onMessage(
    "GET_MESSAGES",
    (msg) => setChatMessages(msg.chatId, msg.data.messages.toReversed()),
    sock
  );
  onMessage("RECEIVE_MESSAGE", (msg) => {
    addChatMessage(msg.chatId, {
      ...msg.data,
      senderId: msg.userId,
      isRead: false
    });
  });
  onMessage(
    "READ_MESSAGE",
    (msg) => markMessageAsRead(msg.chatId, msg.data.messageId),
    sock
  );
  onMessage(
    "UPDATE_USER_STATUS",
    (msg) =>
      updateUser({
        chatId: msg.chatId,
        userId: msg.userId,
        ...msg.data
      }),
    sock
  );

  onMessage("RECEIVE_MESSAGE", async (msg) => {
    // Send local notification if user is currently viewing other chat
    if (page.url.pathname !== `/${msg.chatId}`)
      return sendNotification(
        { content: msg.data.content, id: msg.data.id },
        msg.chatId
      );
    scrollChatToBottomIfNear();
  });

  sock.addEventListener("error", (e) => {
    console.error("SOCK ERROR", e);
  });
};

export const onMessage = async <T extends ServerMessage["type"]>(
  type: T,
  fn: (
    message: T extends string
      ? Extract<ServerMessage, { type: T }>
      : ServerMessage
  ) => unknown,
  sock?: WebSocket
) => {
  const socket = sock || (await getSocket());

  socket.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    // @ts-expect-error its ok
    if (message.type === type) fn(message);
  });
};

export const waitForMessage = async <T extends ServerMessage["type"]>(
  type: T
): Promise<Extract<ServerMessage, { type: T }>> => {
  const socket = await getSocket();

  return await new Promise((res) => {
    socket.addEventListener(
      "message",
      (msg) => {
        const message = serverMessageSchema.parse(JSON.parse(msg.data));
        if (message.type === type) {
          // @ts-expect-error its ok
          res(message);
        }
      },
      { once: true }
    );
  });
};

export const sendMessage = async (message: ClientMessage) => {
  const sock = await getSocket();
  while (sock.readyState !== WebSocket.OPEN) await sleep(50);
  sock.send(JSON.stringify(message));
};

export const connect = toAtomic(async () => {
  if (
    socket.value?.readyState === WebSocket.OPEN ||
    socket.value?.readyState === WebSocket.CONNECTING
  )
    return;

  const session = await getSupabaseSession();
  if (!session) return;

  const { access_token: jwt } = session;

  const newSocket = new WebSocket(SERVER_URL, ["synq", jwt]);
  setupSocket(newSocket);

  socket.value = newSocket;

  monitorConnection();
});

export const getSocket = async (): Promise<WebSocket> => {
  if (socket.value) return socket.value;
  await connect();

  if (!socket.value)
    return throwError(
      "getSocket(): socket is null after calling connect()?!?!?"
    );
  return socket.value;
};

export const onSocketClose = async () => {
  await resetSocket();
  await connect();
};

export const resetSocket = async () => {
  // Mark all chats data as dirty
  await saveAppState();
  await restoreAppState();

  clearMonitorConnection();
  if (!socket.value) return;

  socket.value.close();
  socket.value = null;
};

export const disconnect = toAtomic(async () => {
  socket.value?.removeEventListener("close", onSocketClose);
  await resetSocket();
});
