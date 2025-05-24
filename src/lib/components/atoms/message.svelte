<script lang="ts">
  import { page } from "$app/state";
  import type { ServerMessage } from "$lib/api/protocol";
  import { sendMessage } from "$lib/api/ws";
  import { onMount } from "svelte";

  type Message = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"][number];

  const message: Message = $props();

  let container: HTMLDivElement;

  const onRead = () =>
    sendMessage({
      type: "READ_MESSAGE",
      chatId: page.params.chat,
      data: {
        messageId: message.id
      }
    });

  onMount(() => {
    // TODO: Add || message.senderId is us
    if (message.isRead) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio === 1) {
            // If the div is intersecting and fully visible (ratio is 1)
            onRead();
            observer.disconnect();
          }
        });
      },
      {
        threshold: 1
      }
    );

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div bind:this={container}>{message.content}</div>
