import { getSupabaseSession_forced } from "$lib/supabase/auth/utils";
import { toAsyncSingleton } from "@utils/async-singleton";
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
  setChatMessages
} from "$lib/stores/chats.svelte";

const SERVER_URL = "wss://synq.fly.dev";

export const getSocket = toAsyncSingleton(async () => {
  await authGuard();
  const { access_token: jwt } = (await getSupabaseSession_forced()) || {};

  const socket = new WebSocket(SERVER_URL, ["synq", jwt]);
  // Message handling
  socket.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    console.log(message);

    if (message.type === "INITIAL_SYNC") initializeChats(message.chats);
    if (message.type === "GET_MESSAGES")
      setChatMessages(
        message.chatId.toString(),
        message.data.messages.toReversed()
      );
    if (message.type === "RECEIVE_MESSAGE")
      addChatMessage(message.chatId.toString(), {
        ...message.data,
        senderId: message.userId,
        isRead: false
      });
    if (message.type === "READ_MESSAGE")
      markMessageAsRead(message.chatId.toString(), message.data.messageId);
  });

  socket.addEventListener("error", (e) =>
    console.error("SOCKET ERROR:", JSON.stringify(e))
  );

  while (socket.readyState !== WebSocket.OPEN) {
    await new Promise((res) => setTimeout(res, 50));
  }

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
  ) => unknown
) => {
  const socket = await getSocket();

  socket.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    // @ts-expect-error its ok
    if (message.type === type) fn(message);
  });
};
