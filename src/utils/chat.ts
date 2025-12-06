import { page } from "$app/state";
import { getDefaultAvatar } from "$lib/api/avatar";
import type { Chat } from "$lib/stores/chats.svelte";
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

export const scrollChatToBottom = (
  behavior: "smooth" | "instant" = "smooth"
) => {
  const container = document.getElementById("messages");
  if (!container) return;

  container.scrollTo({
    top: container.scrollHeight,
    behavior
  });
};

export const getCurrentChatByUrl = () => {
  const regex = /^\/\d+$/;
  if (regex.test(page.url.pathname)) return Number(page.url.pathname.slice(1));
};
