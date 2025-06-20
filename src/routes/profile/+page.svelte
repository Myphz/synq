<script lang="ts">
  import { authGuard } from "@utils/auth-guard";
  import { onMount } from "svelte";

  onMount(() => {
    authGuard();
  });
</script>

<header class="text-h-2">Profile</header>
