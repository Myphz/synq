<script lang="ts">
  import { page } from "$app/state";
  import type { ServerMessage } from "$lib/api/protocol";
  import { sendMessage } from "$lib/api/ws";
  import { getUserId } from "$lib/supabase/auth/utils";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  type Message = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"][number];

  const message: Message = $props();
  let container: HTMLDivElement;

  let ourId = $state("");
  let isFromOther = $derived(message.senderId !== ourId);

  const onRead = () =>
    sendMessage({
      type: "READ_MESSAGE",
      chatId: page.params.chat,
      data: {
        messageId: message.id
      }
    });

  onMount(async () => {
    const userId = await getUserId();
    ourId = userId;

    if (message.isRead || message.senderId === userId) return;

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
  });
</script>

<div
  bind:this={container}
  class={twMerge("flex flex-col gap-2", isFromOther && "ml-20")}
>
  <div>{message.content}</div>
  <pre>Read: {message.isRead}</pre>
</div>
