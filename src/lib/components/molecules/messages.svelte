<script lang="ts">
  import Message from "@atoms/message.svelte";
  import { onMount } from "svelte";
  import { Keyboard } from "@capacitor/keyboard";
  import { Capacitor } from "@capacitor/core";
  import { twMerge } from "tailwind-merge";
  import { getChat } from "$lib/stores/chats.svelte";
  import { scrollChatToBottom } from "@utils/chat";

  type Props = {
    chatId: number;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));
  const messages = $derived(chat?.messages || []);

  onMount(() => {
    if (Capacitor.getPlatform() === "web") return;

    Keyboard.addListener("keyboardDidShow", () =>
      scrollChatToBottom("instant")
    );

    return () => {
      Keyboard.removeAllListeners();
    };
  });
</script>

<img
  alt="decoration"
  src="/assets/chat-wave.png"
  class="absolute left-0 w-full"
/>
<div
  id="messages"
  class={twMerge(
    "relative flex flex-1 flex-col gap-2 overflow-x-clip overflow-y-scroll pt-4"
  )}
>
  {#each messages as msg, i (msg.id)}
    <Message {...msg} prevMessageTime={messages[i - 1]?.sentAt} />
  {/each}
</div>
