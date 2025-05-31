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
  isInitialized: boolean;
};

export const chats = $state<Record<string, ChatWithMessages>>({});

export const initializeChats = async (chatList: Chat[]) => {
  const currentUserId = await getUserId();

  for (const chat of chatList) {
    const name =
      chat.name ||
      chat.members.find((m) => m.id !== currentUserId)?.name ||
      "UNKNOWN";

    chats[chat.chatId.toString()] = {
      ...chat,
      name,
      messages: [],
      isInitialized: false
    };
  }
};

export const setChatMessages = (chatId: string, newMessages: Message[]) => {
  if (!chats[chatId]) throw new Error("setChatMessages(): can't find chat");
  chats[chatId].messages = newMessages;
  chats[chatId].isInitialized = true;
};

export const addChatMessage = async (chatId: string, message: Message) => {
  if (!chats[chatId]) throw new Error("addChatMessage(): can't find chat");
  chats[chatId].lastMessage = message;

  if (message.senderId !== (await getUserId()))
    chats[chatId].unreadMessagesCount++;

  // Don't push messages if the chat was not initialized, the chat doesn't contain any message!
  if (!chats[chatId].isInitialized) return;
  chats[chatId].messages.push(message);
};

export const markMessageAsRead = (chatId: string, messageId: Message["id"]) => {
  const msgIdx =
    chats[chatId]?.messages.findIndex((msg) => msg.id === messageId) || -1;
  if (msgIdx === -1) throw new Error("markMessageAsRead: can't find message");

  chats[chatId].messages[msgIdx].isRead = true;

  chats[chatId].unreadMessagesCount = Math.min(
    chats[chatId].unreadMessagesCount - 1,
    0
  );
};

type UpdateUserParams = { userId: string; chatId: string } & Extract<
  ServerMessage,
  { type: "UPDATE_USER_STATUS" }
>["data"];

export const updateUser = ({ userId, chatId, ...status }: UpdateUserParams) => {
  const chat = chats[chatId] || throwError("updateUser(): chat not found");
  const memberIdx = chat.members.findIndex((member) => member.id === userId);
  if (memberIdx === -1) return;

  chats[chatId].members[memberIdx] = {
    ...chats[chatId].members[memberIdx],
    ...status
  };
};

export const getChat = (chatId: string | number) =>
  chats[chatId.toString()] || throwError("getChat(): chat not found");
