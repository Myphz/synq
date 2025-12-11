import { Capacitor } from "@capacitor/core";
import {
  FilePicker,
  type PickedFile as _PickedFile
} from "@capawesome/capacitor-file-picker";
import { throwError } from "@utils/throw-error";
import { pickFiles_web } from "./debug";

export type PickFileProps = {
  type: "image" | "file";
  multiple?: boolean;
};

export type PickedFile = Omit<_PickedFile, "path"> & { path: string };

export const pickFiles = async (props: PickFileProps) => {
  const { multiple = props.type !== "image", type } = props || {};
  if (Capacitor.getPlatform() === "web")
    return await pickFiles_web({ type, multiple });

  const pickFn =
    type === "image" ? FilePicker.pickImages : FilePicker.pickFiles;

  const { files } = await pickFn({ limit: multiple ? 0 : 1 });
  if (files.some((file) => !file.path))
    return throwError(
      "pickImages() - file doesn't have a path??",
      "Error reading images"
    );

  return files as PickedFile[];
};
