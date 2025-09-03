import { getSupabaseSession } from "$lib/supabase/auth/utils";
import { resetSingleton, toAsyncSingleton } from "@utils/async-singleton";
import {
  serverMessageSchema,
  type ClientMessage,
  type ServerMessage
} from "./protocol";
import {
  addChatMessage,
  initializeChats,
  markMessageAsRead,
  setChatMessages,
  updateUser
} from "$lib/stores/chats.svelte";
import { sleep } from "@utils/sleep";

const SERVER_URL = "wss://synq.fly.dev";
const SOCKET_SINGLETON_ID = "SOCKET";

export const closeSocket = async () => {
  const socket = await getSocket();
  socket.close();
};

export const getSocket_forced = async () => {
  resetSingleton(SOCKET_SINGLETON_ID);
  return await getSocket();
};

export const getSocket = toAsyncSingleton(async () => {
  const session = await getSupabaseSession();
  if (!session) throw new Error("getSocket(): unauthorized");
  const { access_token: jwt } = session;

  const socket = new WebSocket(SERVER_URL, ["synq", jwt]);

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
  onMessage(
    "RECEIVE_MESSAGE",
    (msg) =>
      addChatMessage(msg.chatId.toString(), {
        ...msg.data,
        senderId: msg.userId,
        isRead: false
      }),
    socket
  );
  onMessage(
    "READ_MESSAGE",
    (msg) => markMessageAsRead(msg.chatId.toString(), msg.data.messageId),
    socket
  );
  onMessage("UPDATE_USER_STATUS", (msg) =>
    updateUser({
      chatId: msg.chatId.toString(),
      userId: msg.userId,
      ...msg.data
    })
  );

  socket.addEventListener("error", async (e) => {
    console.error("SOCKET ERROR:", JSON.stringify(e));
    // Reconnect after 1s
    resetSingleton(SOCKET_SINGLETON_ID);
    await sleep(1000);
    getSocket();
  });

  socket.addEventListener("close", () => {
    console.error("SOCKET CLOSE");
  });

  while (socket.readyState !== WebSocket.OPEN) await sleep(50);

  return socket;
}, "SOCKET");

export const sendMessage = async (message: ClientMessage) => {
  const socket = await getSocket();
  socket.send(JSON.stringify(message));
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
