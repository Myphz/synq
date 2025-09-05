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

const SERVER_URL = "wss://synq.fly.dev";

let socket = $state<null | WebSocket>(null);

const setupSocket = (socket: WebSocket) => {
  socket.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    console.log(message);
  });

  // Setup socket events
  onMessage("INITIAL_SYNC", (msg) => initializeChats(msg.chats), socket);
  onMessage(
    "GET_MESSAGES",
    (msg) =>
      setChatMessages(msg.chatId.toString(), msg.data.messages.toReversed()),
    socket
  );
  onMessage("RECEIVE_MESSAGE", (msg) =>
    addChatMessage(msg.chatId.toString(), {
      ...msg.data,
      senderId: msg.userId,
      isRead: false
    })
  );
  onMessage(
    "READ_MESSAGE",
    (msg) => markMessageAsRead(msg.chatId.toString(), msg.data.messageId),
    socket
  );
  onMessage(
    "UPDATE_USER_STATUS",
    (msg) =>
      updateUser({
        chatId: msg.chatId.toString(),
        userId: msg.userId,
        ...msg.data
      }),
    socket
  );
  socket.addEventListener("error", async (e) => {
    console.error("SOCKET ERROR:", JSON.stringify(e));
    // Reconnect after 1s
    await sleep(1000);
    getSocket();
  });

  socket.addEventListener("close", () => {
    console.error("SOCKET CLOSE");
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

export const sendMessage = async (message: ClientMessage) => {
  const socket = await getSocket();
  socket.send(JSON.stringify(message));
};

export const getSocket = async () => {
  if (socket) return socket;

  const session = await getSupabaseSession();
  if (!session) throw new Error("getSocket(): unauthorized");
  const { access_token: jwt } = session;

  const newSocket = new WebSocket(SERVER_URL, ["synq", jwt]);
  setupSocket(newSocket);

  socket = newSocket;
  return socket;
};

export const closeSocket = async () => {
  if (!socket) return;
  const oldSocket = await getSocket();
  oldSocket.close();
  socket = null;
};
