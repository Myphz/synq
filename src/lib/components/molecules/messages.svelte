<script lang="ts">
  import Message from "@atoms/message.svelte";
  import { onMount } from "svelte";
  import { Keyboard } from "@capacitor/keyboard";
  import { Capacitor } from "@capacitor/core";
  import { twMerge } from "tailwind-merge";
  import { getChat } from "$lib/stores/chats.svelte";
  import { scrollChatToBottom } from "@utils/chat";

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));

  onMount(() => {
    if (Capacitor.getPlatform() === "web") return;

    Keyboard.addListener("keyboardDidShow", () =>
      scrollChatToBottom("instant")
    );
    Keyboard.addListener("keyboardWillShow", () =>
      scrollChatToBottom("instant")
    );

    return () => {
      Keyboard.removeAllListeners();
    };
  });
</script>

{#if chat}
  <div
    id="messages"
    class={twMerge(
      "flex flex-1 flex-col gap-2 overflow-x-clip overflow-y-scroll"
    )}
  >
    {#each chat.messages as msg, i (msg.id)}
      <Message {...msg} prevMessageTime={chat.messages[i - 1]?.sentAt} />
    {/each}
  </div>
{/if}
