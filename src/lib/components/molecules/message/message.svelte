<script lang="ts">
  import { page } from "$app/state";
  import { getUserId } from "$lib/supabase/auth/utils";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";
  import { isSameDay } from "date-fns";
  import { sendMessage } from "$lib/stores/socket.svelte";
  import DateDivider from "./date-divider.svelte";

  import { type Message } from "@utils/message";
  import MessageText from "./message-text.svelte";
  import MessageMetadata from "./message-metadata.svelte";

  type Props = Message & { prevMessageTime?: string };

  const { prevMessageTime, ...message }: Props = $props();
  let container: HTMLDivElement;

  let ourId = $state("");
  const isFromOther = $derived(message.senderId !== ourId);

  const shouldDisplayDividerDate = $derived.by(() => {
    if (!prevMessageTime) return true;
    const prevMessageDate = new Date(prevMessageTime);
    const currentMessageDate = new Date(message.sentAt);
    return !isSameDay(prevMessageDate, currentMessageDate);
  });

  const onRead = () =>
    sendMessage({
      type: "READ_MESSAGE",
      chatId: Number(page.params.chat),
      data: {
        messageId: message.id
      }
    });

  onMount(async () => {
    const userId = await getUserId();
    ourId = userId;

    if (message.isRead || message.senderId === userId) return;
    if (container.checkVisibility()) return onRead();

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
  <DateDivider date={message.sentAt} />
{/if}

<div
  id="message-{message.id}"
  style="--y-size: 0.65rem"
  bind:this={container}
  class={twMerge(
    "cyberpunk relative flex max-h-[70dvw] w-fit max-w-[70dvw] items-end gap-2 whitespace-pre-wrap first-of-type:mt-2",
    !message.image && "p-2",
    isFromOther && "cyberpunk-br bg-accent",
    !isFromOther && "cyberpunk-tr self-end gradient-msg"
  )}
>
  {#if message.image}
    <img
      src={message.image}
      loading="lazy"
      alt="message"
      class="h-full"
      onload={() =>
        document.getElementById(`message-${message.id}-placeholder`)?.remove()}
    />
    <!-- Placeholder to make sure message has its height even before images loads -->
    <div
      class="aspect-square h-[70dvw]"
      id="message-{message.id}-placeholder"
    ></div>
    <div
      class={twMerge(
        "absolute right-0 z-10 flex gap-2 bg-accent/50 p-1",
        isFromOther && "pr-2"
      )}
    >
      <MessageMetadata {...message} />
    </div>
  {:else}
    <MessageText {...message} />
    <MessageMetadata {...message} />
  {/if}
</div>
