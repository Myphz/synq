export const base64ToBuffer = (base64: string) =>
  Uint8Array.from(atob(sanitizeBase64(base64)), (c) => c.charCodeAt(0)).buffer;

const sanitizeBase64 = (base64: string) => {
  let encoded = base64.replace(/^data:(.*,)?/, "") || "";
  if (encoded.length % 4 > 0) {
    encoded += "=".repeat(4 - (encoded.length % 4));
  }
  return encoded;
};

export const addPrefixToBase64 = (base64: string, mimeType: string) => {
  if (base64.startsWith("data")) return base64;
  return `data:${mimeType};base64,${base64}`;
};

export const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
    reader.readAsDataURL(blob);
  });

export const base64ToBlob = async (base64: string, mimeType: string) =>
  await (await fetch(addPrefixToBase64(base64, mimeType))).blob();
