<script lang="ts" module>
  const TYPING_TIMEOUT_MS = 1000;
</script>

<script lang="ts">
  import type { ClientMessage } from "$lib/api/protocol";
  import Form from "@atoms/form.svelte";
  import Messages from "@molecules/messages.svelte";
  import { onMount } from "svelte";
  import z from "zod";
  import { debounceWithStartStop } from "@utils/debounce";
  import { twMerge } from "tailwind-merge";
  import { Keyboard } from "@capacitor/keyboard";
  import { Capacitor } from "@capacitor/core";
  import { sendMessage } from "$lib/stores/socket.svelte";
  import { scrollChatToBottom } from "@utils/chat";
  import { getChat } from "$lib/stores/chats.svelte";
  import MessageTextarea from "@molecules/message-textarea.svelte";

  type Props = {
    chatId: number;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));

  // Disable sending socket messages if current chat is new
  const send = (...props: Parameters<typeof sendMessage>) => {
    if (chat?.isNew) return;
    return sendMessage(...props);
  };

  let textareaRef: MessageTextarea;
  let shouldShowBottomPadding = $state(true);

  onMount(() => {
    scrollChatToBottom("instant");

    if (Capacitor.getPlatform() === "web") return;

    Keyboard.addListener("keyboardWillShow", () => {
      shouldShowBottomPadding = false;
    });

    Keyboard.addListener("keyboardWillHide", () => {
      shouldShowBottomPadding = true;
    });

    return Keyboard.removeAllListeners;
  });

  const schema = z.object({
    message: z.string().min(1)
  });

  const onSubmit = ({ message }: z.infer<typeof schema>) => {
    const socketMessage: ClientMessage = {
      type: "SEND_MESSAGE",
      chatId,
      data: {
        content: message.trim()
      }
    };

    send(socketMessage);
    textareaRef.resetSize();
  };

  const onTyping = debounceWithStartStop((isTyping) => {
    send({
      type: "UPDATE_USER_TYPING",
      chatId: chatId,
      data: {
        isTyping
      }
    });
  }, TYPING_TIMEOUT_MS);
</script>

<Messages {chatId} />

<Form
  id="chat-form"
  class={twMerge("escape-x relative -bottom-6")}
  {schema}
  onsubmit={onSubmit}
>
  <MessageTextarea
    bind:this={textareaRef}
    oninput={onTyping}
    onresize={(forced) => scrollChatToBottom(forced ? "smooth" : "instant")}
    name="message"
  />
  {#if shouldShowBottomPadding}
    <div class="h-12 w-full bg-background"></div>
  {/if}
</Form>
