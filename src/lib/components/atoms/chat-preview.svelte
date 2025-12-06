<script lang="ts">
  import { toTime, toWeekDayInitials } from "@utils/dates";
  import CyberImage from "./cyber-image.svelte";
  import { getChat } from "$lib/stores/chats.svelte";
  import { isToday } from "date-fns";

  type Props = { chatId: number };
  const { chatId }: Props = $props();

  const chat = $derived(getChat(chatId));
</script>

<a class="flex w-full items-center justify-between" href="/{chat.chatId}">
  <div class="flex items-center gap-2">
    <CyberImage src={chat.image} class="size-12" />
    <div class="flex flex-col justify-center gap-1 leading-none">
      <span class="text-h-4 text-primary">{chat.name}</span>
      {#if chat.lastMessage}
        <span class="line-clamp-1 text-ellipsis">
          {chat.lastMessage.content}
        </span>
      {/if}
    </div>
  </div>

  <div class="flex flex-col items-end gap-1.5">
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
          class="relative flex size-4 items-center justify-center rounded-full bg-primary font-header font-semibold text-background after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-primary after:blur-md"
        >
          {chat.unreadMessagesCount}
        </span>
      {/if}
    </div>
  </div>
</a>
