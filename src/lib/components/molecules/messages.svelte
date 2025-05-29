<script lang="ts">
  import type { ServerMessage } from "$lib/api/protocol";
  import { onMessage } from "$lib/api/ws";
  import { getUserId } from "$lib/supabase/auth/utils";
  import Message from "@atoms/message.svelte";
  import { onMount } from "svelte";
  import { Keyboard } from "@capacitor/keyboard";

  type Messages = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"];

  let container: HTMLDivElement;

  const messages: Messages = $props();

  // Scroll to bottom on messages load && when you send a message
  onMessage("GET_MESSAGES", () => {
    jumpInstant(container.scrollHeight);
  });

  onMessage("RECEIVE_MESSAGE", async (msg) => {
    if (msg.userId === (await getUserId()))
      container.scrollTo({ top: container.scrollHeight });
  });

  const jumpInstant = (y: number) => {
    container.style.scrollBehavior = "auto";
    container.scrollTop = y;
    requestAnimationFrame(() => (container.style.scrollBehavior = "smooth"));
  };

  onMount(() => {
    let lastScrollBottom = 0;
    Keyboard.addListener("keyboardWillShow", () => {
      // Save the scroll offset from bottom
      lastScrollBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight;
    });

    Keyboard.addListener("keyboardDidShow", () => {
      // Restore previous bottom offset
      jumpInstant(
        container.scrollHeight - container.clientHeight - lastScrollBottom
      );
    });

    Keyboard.addListener("keyboardDidHide", () => {
      // Scroll to the position you had before the keyboard opened
      jumpInstant(
        container.scrollHeight - container.clientHeight - lastScrollBottom
      );
    });

    return Keyboard.removeAllListeners;
  });
</script>

<div
  bind:this={container}
  id="messages"
  class="flex flex-1 flex-col gap-2 overflow-y-scroll scroll-smooth pb-8"
>
  {#each messages as msg (msg.id)}
    <Message {...msg} />
  {/each}
</div>
