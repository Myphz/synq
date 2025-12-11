import { sendMessage, waitForMessage } from "$lib/stores/socket.svelte";
import { getCurrentChatByUrl } from "@utils/chat";
import { pickFiles } from "@utils/files/pick";
import { readImageAndCompress } from "@utils/files/read";
import { getImageUrl } from "@utils/message";

const uploadToR2 = async (url: string, blob: Blob) => {
  const uploadResponse = await fetch(url, {
    method: "PUT",
    body: blob,
    headers: {
      "Content-Type": "image/webp"
    }
  });

  if (!uploadResponse.ok)
    throw new Error(`Cloudflare upload failed: ${uploadResponse.statusText}`);
};

export const sendImage = async () => {
  const chatId = getCurrentChatByUrl();
  if (!chatId) throw new Error("uploadImage: unknown chat id");

  const [image] = await pickFiles({ type: "image" });
  if (!image) return;

  const { data: blob } = await readImageAndCompress(image);

  sendMessage({
    type: "REQUEST_UPLOAD",
    chatId
  });

  const {
    data: { key, signedUrl }
  } = await waitForMessage("UPLOAD_PERMIT_GRANTED");

  await uploadToR2(signedUrl, blob);

  sendMessage({
    type: "SEND_MESSAGE",
    chatId,
    data: {
      content: "Image",
      image: getImageUrl(key)
    }
  });
};
