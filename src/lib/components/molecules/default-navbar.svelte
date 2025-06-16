<script lang="ts">
  import { chatResults } from "$lib/stores/chats.svelte";
  import Icon from "@atoms/icon.svelte";
  import Input from "@atoms/input.svelte";
  import NavbarBase from "@atoms/navbar-base.svelte";
  import { debounceAsync } from "@utils/debounce";

  let isSearch = $state(false);

  const onInput = debounceAsync(async (e: Event) => {
    // @ts-expect-error its ok
    const search = e.target.value;
    // TODO: Get chat results
    chatResults[0] = {
      chatId: 0,
      name: "mario",
      lastMessage: null,
      unreadMessagesCount: 0,
      members: [],
      messages: [],
      isInitialized: true
    };
  }, 1000);

  const closeSearch = () => {
    // Empty chat results
    Object.keys(chatResults).forEach((key) => delete chatResults[key]);
    isSearch = false;
  };
</script>

<NavbarBase>
  {#if !isSearch}
    <div class="flex w-full items-center justify-between">
      <span class="text-h-1">SYNQ</span>
      <button onclick={() => (isSearch = true)}>
        <Icon class="text-h-3" name="search" />
      </button>
    </div>
  {:else}
    <div class="px-4 py-2">
      <Input
        oninput={onInput}
        onblur={closeSearch}
        autofocus
        cyberpunkStyle="cyberpunk-br"
        name="mario"
        class="p-2"
      >
        <Icon class="text-h-4" name="search" />
      </Input>
    </div>
  {/if}
</NavbarBase>
