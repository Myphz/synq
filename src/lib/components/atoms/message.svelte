<script lang="ts">
  import { page } from "$app/state";
  import type { ServerMessage } from "$lib/api/protocol";
  import { sendMessage } from "$lib/api/ws";
  import { getUserId } from "$lib/supabase/auth/utils";
  import { toTime } from "@utils/dates";
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
  class={twMerge(
    "cyberpunk flex w-fit max-w-[70dvw] items-end gap-1 whitespace-pre-wrap px-1 py-2 first-of-type:mt-2",
    isFromOther && "cyberpunk-br bg-accent",
    !isFromOther && "cyberpunk-tr self-end gradient-msg"
  )}
>
  <span class="w-full break-words">{message.content}</span>
  <span class="text-small text-muted">{toTime(message.sentAt)}</span>
</div>
