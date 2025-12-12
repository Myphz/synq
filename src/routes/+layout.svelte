<script lang="ts" module>
  const NO_NAVBAR_PAGES = ["/auth"];
</script>

<script lang="ts">
  import { appConfig } from "../config";
  import { onMount } from "svelte";
  import DefaultNavbar from "@molecules/default-navbar.svelte";

  import "../style/app.css";
  import "../style/reset.css";
  import "../style/fonts.css";
  import "../style/anim.css";
  import "../style/material-symbols.css";
  import { page } from "$app/state";
  import { connect } from "$lib/stores/socket.svelte";
  import { afterNavigate } from "$app/navigation";
  import { scrollChatToBottom } from "@utils/chat";
    
onMount(() => {
    appConfig();
    connect();
  });

  afterNavigate(({ to }) => {
    if (to?.route.id !== "/[chat]") return;
    scrollChatToBottom("instant");
  });
</script>

{#if !NO_NAVBAR_PAGES.includes(page.route.id || "")}
  <div
    class="bg-accent"
    id="main-navbar"
    style="padding-top: var(--inset-top)"
  ></div>
  <DefaultNavbar />
{:else}
  <div class="mt-16"></div>
{/if}

<main class="flex flex-1 flex-col overflow-hidden px-4 pb-6">
  <slot />
</main>

<!-- <DebugInfo /> -->
