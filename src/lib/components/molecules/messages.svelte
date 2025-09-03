<script lang="ts" module>
  const IS_NEAR_BOTTOM_THRESHOLD = 300;
</script>

<script lang="ts">
  import { onMessage } from "$lib/api/ws";
  import { getUserId } from "$lib/supabase/auth/utils";
  import Message from "@atoms/message.svelte";
  import { onMount } from "svelte";
  import { Keyboard } from "@capacitor/keyboard";
  import { Capacitor } from "@capacitor/core";
  import { twMerge } from "tailwind-merge";
  import { getChat } from "$lib/stores/chats.svelte";

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));

  export const scrollToBottom = (behavior: "smooth" | "instant" = "smooth") => {
    const container = document.getElementById("messages")!;

    container.scrollTo({
      top: container.scrollHeight,
      behavior
    });
  };

  onMessage("RECEIVE_MESSAGE", async (msg) => {
    const container = document.getElementById("messages")!;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      IS_NEAR_BOTTOM_THRESHOLD;

    // Scroll to view the last message if
    // the user is near bottom or the message is ours
    if (isNearBottom || msg.userId === (await getUserId())) scrollToBottom();
  });

  onMount(() => {
    if (Capacitor.getPlatform() === "web") return;

    Keyboard.addListener("keyboardDidShow", () => scrollToBottom("instant"));
    Keyboard.addListener("keyboardWillShow", () => scrollToBottom("instant"));

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
