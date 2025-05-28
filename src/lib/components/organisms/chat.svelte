<script lang="ts">
  import type { ClientMessage, ServerMessage } from "$lib/api/protocol";
  import { sendMessage, onMessage } from "$lib/api/ws";
  import Form from "@atoms/form.svelte";
  import Input from "@atoms/input.svelte";
  import Messages from "@molecules/messages.svelte";
  import { onMount } from "svelte";
  import z from "zod";

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  let messages = $state<
    Extract<ServerMessage, { type: "GET_MESSAGES" }>["data"]["messages"]
  >([]);

  onMount(() => {
    sendMessage({
      type: "REQUEST_MESSAGES",
      chatId
    });
  });

  onMessage("GET_MESSAGES", (msg) => (messages = msg.data.messages));

  onMessage("RECEIVE_MESSAGE", (msg) => {
    const { data } = msg;
    messages.push({
      ...data,
      isRead: false,
      senderId: msg.userId
    });
  });

  onMessage("RECEIVE_MESSAGE", (msg) => {
    if (msg.chatId !== chatId) return;

    const idx = messages.findIndex((message) => message.id === msg.data.id);
    if (idx === -1) return console.warn("READ_MESSAGE: unknown message read?");

    messages[idx].isRead = true;
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
</script>

<Messages {...messages} />

<Form
  class="escape-x absolute bottom-0 left-0 w-dvw"
  {schema}
  onsubmit={onSubmit}
>
  <Input name="message" placeholder="Type message..." />
</Form>
