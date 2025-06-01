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

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));

  onMount(() => {
    sendMessage({
      type: "REQUEST_MESSAGES",
      chatId
    });
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

<Form class="absolute bottom-0 left-0 w-dvw" {schema} onsubmit={onSubmit}>
  <Input oninput={onTyping} name="message" placeholder="Type message..." />
</Form>
