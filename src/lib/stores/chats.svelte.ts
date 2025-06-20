import type { ServerMessage } from "$lib/api/protocol";
import { getUserId } from "$lib/supabase/auth/utils";
import { supabase } from "$lib/supabase/client";
import { getChatName } from "@utils/chat";
import { throwError } from "@utils/throw-error";

export type Chat = Extract<
  ServerMessage,
  { type: "INITIAL_SYNC" }
>["chats"][number];

type Message = Extract<
  ServerMessage,
  { type: "GET_MESSAGES" }
>["data"]["messages"][number];

type ChatWithMessages = Chat & {
  messages: Message[];
  isInitialized: boolean;
  isNew?: boolean;
};

export const filter = $state<{ chats: "full" | "search" }>({ chats: "full" });

export const chats = $state<Record<string, ChatWithMessages>>({});
export const chatResults = $state<Record<string, ChatWithMessages>>({});

export const initializeChats = async (chatList: Chat[]) => {
  for (const chat of chatList) {
    const name = await getChatName(chat);

    chats[chat.chatId.toString()] = {
      ...chat,
      name,
      // Retain messages or set them to empty array
      messages: chats[chat.chatId.toString()]?.messages || [],
      isInitialized: chats[chat.chatId.toString()]?.isInitialized || false
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

export const getChat = (chatId: string | number) => {
  return (
    chatResults[chatId.toString()] ||
    chats[chatId.toString()] ||
    throwError(`getChat(): chat '${chatId}' not found`)
  );
};

type Member = {
  id: string;
  name: string;
  username: string;
  last_seen: string | null;
};

type CreateDirectChatResult = {
  chat_id: number;
  current_user: Member;
  other_user: Member;
};

export const createChat = async (userId: string) => {
  const { data } = await supabase
    .rpc("create_direct_chat", { p_other_user_id: userId })
    .throwOnError();

  const { chat_id, current_user, other_user } = data as CreateDirectChatResult;

  const newChat: ChatWithMessages = {
    chatId: chat_id,
    name: null,
    unreadMessagesCount: 0,
    messages: [],
    members: [current_user, other_user].map((user) => ({
      ...user,
      isOnline: false,
      isTyping: false,
      lastSeen: user.last_seen
    })),
    lastMessage: null,
    isInitialized: true
  };

  newChat.name = await getChatName(newChat);
  chats[chat_id] = newChat;

  return chat_id;
};
