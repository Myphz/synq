<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";
  import { onMessage, sendMessage } from "../../api/ws";
  import type { ClientMessage, ServerMessage } from "../../api/protocol";
  import Form from "@atoms/form.svelte";
  import z from "zod";

  let messages = $state<
    Extract<ServerMessage, { type: "GET_MESSAGES" }>["data"]["messages"]
  >([]);

  const chatId = page.params.chat;

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
      content: data.content,
      id: Date.now(),
      isRead: false,
      senderId: msg.userId,
      sentAt: new Date().toISOString()
    });
  }, "SEND_MESSAGE");

  const schema = z.object({
    message: z.string().min(1)
  });

  const onSubmit = ({ message }: z.infer<typeof schema>) => {
    const socketMessage: ClientMessage = {
      type: "SEND_MESSAGE",
      chatId,
      userId: "4a71bb88-8d37-4b33-9231-4233aed3e9ab",
      data: {
        content: message
      }
    };

    sendMessage(socketMessage);
  };
</script>

{#each messages as msg (msg.id)}
  <div>{msg.content}</div>
{/each}

<Form {schema} onsubmit={onSubmit}>
  <input name="message" class="border border-background" type="text" />
  <button type="submit">submit</button>
</Form>
