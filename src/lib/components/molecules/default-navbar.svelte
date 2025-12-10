<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/state";
  import { getDefaultAvatar } from "$lib/api/avatar";
  import { chatResults, chats, filter } from "$lib/stores/chats.svelte";
  import { getUserId } from "$lib/supabase/auth/utils";
  import { supabase } from "$lib/supabase/client";
  import Icon from "@atoms/icon.svelte";
  import Input from "@atoms/input.svelte";
  import NavbarBase from "@atoms/navbar-base.svelte";
  import Menu from "@organisms/menu";
  import { emptyChatResults } from "@utils/chat";
  import { debounceAsync } from "@utils/debounce";
  import { sleep } from "@utils/sleep";

  let isSearch = $state(false);

  $effect(() => {
    filter.chats = isSearch ? "search" : "full";
  });

  const openSearch = () => {
    emptyChatResults();

    isSearch = true;
    chatResults.isLoading = true;

    if (page.route.id !== "/") goto("/");
  };

  const onInput = (e: Event) => {
    filterChats(e);
    chatResults.isLoading = true;
  };

  const filterChats = debounceAsync(async (e: Event) => {
    emptyChatResults();

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
        chatResults.chats[existingChat.chatId] = existingChat;
      } else {
        const fakeChatId = Date.now();
        chatResults.chats[fakeChatId] = {
          chatId: fakeChatId,
          image: profile.avatar_url || getDefaultAvatar(profile.id),
          name: profile.name,
          lastMessage: null,
          unreadMessagesCount: 0,
          members: [
            {
              name: profile.name,
              avatarUrl: profile.avatar_url,
              id: profile.id,
              isOnline: false,
              isTyping: false,
              lastSeen: null,
              username: profile.username
            }
          ],
          messages: [],
          hasLatestUpdates: true,
          isNew: true
        };
      }
    });

    chatResults.isLoading = false;
  }, 500);

  const closeSearch = async () => {
    await sleep(100);
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
