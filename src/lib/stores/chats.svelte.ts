import type { ServerMessage } from "$lib/api/protocol";
import { getUserId } from "$lib/supabase/auth/utils";
import { throwError } from "@utils/throw-error";

type Chat = Extract<ServerMessage, { type: "INITIAL_SYNC" }>["chats"][number];

type Message = Extract<
  ServerMessage,
  { type: "GET_MESSAGES" }
>["data"]["messages"][number];

type ChatWithMessages = Chat & {
  messages: Message[];
};

export const chats = $state<Record<string, ChatWithMessages>>({});

export const initializeChats = async (chatList: Chat[]) => {
  const currentUserId = await getUserId();

  for (const chat of chatList) {
    const name =
      chat.name ||
      chat.members.find((m) => m.id !== currentUserId)?.name ||
      "UNKNOWN";

    chats[chat.chatId] = {
      ...chat,
      name,
      messages: []
    };
  }
};

export const setChatMessages = (chatId: string, newMessages: Message[]) => {
  if (!chats[chatId]) throw new Error("setChatMessages(): can't find chat");
  chats[chatId].messages = newMessages;
};

export const addChatMessage = (chatId: string, message: Message) => {
  if (!chats[chatId]) throw new Error("addChatMessage(): can't find chat");
  chats[chatId].messages.push(message);
};

export const markMessageAsRead = (chatId: string, messageId: Message["id"]) => {
  const msgIdx =
    chats[chatId]?.messages.findIndex((msg) => msg.id === messageId) || -1;
  if (msgIdx === -1) throw new Error("markMessageAsRead: can't find message");
  chats[chatId].messages[msgIdx].isRead = true;
};

export const getChat = (chatId: string) =>
  chats[chatId] || throwError("getChat(): chat not found");
