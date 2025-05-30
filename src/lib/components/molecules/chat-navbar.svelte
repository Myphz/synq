<script lang="ts">
  import { getChat } from "$lib/stores/chats.svelte";
  import CyberImage from "@atoms/cyber-image.svelte";
  import NavbarBase from "@atoms/navbar-base.svelte";

  type Props = {
    chatId: string;
  };

  const { chatId }: Props = $props();
  const chat = $derived(getChat(chatId));
</script>

<NavbarBase>
  <div class="flex gap-4">
    <span>b</span>
    <div class="flex gap-2">
      <CyberImage
        src="https://media.newyorker.com/photos/5e49bf473399bf0008132231/master/pass/Kenseth-CatProfile.jpg"
        class="size-[42.67px]"
      />
      <div class="flex flex-col justify-between *:leading-none">
        <span class="text-h-2">
          {chat?.name}
        </span>
        <span class="text-small">last seen 2 hours ago</span>
      </div>
    </div>
  </div>
</NavbarBase>
