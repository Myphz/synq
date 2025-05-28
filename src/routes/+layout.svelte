<script lang="ts">
  import { appConfig } from "../config";
  import { onMount } from "svelte";
  import { getSocket } from "$lib/api/ws";
  import DefaultNavbar from "@molecules/default-navbar.svelte";

  import "../style/app.css";
  import "../style/reset.css";
  import "../style/fonts.css";

  onMount(() => {
    appConfig();
    getSocket();
  });
</script>

<div id="main-navbar"></div>

<DefaultNavbar />

<main class="px-4 pb-6">
  <slot />
</main>
