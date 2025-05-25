<script lang="ts">
  import { appConfig } from "../config";
  import { onMount } from "svelte";
  import "../style/app.css";
  import "../style/fonts.css";
  import { getSocket } from "$lib/api/ws";

  onMount(() => {
    getSocket();
    appConfig();
  });
</script>

<slot />
