import { goto } from "$app/navigation";
import { getDefaultAvatar } from "$lib/api/avatar";
import type { ServerMessage } from "$lib/api/protocol";
import { getUserId } from "$lib/supabase/auth/utils";
import { supabase } from "$lib/supabase/client";
import { Capacitor } from "@capacitor/core";
import { getChatImage, getChatName } from "@utils/chat";
import { throwError } from "@utils/throw-error";

export type Chat = Extract<
  ServerMessage,
  { type: "INITIAL_SYNC" }
>["chats"][number];

type Message = Extract<
  ServerMessage,
  { type: "GET_MESSAGES" }
>["data"]["messages"][number];

export type ChatWithMessages = Chat & {
  messages: Message[];
  image: string;
  hasLatestUpdates: boolean;
  isNew?: boolean;
};

export const filter = $state<{ chats: "full" | "search" }>({ chats: "full" });

export const chats = $state<Record<string, ChatWithMessages>>({});
export const chatResults = $state<Record<string, ChatWithMessages>>({});

export const initializeChats = async (chatList: Chat[]) => {
  for (const chat of chatList) {
    const name = await getChatName(chat);
    const image = await getChatImage(chat);

    // NB: We are not emptying chats from cache
    chats[chat.chatId.toString()] = {
      ...chat,
      name,
      image,
      // Retain messages or set them to empty array
      messages: chats[chat.chatId.toString()]?.messages || [],
      hasLatestUpdates: chats[chat.chatId.toString()]?.hasLatestUpdates || false
    };
  }
};

export const setChatMessages = (chatId: string, newMessages: Message[]) => {
  if (!chats[chatId]) throw new Error("setChatMessages(): can't find chat");
  chats[chatId].messages = newMessages;
  chats[chatId].hasLatestUpdates = true;
};

export const addChatMessage = async (chatId: string, message: Message) => {
  if (!chats[chatId]) throw new Error("addChatMessage(): can't find chat");
  chats[chatId].lastMessage = message;

  if (message.senderId !== (await getUserId()))
    chats[chatId].unreadMessagesCount++;

  // Don't push messages if the chat was not initialized, the chat doesn't contain any message!
  if (!chats[chatId].hasLatestUpdates) return;
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
  const ret = chatResults[chatId.toString()] || chats[chatId.toString()];
  if (!ret)
    if (Capacitor.getPlatform() === "web") goto("/");
    else throwError(`getChat(): chat '${chatId}' not found`);

  return ret;
};

type Member = {
  id: string;
  name: string;
  username: string;
  last_seen: string | null;
  avatar_url: string;
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
    image: other_user.avatar_url || getDefaultAvatar(other_user.id),
    members: [current_user, other_user].map((user) => ({
      ...user,
      isOnline: false,
      isTyping: false,
      lastSeen: user.last_seen,
      avatarUrl: user.avatar_url
    })),
    lastMessage: null,
    hasLatestUpdates: true
  };

  newChat.name = await getChatName(newChat);
  chats[chat_id] = newChat;

  return chat_id;
};

export const isUserOnline = (userId: string) => {
  const relevantChat = Object.values(chats).find(
    (chat) => !!chat.members.find((member) => member.id === userId)
  );

  // We have no idea if the user is online or not...
  if (!relevantChat) return false;
  return relevantChat.members.find((member) => member.id === userId)!.isOnline;
};

export const setChats = (newChats: Record<string, ChatWithMessages>) => {
  Object.entries(newChats).forEach(([key, value]) => {
    chats[key] = value;
  });
};
