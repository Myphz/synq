<script lang="ts">
  import GoogleLogin from "@atoms/google-login.svelte";
  import { onMount } from "svelte";
  import { authGuard } from "@utils/auth-guard";
  import HexagonLogo from "@atoms/hexagon-logo";

  onMount(() => {
    authGuard(false);
  });
</script>

<div class="relative mb-16 flex justify-center">
  <HexagonLogo />
  <span
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-logo text-[4rem] text-primary"
  >
    SYNQ
  </span>
</div>

<section class="flex flex-col gap-6">
  <header class="text-h-2 text-primary">Grant Access</header>
  <GoogleLogin />
</section>

<style>
  span {
    text-shadow: #6bd0da 0 0 30px;
  }
</style>
