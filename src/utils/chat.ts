import { page } from "$app/state";
import { getDefaultAvatar } from "$lib/api/avatar";
import { chats, type Chat } from "$lib/stores/chats.svelte";
import { getUserId } from "$lib/supabase/auth/utils";

export const getChatName = async (chat: Chat) => {
  const currentUserId = await getUserId();

  return (
    chat.name ||
    chat.members.find((m) => m.id !== currentUserId)?.name ||
    "UNKNOWN"
  );
};

export const getChatImage = async (chat: Chat) => {
  const currentUserId = await getUserId();
  const otherUser = chat.members.find((m) => m.id !== currentUserId);

  return (
    otherUser?.avatarUrl ||
    getDefaultAvatar(otherUser?.id || chat.chatId.toString())
  );
};

export const scrollChatToBottom = async (
  behavior: "smooth" | "instant" = "smooth"
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
  if (isNearBottom) scrollChatToBottom();
};

export const getCurrentChatByUrl = () => {
  const regex = /^\/\d+$/;
  if (regex.test(page.url.pathname)) return Number(page.url.pathname.slice(1));
};
