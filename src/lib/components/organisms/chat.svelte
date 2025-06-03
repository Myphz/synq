<script lang="ts" module>
  const TYPING_TIMEOUT_MS = 1000;
</script>

<script lang="ts">
  import type { ClientMessage } from "$lib/api/protocol";
  import { sendMessage } from "$lib/api/ws";
  import { getChat } from "$lib/stores/chats.svelte";
  import Form from "@atoms/form.svelte";
  import Input from "@atoms/input.svelte";
  import Messages from "@molecules/messages.svelte";
  import { onMount } from "svelte";
  import z from "zod";
  import { debounceWithStartStop } from "@utils/debounce";
  import { page } from "$app/state";
  import { twMerge } from "tailwind-merge";
  import { isEdgeToEdgeEnabled } from "@utils/edge-to-edge";
  import { Keyboard } from "@capacitor/keyboard";

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));
  let shouldShowBottomPadding = $state(true);

  onMount(() => {
    Keyboard.addListener("keyboardWillShow", () => {
      shouldShowBottomPadding = false;
    });

    Keyboard.addListener("keyboardWillHide", () => {
      shouldShowBottomPadding = true;
    });

    sendMessage({
      type: "REQUEST_MESSAGES",
      chatId
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

    sendMessage(socketMessage);
  };

  const onTyping = debounceWithStartStop((isTyping) => {
    sendMessage({
      type: "UPDATE_USER_TYPING",
      chatId: page.params.chat,
      data: {
        isTyping
      }
    });
  }, TYPING_TIMEOUT_MS);
</script>

<Messages {...chat.messages} />

{#await isEdgeToEdgeEnabled() then edgeToEdge}
  {#if edgeToEdge && shouldShowBottomPadding}
    <div class="h-12 w-full"></div>
  {/if}
{/await}

<Form
  class={twMerge("absolute bottom-0 left-0 w-dvw")}
  {schema}
  onsubmit={onSubmit}
>
  <Input oninput={onTyping} name="message" placeholder="Type message..." />
  {#await isEdgeToEdgeEnabled() then edgeToEdge}
    {#if edgeToEdge && shouldShowBottomPadding}
      <div class="h-12 w-full bg-background"></div>
    {/if}
  {/await}
</Form>
