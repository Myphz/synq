<script lang="ts">
  import GoogleLogin from "@atoms/google-login.svelte";
  import { onMount } from "svelte";
  import { authGuard } from "@utils/auth-guard";
  import HexagonLogo from "@atoms/hexagon-logo";

  onMount(() => {
    authGuard(false);
  });
</script>

<div class="relative flex justify-center">
  <HexagonLogo />
  <span
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[4rem] text-primary"
  >
    SYNQ
  </span>
</div>

<div>LOGIN</div>
<GoogleLogin />
