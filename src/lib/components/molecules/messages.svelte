<script lang="ts">
  import type { ServerMessage } from "$lib/api/protocol";
  import { onMessage } from "$lib/api/ws";
  import { getUserId } from "$lib/supabase/auth/utils";
  import Message from "@atoms/message.svelte";
  import { onMount } from "svelte";
  import { Keyboard } from "@capacitor/keyboard";
  import { Capacitor } from "@capacitor/core";
  import { twMerge } from "tailwind-merge";
  import { isEdgeToEdgeEnabled } from "@utils/edge-to-edge";

  type Messages = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"];

  let container: HTMLDivElement;
  const messages: Messages = $props();

  const scrollToBottom = (behavior: "smooth" | "instant" = "smooth") => {
    container.scrollTo({
      top: container.scrollHeight,
      behavior
    });
  };

  onMessage("GET_MESSAGES", () => {
    if (!container) return;
    scrollToBottom("instant");
  });

  onMessage("RECEIVE_MESSAGE", async (msg) => {
    // Scroll to view the last message if
    // the user is near bottom or the message is ours
    if (msg.userId === (await getUserId())) {
      scrollToBottom();
    }
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
  bind:this={container}
  id="messages"
  class={twMerge(
    "flex flex-1 flex-col gap-2 overflow-y-scroll scroll-smooth pb-8"
  )}
>
  {#each messages as msg (msg.id)}
    <Message {...msg} />
  {/each}

  {#await isEdgeToEdgeEnabled() then edgeToEdge}
    {#if edgeToEdge}
      <div class="h-12 w-full"></div>
    {/if}
  {/await}
</div>
