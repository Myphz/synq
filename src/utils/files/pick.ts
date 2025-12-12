import { Capacitor } from "@capacitor/core";
import {
  FilePicker,
  type PickedFile as _PickedFile
} from "@capawesome/capacitor-file-picker";
import { throwError } from "@utils/throw-error";
import { pickFiles_web } from "./debug";
import { Keyboard } from "@capacitor/keyboard";
import { isKeyboardOpen } from "$lib/stores/keyboard.svelte";

export type PickFileProps = {
  type: "image" | "file";
  multiple?: boolean;
};

export type PickedFile = Omit<_PickedFile, "path"> & { path: string };

export const pickFiles = async (props: PickFileProps) => {
  const wasKeyboardOpen = isKeyboardOpen.value;

  try {
    const { multiple = props.type !== "image", type } = props || {};
    if (Capacitor.getPlatform() === "web")
      return await pickFiles_web({ type, multiple });

    await checkPermissions();
    const pickFn =
      type === "image" ? FilePicker.pickImages : FilePicker.pickFiles;

    const { files } = await pickFn({ limit: multiple ? 0 : 1, readData: true });

    if (files.some((file) => !file.path))
      return throwError(
        "pickImages() - file doesn't have a path??",
        "Error reading images"
      );

    return files as PickedFile[];
  } finally {
    if (wasKeyboardOpen) Keyboard.show();
  }
};

const checkPermissions = async () => {
  const { readExternalStorage } = await FilePicker.checkPermissions();
  if (readExternalStorage !== "granted") await FilePicker.requestPermissions();
};
