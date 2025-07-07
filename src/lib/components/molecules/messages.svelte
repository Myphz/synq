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
  import { isEdgeToEdgeEnabled } from "@utils/edge-to-edge";
  import { getChat } from "$lib/stores/chats.svelte";

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));

  const scrollToBottom = (behavior: "smooth" | "instant" = "smooth") => {
    const container = document.getElementById("messages");
    if (!container) return;
    container.scrollTo({
      top: container.scrollHeight,
      behavior
    });
  };

  onMessage("GET_MESSAGES", () => {
    scrollToBottom("instant");
  });

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
    // Initial scroll to bottom
    scrollToBottom("instant");

    if (Capacitor.getPlatform() === "web") return;

    Keyboard.addListener("keyboardDidShow", () => scrollToBottom());
    Keyboard.addListener("keyboardWillShow", () => scrollToBottom());

    return () => {
      Keyboard.removeAllListeners();
    };
  });
</script>

<div
  id="messages"
  class={twMerge("flex flex-1 flex-col gap-2 overflow-y-scroll pb-8")}
>
  {#each chat.messages as msg (msg.id)}
    <Message {...msg} />
  {/each}

  {#await isEdgeToEdgeEnabled() then edgeToEdge}
    {#if edgeToEdge}
      <div class="h-12 w-full"></div>
    {/if}
  {/await}
</div>
