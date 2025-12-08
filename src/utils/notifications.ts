import { PushNotifications } from "@capacitor/push-notifications";
import type { Message } from "./message";
import { LocalNotifications } from "@capacitor/local-notifications";
import { chats } from "$lib/stores/chats.svelte";
import { getChatName, getChatOtherMember } from "./chat";

const hashStr = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash | 0;
  }
  return hash & 0x7f_ff_ff_ff;
};

export const sendNotification = async (
  message: Pick<Message, "content" | "id">,
  chatId: number
) => {
  const chat = chats[chatId];
  if (!chat) throw new Error("sendNotification(): can't find chat!");

  const otherMember = await getChatOtherMember(chat);

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
  // We don't know if the notification we need to clear is a
  // LOCAL notification (sent by the client to itself)
  // or a SERVER notification (sent by the server when the app was offline)
  // so we need to try both
  const { notifications: localNotifications } =
    await LocalNotifications.getDeliveredNotifications();
  const localNotificationToDelete = localNotifications.find(
    (notification) => notification.extra?.messageId === messageId
  );
  if (localNotificationToDelete)
    await LocalNotifications.removeDeliveredNotifications({
      notifications: [localNotificationToDelete]
    });

  const { notifications: serverNotifications } =
    await PushNotifications.getDeliveredNotifications();
  const serverNotificationToDelete = serverNotifications.find(
    (notification) => notification.data?.messageId === messageId
  );
  if (serverNotificationToDelete)
    await PushNotifications.removeDeliveredNotifications({
      notifications: [serverNotificationToDelete]
    });
};
