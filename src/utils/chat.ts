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
