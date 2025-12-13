<script lang="ts">
  import { getChat } from "$lib/stores/chats.svelte";
  import { isConnected } from "$lib/stores/connection.svelte";
  import { getUserId } from "$lib/supabase/auth/utils";
  import CyberImage from "@atoms/cyber-image.svelte";
  import Icon from "@atoms/icon.svelte";
  import NavbarBase from "@atoms/navbar-base.svelte";
  import { formatUserStatus } from "@utils/dates";
  import { twMerge } from "tailwind-merge";

  type Props = {
    chatId: number;
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

{#if chat}
  <NavbarBase>
    <div class="flex items-center gap-2">
      <button onclick={() => window.history.back()}>
        <Icon name="arrow_back_ios" class="text-h-2 w-fit" />
      </button>
      <a href="/profile?id={otherMember?.id}" class="flex gap-2">
        <CyberImage src={chat.image} class="size-[42.67px]" />
        <div class="flex flex-col justify-between *:leading-none!">
          <span class="text-h-2">
            {chat?.name}
          </span>
          {#if isConnected.value}
            {#if otherMember}
              <span
                class={twMerge(
                  "text-small",
                  (otherMember.isOnline || otherMember.isTyping) &&
                    "text-primary"
                )}
              >
                {formatUserStatus(otherMember)}
              </span>
            {/if}
          {:else}
            <span class="text-small text-[#ff0000]">DISCONNECTED</span>
          {/if}
        </div>
      </a>
    </div>
  </NavbarBase>
{/if}
