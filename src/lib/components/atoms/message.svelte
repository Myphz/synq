<script lang="ts">
  import { page } from "$app/state";
  import type { ServerMessage } from "$lib/api/protocol";
  import { sendMessage } from "$lib/api/ws";
  import { getUserId } from "$lib/supabase/auth/utils";
  import { toDate, toTime } from "@utils/dates";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";
  import Icon from "./icon.svelte";
  import { isSameDay } from "date-fns";

  type Message = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"][number];

  type Props = Message & { prevMessageTime?: string };

  const { prevMessageTime, ...message }: Props = $props();
  let container: HTMLDivElement;

  let ourId = $state("");
  let isFromOther = $derived(message.senderId !== ourId);
  let shouldDisplayDividerDate = $derived.by(() => {
    if (!prevMessageTime) return true;
    const prevMessageDate = new Date(prevMessageTime);
    const currentMessageDate = new Date(message.sentAt);
    return !isSameDay(prevMessageDate, currentMessageDate);
  });

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

{#if shouldDisplayDividerDate}
  <div class="mt-2 flex items-start justify-center first-of-type:mt-0">
    <span>{toDate(message.sentAt)}</span>
  </div>
{/if}

<div
  style="--y-size: 0.65rem"
  bind:this={container}
  class={twMerge(
    "cyberpunk flex w-fit max-w-[70dvw] items-end gap-2 whitespace-pre-wrap p-2 first-of-type:mt-2",
    isFromOther && "cyberpunk-br bg-accent",
    !isFromOther && "cyberpunk-tr self-end gradient-msg"
  )}
>
  <span class="w-full break-words leading-[18px]">{message.content}</span>
  <span class="text-small text-muted">{toTime(message.sentAt)}</span>
  {#if message.senderId === ourId}
    {#if message.isRead}
      <Icon name="done_all" class="-ml-1" />
    {:else}
      <Icon name="check" class="-ml-1 text-text" />
    {/if}
  {/if}
</div>
