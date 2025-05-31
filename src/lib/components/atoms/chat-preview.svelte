<script lang="ts">
  import { toTime } from "@utils/dates";
  import CyberImage from "./cyber-image.svelte";
  import { getChat } from "$lib/stores/chats.svelte";

  type Props = { chatId: number };
  const { chatId }: Props = $props();

  const chat = $derived(getChat(chatId));
  const lastMessage = $derived(chat.messages.at(-1) || chat.lastMessage);
</script>

<a class="flex w-full items-center justify-between" href="/{chat.chatId}">
  <div class="flex items-center gap-2">
    <CyberImage
      src="https://media.newyorker.com/photos/5e49bf473399bf0008132231/master/pass/Kenseth-CatProfile.jpg"
      class="size-12"
    />
    <div class="flex flex-col justify-center gap-1 leading-none">
      <span class="text-h-4 text-primary">{chat.name}</span>
      <span>{lastMessage?.content}</span>
    </div>
  </div>

  <div class="flex flex-col items-end gap-1.5">
    <span class="text-small text-muted">
      {toTime(lastMessage?.sentAt)}
    </span>
    <div class="size-4">
      {#if chat.unreadMessagesCount}
        <span
          class="relative flex size-4 items-center justify-center rounded-full bg-primary font-header font-semibold text-background after:absolute after:inset-0 after:-z-10 after:rounded-full after:bg-primary after:blur-md"
        >
          {chat.unreadMessagesCount}
        </span>
      {/if}
    </div>
  </div>
</a>
