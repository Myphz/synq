import { Device } from "@capacitor/device";
import { toAsyncSingleton } from "./async-singleton";

export const isEdgeToEdgeEnabled = toAsyncSingleton(async () => {
  const info = await Device.getInfo();
  // Android >= 15 forces edge-to-edge -
  // the toolbar is transparent and overlaps
  return (
    info.platform === "android" && Number(info.osVersion.split(".")[0]) >= 15
  );
});
