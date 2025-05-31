import { getSupabaseSession_forced } from "$lib/supabase/auth/utils";
import { resetSingletons, toAsyncSingleton } from "@utils/async-singleton";
import {
  serverMessageSchema,
  type ClientMessage,
  type ServerMessage
} from "./protocol";
import { authGuard } from "@utils/auth-guard";
import {
  addChatMessage,
  initializeChats,
  markMessageAsRead,
  setChatMessages,
  updateUser
} from "$lib/stores/chats.svelte";

const SERVER_URL = "wss://synq.fly.dev";

export const getSocket = toAsyncSingleton(async () => {
  await authGuard();
  const { access_token: jwt } = (await getSupabaseSession_forced()) || {};

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

  socket.addEventListener("error", (e) => {
    console.error("SOCKET ERROR:", JSON.stringify(e));
    // Reconnect after 1s
    resetSingletons();
    setTimeout(getSocket, 1000);
  });

  socket.addEventListener("close", () => {
    console.error("SOCKET CLOSE");
    // Reconnect after 1s
    resetSingletons();
    setTimeout(getSocket, 1000);
  });

  while (socket.readyState !== WebSocket.OPEN)
    await new Promise((res) => setTimeout(res, 50));

  return socket;
});

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
