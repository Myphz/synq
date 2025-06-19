<script lang="ts">
  import ChatsList from "@molecules/chats-list.svelte";
  import { authGuard } from "@utils/auth-guard";
  import { onMount } from "svelte";

  onMount(() => {
    authGuard();
  });
</script>

<ChatsList />
