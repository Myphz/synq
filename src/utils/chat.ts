import { page } from "$app/state";
import { getDefaultAvatar } from "$lib/api/avatar";
import { chatResults, chats, type Chat } from "$lib/stores/chats.svelte";
import { getUserId } from "$lib/supabase/auth/utils";
import { throwError } from "./throw-error";

export const getChatOtherMember = async (chat: Chat) => {
  const currentUserId = await getUserId();
  if (chat.members.length > 2)
    throwError("getChatOtherMember: chat has more than 2 members!");

  return chat.members.find((m) => m.id !== currentUserId)!;
};

export const getChatName = async (chat: Chat) =>
  chat.name || (await getChatOtherMember(chat)).name;

export const getChatImage = async (chat: Chat) => {
  const currentUserId = await getUserId();
  const otherUser = chat.members.find((m) => m.id !== currentUserId);

  return (
    otherUser?.avatarUrl ||
    getDefaultAvatar(otherUser?.id || chat.chatId.toString())
  );
};

export const scrollChatToBottom = async (
  behavior: "smooth" | "instant" = "instant"
) => {
  const chatId = getCurrentChatByUrl();
  if (!chatId) return;

  const container = document.getElementById("messages")!;
  const me = await getUserId();
  const firstUnreadMessage = (chats[chatId]?.messages || []).find(
    (message) => message.isRead === false && message.senderId !== me
  );

  if (!firstUnreadMessage)
    return container.scrollTo({
      top: container.scrollHeight,
      behavior
    });

  const messageContainer = document.getElementById(
    `message-${firstUnreadMessage.id}`
  )!;

  messageContainer.scrollIntoView();
};

export const scrollChatToBottomIfNear = () => {
  const IS_NEAR_BOTTOM_THRESHOLD = 300;

  const container = document.getElementById("messages")!;
  if (!container) return;

  const isNearBottom =
    container.scrollHeight - container.scrollTop - container.clientHeight <
    IS_NEAR_BOTTOM_THRESHOLD;

  // Scroll to view the last message if the user is near bottom
  if (isNearBottom) scrollChatToBottom("smooth");
};

export const getCurrentChatByUrl = () => {
  const regex = /^\/\d+$/;
  if (regex.test(page.url.pathname)) return Number(page.url.pathname.slice(1));
};

export const emptyChatResults = () => {
  Object.keys(chatResults.chats).forEach(
    (key) => delete chatResults.chats[Number(key)]
  );
};
