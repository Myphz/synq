import { Filesystem } from "@capacitor/filesystem";
import { throwError } from "@utils/throw-error";
import { base64ToBuffer } from "./base64";
import type { PickedFile } from "@capawesome/capacitor-file-picker";
import { convertImageToWebP } from "./convert";

export const readFileAsBase64 = async (file: PickedFile) => {
  if (!file.path) throw new Error("file has no path");
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
  const baseImage = await readFileAsBuffer(image);
  // Important: get metadata from raw image, before compression!
  // (compression removes metadata)
  const compressed = await convertImageToWebP(baseImage);
  const name = image.name || "blob";

  return { data: compressed, name };
};
