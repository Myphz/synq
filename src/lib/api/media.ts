import {
  sendMessage,
  waitForConnection,
  waitForMessage
} from "$lib/stores/socket.svelte";
import { getCurrentChatByUrl } from "@utils/chat";
import { pickFiles, type PickedFile } from "@utils/files/pick";
import { readImageAndCompress } from "@utils/files/read";
import { getImageUrl } from "@utils/message";
import { throwError } from "@utils/throw-error";

const uploadToR2 = async (url: string, blob: Blob) => {
  const uploadResponse = await fetch(url, {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": "image/webp"
    }
  });

  if (!uploadResponse.ok)
    throwError(`Cloudflare upload failed: ${uploadResponse.statusText}`);
};

export const sendImage = async () => {
  const chatId = getCurrentChatByUrl();
  if (!chatId) throwError("uploadImage: unknown chat id");

  const [image] = await pickFiles({ type: "image" });
  if (!image) return;

  await finishSendImage(image);
};

export const finishSendImage = async (image: PickedFile) => {
  const chatId = getCurrentChatByUrl();
  if (!chatId) return throwError("uploadImage: unknown chat id");

  const { data: blob } = await readImageAndCompress(image);

  await waitForConnection();

  const promise = waitForMessage("UPLOAD_PERMIT_GRANTED");
  await sendMessage({
    type: "REQUEST_UPLOAD",
    chatId
  });

  const {
    data: { key, signedUrl }
  } = await promise;

  await uploadToR2(signedUrl, blob);

  await sendMessage({
    type: "SEND_MESSAGE",
    chatId,
    data: {
      content: "Image",
      image: getImageUrl(key)
    }
  });
};
