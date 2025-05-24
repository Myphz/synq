<script lang="ts">
  import type { ClientMessage, ServerMessage } from "$lib/api/protocol";
  import { sendMessage, onMessage } from "$lib/api/ws";
  import Form from "@atoms/form.svelte";
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

  onMessage((msg) => (messages = msg.data.messages), "GET_MESSAGES");
  onMessage((msg) => {
    const { data } = msg;
    messages.push({
      ...data,
      isRead: false,
      senderId: msg.userId
    });
  }, "RECEIVE_MESSAGE");

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

<Form {schema} onsubmit={onSubmit}>
  <input name="message" class="border border-background" type="text" />
  <button type="submit">submit</button>
</Form>
