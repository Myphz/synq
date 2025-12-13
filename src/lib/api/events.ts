import { page } from "$app/state";
import {
  addChatMessage,
  initializeChats,
  markMessageAsRead,
  setChatMessages,
  updateUser
} from "$lib/stores/chats.svelte";
import { addEventListener } from "$lib/stores/socket.svelte";
import { scrollChatToBottomIfNear } from "@utils/chat";
import { sendNotification } from "@utils/notifications";

export const setupSocketEventHandlers = () => {
  addEventListener("INITIAL_SYNC", (msg) => initializeChats(msg.chats));
  addEventListener("GET_MESSAGES", (msg) =>
    setChatMessages(msg.chatId, msg.data.messages.toReversed())
  );
  addEventListener("RECEIVE_MESSAGE", (msg) => {
    addChatMessage(msg.chatId, {
      ...msg.data,
      senderId: msg.userId,
      isRead: false
    });
  });
  addEventListener("READ_MESSAGE", (msg) =>
    markMessageAsRead(msg.chatId, msg.data.messageId)
  );
  addEventListener("UPDATE_USER_STATUS", (msg) =>
    updateUser({
      chatId: msg.chatId,
      userId: msg.userId,
      ...msg.data
    })
  );
  addEventListener("RECEIVE_MESSAGE", async (msg) => {
    // Send local notification if user is currently viewing other chat
    if (page.url.pathname !== `/${msg.chatId}`)
      return sendNotification(
        { content: msg.data.content, id: msg.data.id },
        msg.chatId
      );
    scrollChatToBottomIfNear();
  });
};
