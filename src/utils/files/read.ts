import { Filesystem } from "@capacitor/filesystem";
import { throwError } from "@utils/throw-error";
import { base64ToBuffer } from "./base64";
import { convertImageToWebP } from "./convert";
import { Capacitor } from "@capacitor/core";
import type { PickedFile } from "./pick";

export const readFileAsBase64 = async (file: PickedFile) => {
  if (file.data) return file.data;
  // For debugging purposes
  if (Capacitor.getPlatform() === "web")
    return (file as unknown as { data: string }).data;

  const { data } = await Filesystem.readFile({ path: file.path });
  if (!data)
    return throwError(
      "readImage(): given path has no data!",
      "Error reading image"
    );

  return data as string;
};

export const readFileAsBuffer = async (file: PickedFile) => {
  const base64Data = await readFileAsBase64(file);
  return base64ToBuffer(base64Data);
};

export const readFileAsBlob = async (file: PickedFile) => {
  const buffer = await readFileAsBuffer(file);
  return new Blob([buffer], { type: file.mimeType });
};

export const readImageAndCompress = async (image: PickedFile) => {
  const blob = await readFileAsBlob(image);
  // Important: get metadata from raw image, before compression!
  // (compression removes metadata)
  const compressed = await convertImageToWebP(blob);
  const name = image.name || "blob";

  return { data: compressed, name };
};
