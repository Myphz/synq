<script lang="ts">
  import { page } from "$app/state";
  import type { ServerMessage } from "$lib/api/protocol";
  import { sendMessage } from "$lib/api/ws";
  import { getJWT } from "$lib/supabase/client";
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
    if (message.isRead || message.senderId === getJWT().id) return;

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

<div bind:this={container} class="flex flex-col gap-2">
  <div>{message.content}</div>
  <pre>Read: {message.isRead}</pre>
</div>
