<script lang="ts">
  import { toTime, toWeekDayInitials } from "@utils/dates";
  import CyberImage from "./cyber-image.svelte";
  import { getChat } from "$lib/stores/chats.svelte";
  import { isToday } from "date-fns";

  type Props = { chatId: number };
  const { chatId }: Props = $props();

  const chat = $derived(getChat(chatId));
</script>

<a class="flex w-full items-center justify-between gap-4" href="/{chat.chatId}">
  <div class="flex min-w-0 flex-1 items-center gap-2">
    <CyberImage src={chat.image} class="size-12" />
    <div class="flex min-w-0 flex-col justify-center gap-1 leading-none">
      <span class="text-h-4 text-primary">{chat.name}</span>
      {#if chat.lastMessage}
        <span class="overflow-hidden text-ellipsis whitespace-nowrap">
          {chat.lastMessage.content}
        </span>
      {/if}
    </div>
  </div>

  <div class="flex shrink-0 flex-col items-end gap-1.5">
    {#if chat.lastMessage}
      <span class="text-small text-muted">
        {#if isToday(chat.lastMessage.sentAt)}
          {toTime(chat.lastMessage.sentAt)}
        {:else}
          {toWeekDayInitials(chat.lastMessage.sentAt)}
        {/if}
      </span>
    {/if}
    <div class="size-4">
      {#if chat.unreadMessagesCount > 0}
        <span
          class="bg-primary font-header text-background after:bg-primary relative flex size-4 items-center justify-center rounded-full font-semibold after:absolute after:inset-0 after:-z-10 after:rounded-full after:blur-md"
        >
          {chat.unreadMessagesCount}
        </span>
      {/if}
    </div>
  </div>
</a>
