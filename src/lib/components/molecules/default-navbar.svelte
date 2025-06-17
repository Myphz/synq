<script lang="ts">
  import { chatResults } from "$lib/stores/chats.svelte";
  import { getUserId } from "$lib/supabase/auth/utils";
  import { supabase } from "$lib/supabase/client";
  import Icon from "@atoms/icon.svelte";
  import Input from "@atoms/input.svelte";
  import NavbarBase from "@atoms/navbar-base.svelte";
  import { debounceAsync } from "@utils/debounce";

  let isSearch = $state(false);

  const onInput = debounceAsync(async (e: Event) => {
    // @ts-expect-error its ok
    const search = e.target.value;
    let { data: profiles } = await supabase
      .from("profiles")
      .select("*")
      .ilike("username", `${search}%`)
      .throwOnError();

    const me = await getUserId();
    // Remove current user from any search result
    profiles = profiles.filter((profile) => profile.id !== me);

    profiles.forEach((profile) => {
      chatResults[profile.id] = {
        // @ts-expect-error profile.id is a string not number
        chatId: profile.id,
        name: profile.name,
        lastMessage: null,
        unreadMessagesCount: 0,
        members: [],
        messages: [],
        isInitialized: true
      };
    });
  }, 1000);

  const closeSearch = async () => {
    // Empty chat results
    await new Promise((res) => setTimeout(res, 500));
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
