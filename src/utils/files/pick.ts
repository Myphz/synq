import { FilePicker } from "@capawesome/capacitor-file-picker";

export const pickImage = async () => {
  const { files } = await FilePicker.pickImages({ limit: 1 });
  if (!files?.length) return null;

  const file = files[0];
  return file;
};
