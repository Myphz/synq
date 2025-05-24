<script lang="ts">
  import { appConfig } from "../config";
  import { onMount } from "svelte";
  import "../style/app.css";
  import "../style/fonts.css";

  onMount(() => {
    appConfig();
  });
</script>

<slot />
