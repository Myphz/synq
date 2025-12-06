import {
  serverMessageSchema,
  type ClientMessage,
  type ServerMessage
} from "$lib/api/protocol";

import { getSupabaseSession, getUserId } from "$lib/supabase/auth/utils";
import { sleep } from "@utils/sleep";

import {
  initializeChats,
  markMessageAsRead,
  updateUser,
  setChatMessages,
  addChatMessage
} from "./chats.svelte";
import { getCurrentChatByUrl, scrollChatToBottom } from "@utils/chat";
import { page } from "$app/state";
import { debugLog } from "@utils/debug";

const SERVER_URL = "wss://synq.fly.dev";

export const socket = $state<{ value: null | WebSocket; isLoading: boolean }>({
  value: null,
  isLoading: false
});

const setupSocket = (sock: WebSocket) => {
  sock.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    debugLog(message);
  });

  // Setup sock events
  onMessage("INITIAL_SYNC", (msg) => initializeChats(msg.chats), sock);
  onMessage(
    "GET_MESSAGES",
    (msg) =>
      setChatMessages(msg.chatId.toString(), msg.data.messages.toReversed()),
    sock
  );
  onMessage("RECEIVE_MESSAGE", (msg) => {
    addChatMessage(msg.chatId.toString(), {
      ...msg.data,
      senderId: msg.userId,
      isRead: false
    });
  });
  onMessage(
    "READ_MESSAGE",
    (msg) => markMessageAsRead(msg.chatId.toString(), msg.data.messageId),
    sock
  );
  onMessage(
    "UPDATE_USER_STATUS",
    (msg) =>
      updateUser({
        chatId: msg.chatId.toString(),
        userId: msg.userId,
        ...msg.data
      }),
    sock
  );

  onMessage("RECEIVE_MESSAGE", async (msg) => {
    if (page.url.pathname !== `/${msg.chatId}`) return;
    const IS_NEAR_BOTTOM_THRESHOLD = 300;

    const container = document.getElementById("messages")!;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      IS_NEAR_BOTTOM_THRESHOLD;

    // Scroll to view the last message if
    // the user is near bottom or the message is ours
    if (isNearBottom || msg.userId === (await getUserId()))
      scrollChatToBottom();
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

export const sendMessage = async (message: ClientMessage) => {
  const sock = await getSocket();
  while (sock.readyState !== WebSocket.OPEN) await sleep(50);
  sock.send(JSON.stringify(message));
};

export const connect = async () => {
  socket.isLoading = true;

  const session = await getSupabaseSession();
  if (!session) throw new Error("getSocket(): unauthorized");
  const { access_token: jwt } = session;

  const newSocket = new WebSocket(SERVER_URL, ["synq", jwt]);
  setupSocket(newSocket);

  socket.value = newSocket;
  socket.isLoading = false;

  // If the user is currently viewing a chat
  // when the connection is created,
  // fetch messages for that chat
  const currentChat = getCurrentChatByUrl();
  if (currentChat)
    sendMessage({ type: "REQUEST_MESSAGES", chatId: currentChat });

  return newSocket;
};

export const getSocket = async (): Promise<WebSocket> => {
  if (socket.value) return socket.value;
  if (socket.isLoading) {
    while (socket.isLoading) await sleep(50);
    return await getSocket();
  }

  return await connect();
};

export const disconnect = async () => {
  if (!socket.value) return;
  socket.value.close();
  socket.value = null;
};
