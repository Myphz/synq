import { Keyboard } from "@capacitor/keyboard";

export const isKeyboardOpen = $state({ value: false });

export const setKeyboardStoreListeners = () => {
  Keyboard.addListener("keyboardDidShow", () => (isKeyboardOpen.value = true));
  Keyboard.addListener("keyboardDidHide", () => (isKeyboardOpen.value = false));
};
