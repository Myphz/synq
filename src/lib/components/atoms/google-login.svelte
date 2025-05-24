<script lang="ts">
  import { logInWithGoogle } from "$lib/api/auth";
</script>

<button
  onclick={logInWithGoogle}
  type="button"
  class="bg-neutral-secondary text-neutral-primary"
>
  <div class="flex items-center gap-4 font-light">
    <img src="/assets/google.png" alt="Google" class="aspect-square h-6" />
    <span>Continue with Google</span>
  </div>
</button>
