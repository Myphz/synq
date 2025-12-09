import type { Message } from "./message";
import { LocalNotifications } from "@capacitor/local-notifications";
import { chats } from "$lib/stores/chats.svelte";
import { getChatName } from "./chat";

const hashStr = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = Math.trunc((hash << 5) - hash + char);
  }

  // eslint-disable-next-line unicorn/number-literal-case
  return hash & 0x7f_ff_ff_ff;
};

export const sendNotification = async (
  message: Pick<Message, "content" | "id">,
  chatId: number
) => {
  const chat = chats[chatId];
  if (!chat) throw new Error("sendNotification(): can't find chat!");

  // const otherMember = await getChatOtherMember(chat);

  await LocalNotifications.schedule({
    notifications: [
      {
        id: hashStr(message.id),
        title: await getChatName(chat),
        channelId: "local_notifications",
        body: message.content,
        extra: {
          chatId: chatId.toString(),
          messageId: message.id
        },
        group: chatId.toString()
        // ...(otherMember.avatarUrl && { largeIcon: otherMember.avatarUrl }),
      }
    ]
  });
};

export const clearNotification = async (messageId: string) => {
  const { notifications } =
    await LocalNotifications.getDeliveredNotifications();

  const notificationId = hashStr(messageId);

  const notificationToDelete = notifications.find(
    (notification) =>
      notification.id === notificationId || notification.tag === messageId
  );

  if (notificationToDelete)
    await LocalNotifications.removeDeliveredNotifications({
      notifications: [notificationToDelete]
    });
};
