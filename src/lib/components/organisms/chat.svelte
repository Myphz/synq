<script lang="ts" module>
  const TYPING_TIMEOUT_MS = 1000;
</script>

<script lang="ts">
  import type { ClientMessage } from "$lib/api/protocol";
  import { sendMessage } from "$lib/api/ws";
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
  import { Capacitor } from "@capacitor/core";

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  const isNew = $derived(!!page.url.searchParams.get("isnew"));

  // Disable sending socket messages if current chat is new
  const send = $derived(isNew ? () => {} : sendMessage);

  let shouldShowBottomPadding = $state(true);

  onMount(() => {
    send({
      type: "REQUEST_MESSAGES",
      chatId
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
  };

  const onTyping = debounceWithStartStop((isTyping) => {
    send({
      type: "UPDATE_USER_TYPING",
      chatId: page.params.chat,
      data: {
        isTyping
      }
    });
  }, TYPING_TIMEOUT_MS);
</script>

<Messages {chatId} />

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
