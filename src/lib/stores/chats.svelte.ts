import { goto } from "$app/navigation";
import { getDefaultAvatar } from "$lib/api/avatar";
import type { ServerMessage } from "$lib/api/protocol";
import { getUserId } from "$lib/supabase/auth/utils";
import { supabase } from "$lib/supabase/client";
import { Capacitor } from "@capacitor/core";
import { atomic } from "@utils/atomic";
import {
  getChatImage,
  getChatName,
  getCurrentChatByUrl,
  scrollChatToBottom,
  scrollChatToBottomIfNear
} from "@utils/chat";
import { clearNotification } from "@utils/notifications";
import { throwError } from "@utils/throw-error";
import { tick } from "svelte";
import { sendMessage } from "./socket.svelte";

type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

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
  isNew: false;
};

export type NewChat = Overwrite<ChatWithMessages, { isNew: true }>;

export const filter = $state<{ chats: "full" | "search" }>({ chats: "full" });

export const chats = $state<Record<number, ChatWithMessages | NewChat>>({});
export const chatResults = $state<{
  chats: Record<number, ChatWithMessages | NewChat>;
  isLoading: boolean;
}>({ chats: {}, isLoading: false });

export const initializeChats = async (chatList: Chat[]) => {
  const alreadyExistingChatIds = new Set(Object.keys(chats).map(Number));
  const serverChatIds = new Set(chatList.map((chat) => chat.chatId));
  const toDelete = alreadyExistingChatIds.difference(serverChatIds);

  for (const chatId of toDelete) delete chats[chatId];

  for (const chat of chatList) {
    const name = await getChatName(chat);
    const image = await getChatImage(chat);

    chats[chat.chatId] = {
      ...chat,
      name,
      image,
      // Retain messages or set them to empty array
      messages: chats[chat.chatId]?.messages || [],
      hasLatestUpdates: chats[chat.chatId]?.hasLatestUpdates || false,
      isNew: false
    };
  }
};

export const setChatMessages = async (
  chatId: number,
  newMessages: Message[]
) => {
  if (!chats[chatId]) throw new Error("setChatMessages(): can't find chat");

  const hadLatestUpdates = chats[chatId].hasLatestUpdates;

  chats[chatId] = {
    ...chats[chatId],
    messages: newMessages,
    hasLatestUpdates: true
  };

  await tick();

  if (!hadLatestUpdates) scrollChatToBottom("instant");
  else scrollChatToBottomIfNear();
};

export const addChatMessage = async (chatId: number, message: Message) => {
  // Ignore user updates from chat we don't know - it's probably a new chat
  if (!chats[chatId]) return;
  // Don't process duplicates
  if (chats[chatId].messages.find((msg) => msg.id === message.id)) return;

  chats[chatId].lastMessage = message;

  if (message.senderId !== (await getUserId()))
    chats[chatId].unreadMessagesCount++;

  chats[chatId].messages.push(message);

  // This is needed because the $effect who should
  // always request messages if needed is extremely flaky
  // and does not work in cases such as when uploading an image
  // (in that case, the app becomes temporarily not active and active again)
  if (!chats[chatId].hasLatestUpdates && getCurrentChatByUrl() === chatId)
    sendMessage({ type: "REQUEST_MESSAGES", chatId });
};

export const markMessageAsRead = async (
  chatId: number,
  messageId: Message["id"]
) => {
  const msgIdx =
    chats[chatId]?.messages.findIndex((msg) => msg.id === messageId) ?? -1;

  if (msgIdx === -1) throwError("markMessageAsRead: can't find message");

  chats[chatId].messages[msgIdx].isRead = true;
  const ourId = await getUserId();

  atomic(() => {
    chats[chatId].unreadMessagesCount = chats[chatId].messages.filter(
      (msg) => msg.senderId !== ourId && !msg.isRead
    ).length;
  }, "CALCULATE_CHAT_UNREAD_MESSAGES");

  if (chats[chatId].messages[msgIdx].senderId === ourId) return;
  clearNotification(messageId);
};

type UpdateUserParams = { userId: string; chatId: number } & Extract<
  ServerMessage,
  { type: "UPDATE_USER_STATUS" }
>["data"];

export const updateUser = ({ userId, chatId, ...status }: UpdateUserParams) => {
  const chat = chats[chatId];
  // Ignore user updates from chat we don't know - it's probably a new chat
  if (!chat) return;

  const memberIdx = chat.members.findIndex((member) => member.id === userId);
  if (memberIdx === -1) return;

  chats[chatId].members[memberIdx] = {
    ...chats[chatId].members[memberIdx],
    ...status
  };
};

export const getChat = (chatId: number) => {
  const ret = chatResults.chats[chatId] || chats[chatId];
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
    lastMessage: null,
    messages: [],
    name: null,
    unreadMessagesCount: 0,
    image: other_user.avatar_url || getDefaultAvatar(other_user.id),
    members: [current_user, other_user].map((user) => ({
      ...user,
      isOnline: false,
      isTyping: false,
      lastSeen: user.last_seen,
      avatarUrl: user.avatar_url
    })),
    hasLatestUpdates: true,
    isNew: false
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

export const setChats = (newChats: Record<number, ChatWithMessages>) => {
  Object.entries(newChats).forEach(([key, value]) => {
    chats[Number(key)] = value;
  });
};
