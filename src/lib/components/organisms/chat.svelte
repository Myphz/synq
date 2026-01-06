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
  import { sendMessage } from "$lib/stores/socket.svelte";
  import { scrollChatToBottom } from "@utils/chat";
  import { getChat } from "$lib/stores/chats.svelte";
  import MessageTextarea from "@molecules/message-textarea.svelte";
  import { isKeyboardOpen } from "$lib/stores/keyboard.svelte";
  import { closeExpandedImage, expandedImage } from "$lib/stores/image.svelte";
  import Icon from "@atoms/icon.svelte";
  import ZoomableImage from "@molecules/zoomable-image.svelte";

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

  onMount(() => {
    scrollChatToBottom();
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
  {#if !isKeyboardOpen.value}
    <div class="bg-background h-12 w-full"></div>
  {/if}
</Form>

{#if expandedImage.value}
  {@const url = chat?.messages?.find(
    (msg) => msg.id === expandedImage.value
  )?.image}
  <div class="fixed inset-0 bg-black">
    <nav class="m-4">
      <button onclick={closeExpandedImage}>
        <Icon class="text-h-3" name="arrow_back_ios" />
      </button>
    </nav>
    <ZoomableImage src={url!} />
  </div>
{/if}
