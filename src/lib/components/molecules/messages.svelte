<script lang="ts">
  import type { ServerMessage } from "$lib/api/protocol";
  import { onMessage } from "$lib/api/ws";
  import { getUserId } from "$lib/supabase/auth/utils";
  import Message from "@atoms/message.svelte";
  import { onMount } from "svelte";
  import { Keyboard } from "@capacitor/keyboard";
  import { Capacitor } from "@capacitor/core";

  type Messages = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"];

  let container: HTMLDivElement;
  const messages: Messages = $props();

  let lastScrollBottom = 0;
  let isNearBottom = true;

  const onScroll = () => {
    if (!container) return;
    lastScrollBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    isNearBottom = lastScrollBottom <= 50;
  };

  const jumpInstant = (y: number) => {
    container.style.scrollBehavior = "auto";
    container.scrollTop = y;
    requestAnimationFrame(() => (container.style.scrollBehavior = "smooth"));
  };

  onMessage("GET_MESSAGES", () => {
    if (!container) return;
    jumpInstant(container.scrollHeight);
  });

  onMessage("RECEIVE_MESSAGE", async (msg) => {
    // Scroll to view the last message if
    // the user is near bottom or the message is ours
    if (isNearBottom || msg.userId === (await getUserId())) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  });

  onMount(() => {
    // Initial scroll to bottom
    jumpInstant(container.scrollHeight);

    // Update scroll state initially
    onScroll();

    container.addEventListener("scroll", onScroll);

    if (Capacitor.getPlatform() === "web") return;

    Keyboard.addListener("keyboardWillShow", () => {
      // Save offset from bottom before keyboard appears
      onScroll();
    });

    Keyboard.addListener("keyboardDidShow", () => {
      // Restore offset after keyboard shows
      jumpInstant(
        container.scrollHeight - container.clientHeight - lastScrollBottom
      );
    });

    Keyboard.addListener("keyboardDidHide", () => {
      // Restore offset after keyboard hides
      jumpInstant(
        container.scrollHeight - container.clientHeight - lastScrollBottom
      );
    });

    return () => {
      Keyboard.removeAllListeners();
      container.removeEventListener("scroll", onScroll);
    };
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
