import type { ServerMessage } from "$lib/api/protocol";
import { getUserId } from "$lib/supabase/auth/utils";

export const chats = $state<
  Extract<ServerMessage, { type: "INITIAL_SYNC" }>["chats"]
>([]);

export const setChats = async (
  newChats: Extract<ServerMessage, { type: "INITIAL_SYNC" }>["chats"]
) => {
  const userId = await getUserId();

  chats.push(
    ...newChats.map((chat) => ({
      ...chat,
      name:
        chat.name ||
        chat.members.find((member) => member.id !== userId)?.name ||
        "UNKNOWN"
    }))
  );
};
