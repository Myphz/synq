const QUALITY = 0.75;
const MAX_DIMENSION = 3000;

const getResizedDimensions = (
  originalWidth: number,
  originalHeight: number
) => {
  let width = originalWidth;
  let height = originalHeight;

  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const aspectRatio = width / height;

    if (width > height) {
      // Width exceeds the limit, set width to MAX_DIMENSION
      width = MAX_DIMENSION;
      height = Math.round(width / aspectRatio);
    } else {
      // Height exceeds the limit, set height to MAX_DIMENSION
      height = MAX_DIMENSION;
      width = Math.round(height * aspectRatio);
    }
  }

  return { width, height };
};

export const convertImageToWebP = async (blob: Blob) => {
  const imageBitmap = await createImageBitmap(blob);
  const { width, height } = getResizedDimensions(
    imageBitmap.width,
    imageBitmap.height
  );

  const canvas = new OffscreenCanvas(width, height);
  const context = canvas.getContext("2d")!;

  context.drawImage(imageBitmap, 0, 0, width, height);
  imageBitmap.close();

  return await canvas.convertToBlob({ type: "image/webp", quality: QUALITY });
};

export const convertBlobToJpeg = async (blob: Blob) => {
  const src = URL.createObjectURL(blob);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  const image = new Image();
  image.src = src;
  image.crossOrigin = "anonymous";

  return new Promise<Blob>((resolve, reject) => {
    image.addEventListener("load", (e) => {
      canvas.width = image.width;
      canvas.height = image.height;
      // @ts-expect-error its ok
      URL.revokeObjectURL(e.target.src);
      // @ts-expect-error its ok
      context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (data) => {
          resolve(data as Blob);
        },
        "image/jpeg",
        1
      );
    });

    image.addEventListener("error", (e) => reject(e));
  });
};
