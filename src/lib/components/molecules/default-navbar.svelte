<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { chatResults, chats, filter } from "$lib/stores/chats.svelte";
  import { getUserId } from "$lib/supabase/auth/utils";
  import { supabase } from "$lib/supabase/client";
  import Icon from "@atoms/icon.svelte";
  import Input from "@atoms/input.svelte";
  import NavbarBase from "@atoms/navbar-base.svelte";
  import Menu from "@organisms/menu";
  import { debounceAsync } from "@utils/debounce";

  let isSearch = $state(false);

  $effect(() => {
    filter.chats = isSearch ? "search" : "full";
  });

  const openSearch = () => {
    isSearch = true;
    if (page.route.id !== "/") goto("/");
  };

  const onInput = debounceAsync(async (e: Event) => {
    // Empty any previous chat results
    Object.keys(chatResults).forEach((key) => delete chatResults[key]);
    // @ts-expect-error its ok
    const search = e.target.value;
    if (!search) return;

    let { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `${search}%`)
      .throwOnError();

    const me = await getUserId();
    // Remove current user from any search result
    profiles = profiles.filter((profile) => profile.id !== me);

    profiles.forEach((profile) => {
      const existingChat = Object.values(chats).find((chat) =>
        chat.members.map((member) => member.id).includes(profile.id)
      );

      if (existingChat) {
        chatResults[existingChat.chatId] = existingChat;
      } else {
        chatResults[profile.id] = {
          // @ts-expect-error profile.id is a string not number
          chatId: profile.id,
          name: profile.name,
          lastMessage: null,
          unreadMessagesCount: 0,
          // TODO: Add members!
          members: [],
          messages: [],
          isInitialized: true,
          isNew: true
        };
      }
    });
  }, 1000);

  const closeSearch = async () => {
    await new Promise((res) => setTimeout(res, 100));
    isSearch = false;
  };
</script>

<NavbarBase>
  {#if !isSearch}
    <div class="flex w-full items-center justify-between">
      <div class="flex items-center gap-2">
        <Menu />
        <a class="text-h-1" href="/">SYNQ</a>
      </div>
      <button onclick={openSearch}>
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
