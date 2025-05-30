<script lang="ts">
  import type { ClientMessage } from "$lib/api/protocol";
  import { sendMessage } from "$lib/api/ws";
  import { getChat } from "$lib/stores/chats.svelte";
  import Form from "@atoms/form.svelte";
  import Input from "@atoms/input.svelte";
  import Messages from "@molecules/messages.svelte";
  import { onMount } from "svelte";
  import z from "zod";

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
</script>

<Messages {...chat.messages} />

<Form class="absolute bottom-0 left-0 w-dvw" {schema} onsubmit={onSubmit}>
  <Input name="message" placeholder="Type message..." />
</Form>
