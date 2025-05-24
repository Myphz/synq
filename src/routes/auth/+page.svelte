<script lang="ts">
  import GoogleLogin from "@atoms/google-login.svelte";
  import { onMount } from "svelte";
  import { authGuard } from "@utils/auth-guard";

  onMount(() => {
    authGuard(false);
  });
</script>

<div>LOGIN</div>
<GoogleLogin />
