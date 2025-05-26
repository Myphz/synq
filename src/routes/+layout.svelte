<script lang="ts">
  import { appConfig } from "../config";
  import { onMount } from "svelte";
  import "../style/app.css";
  import "../style/fonts.css";
  import { getSocket } from "$lib/api/ws";
  import Navbar from "@molecules/navbar.svelte";

  onMount(() => {
    getSocket();
    appConfig();
  });
</script>

<Navbar />

<main class="px-4 pb-6">
  <slot />
</main>
