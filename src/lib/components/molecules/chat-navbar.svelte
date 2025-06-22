<script lang="ts">
  import { getChat } from "$lib/stores/chats.svelte";
  import { getUserId } from "$lib/supabase/auth/utils";
  import CyberImage from "@atoms/cyber-image.svelte";
  import Icon from "@atoms/icon.svelte";
  import NavbarBase from "@atoms/navbar-base.svelte";
  import { formatUserStatus } from "@utils/dates";
  import { twMerge } from "tailwind-merge";

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));

  let userId = $state("");
  // eslint-disable-next-line unicorn/prefer-top-level-await
  getUserId().then((id) => (userId = id));

  // Initialize member to null or undefined
  let otherMember = $derived(
    chat.members.find((member) => member.id !== userId)
  );
</script>

<NavbarBase>
  <div class="flex items-center gap-2">
    <button onclick={() => window.history.back()}>
      <Icon name="arrow_back_ios" class="w-fit text-h-2" />
    </button>
    <div class="flex gap-2">
      <CyberImage
        src="https://media.newyorker.com/photos/5e49bf473399bf0008132231/master/pass/Kenseth-CatProfile.jpg"
        class="size-[42.67px]"
      />
      <div class="flex flex-col justify-between *:leading-none">
        <span class="text-h-2">
          {chat?.name}
        </span>
        {#if otherMember}
          <span
            class={twMerge(
              "text-small",
              (otherMember.isOnline || otherMember.isTyping) && "text-primary"
            )}
          >
            {formatUserStatus({
              ...otherMember,
              lastSeen: otherMember.lastSeen || undefined
            })}
          </span>
        {/if}
      </div>
    </div>
  </div>
</NavbarBase>
