<script lang="ts" module>
  const TYPING_TIMEOUT_MS = 1000;
</script>

<script lang="ts">
  import type { ClientMessage } from "$lib/api/protocol";
  import Form from "@atoms/form.svelte";
  import Messages from "@molecules/messages.svelte";
  import { onMount, tick } from "svelte";
  import z from "zod";
  import { debounceWithStartStop } from "@utils/debounce";
  import { twMerge } from "tailwind-merge";
  import { isEdgeToEdgeEnabled } from "@utils/edge-to-edge";
  import { Keyboard } from "@capacitor/keyboard";
  import { Capacitor } from "@capacitor/core";
  import Textarea from "@atoms/textarea.svelte";
  import { sendMessage } from "$lib/stores/socket.svelte";
  import { scrollChatToBottom } from "@utils/chat";
  import { getChat } from "$lib/stores/chats.svelte";

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

  let textareaRef: Textarea;
  let shouldShowBottomPadding = $state(true);
  let messagesRef: Messages;

  const isEdgeToEdge = isEdgeToEdgeEnabled();

  onMount(() => {
    // Scroll to bottom on chat load after evaluating isEdgeToEdge
    isEdgeToEdge.then(async () => {
      await tick();
      scrollChatToBottom("instant");
    });

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
        content: message
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

<Messages bind:this={messagesRef} {chatId} />

<Form
  id="chat-form"
  class={twMerge("escape-x relative -bottom-6")}
  {schema}
  onsubmit={onSubmit}
>
  <Textarea
    bind:this={textareaRef}
    oninput={onTyping}
    onresize={(forced) => scrollChatToBottom(forced ? "smooth" : "instant")}
    name="message"
    placeholder="Type message..."
  />
  {#await isEdgeToEdge then edgeToEdge}
    {#if edgeToEdge && shouldShowBottomPadding}
      <div class="h-12 w-full bg-background"></div>
    {/if}
  {/await}
</Form>
