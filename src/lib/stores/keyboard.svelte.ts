import { Keyboard } from "@capacitor/keyboard";
import { scrollChatToBottom } from "@utils/chat";

export const isKeyboardOpen = $state({ value: false });

export const setKeyboardStoreListeners = () => {
  Keyboard.addListener("keyboardWillShow", () => (isKeyboardOpen.value = true));
  Keyboard.addListener(
    "keyboardWillHide",
    () => (isKeyboardOpen.value = false)
  );
  Keyboard.addListener("keyboardDidShow", () => scrollChatToBottom("smooth"));
};
