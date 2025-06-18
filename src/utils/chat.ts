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
