<script lang="ts">
  import { logInWithGoogle } from "$lib/api/auth";
  import Button from "./button.svelte";
</script>

<Button onclick={logInWithGoogle} type="button">
  <div class="flex items-center gap-4">
    <img src="/assets/google.png" alt="Google" class="aspect-square h-6" />
    <span>Continue with Google</span>
  </div>
</Button>
