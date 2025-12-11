import type { PickedFile, PickFileProps } from "./pick";

/* eslint-disable unicorn/prefer-add-event-listener */
export const DEBUG_INPUT_ID = "file-input-debug";

export const addDebugInputFile = () => {
  const input = document.createElement("input");
  input.id = DEBUG_INPUT_ID;
  input.className = "sr-only";
  input.type = "file";
  document.body.append(input);
};

export const pickFiles_web = ({ multiple, type }: PickFileProps) => {
  const htmlInput = document.getElementById(
    DEBUG_INPUT_ID
  )! as HTMLInputElement;
  if (multiple) htmlInput.setAttribute("multiple", "true");
  if (type === "image") htmlInput.setAttribute("accept", "image/*");

  return new Promise<PickedFile[]>((res) => {
    htmlInput.addEventListener(
      "change",
      async (e: Event) => {
        const files = await Promise.all(
          [...((e.target as HTMLInputElement).files || [])].map(
            async (file) => ({
              data: await fileToBase64(file),
              name: file.name
            })
          )
        );

        htmlInput.removeAttribute("multiple");
        htmlInput.removeAttribute("accept");
        // Real type is { data: string }
        res(files as unknown as PickedFile[]);
      },
      { once: true }
    );

    htmlInput.showPicker();
  });
};

export const fileToBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const encoded = reader.result?.toString() || "";
      resolve(encoded);
    };
    reader.onerror = (error) => reject(error);
  });
