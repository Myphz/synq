<script lang="ts" module>
  const NO_NAVBAR_PAGES = ["/auth"];
</script>

<script lang="ts">
  import { appConfig } from "../config";
  import { onMount } from "svelte";
  import { getSocket } from "$lib/api/ws";
  import DefaultNavbar from "@molecules/default-navbar.svelte";

  import "../style/app.css";
  import "../style/reset.css";
  import "../style/fonts.css";
  import "../style/anim.css";
  import "../style/material-symbols.css";
  import { page } from "$app/state";

  onMount(() => {
    appConfig();
    getSocket();
  });
</script>

{#if !NO_NAVBAR_PAGES.includes(page.route.id || "")}
  <div class="mb-4 bg-secondary/20 pt-8" id="main-navbar"></div>
  <DefaultNavbar />
{:else}
  <div class="mt-16"></div>
{/if}

<main class="flex flex-1 flex-col overflow-hidden px-4 pb-6">
  <slot />
</main>
