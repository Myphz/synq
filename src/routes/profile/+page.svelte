<script lang="ts">
  import CyberImage from "@atoms/cyber-image.svelte";
  import { authGuard } from "@utils/auth-guard";
  import { onMount } from "svelte";

  onMount(() => {
    authGuard();
  });
</script>

<section class="flex flex-col gap-8">
  <header class="text-h-2">Profile</header>
  <div class="flex items-center gap-6">
    <CyberImage
      src="https://media.newyorker.com/photos/5e49bf473399bf0008132231/master/pass/Kenseth-CatProfile.jpg"
      class="size-32"
    />
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-1 *:leading-none">
        <span class="text-h-3">DANIEL</span>
        <span class="text-primary">@mario</span>
      </div>

      <span>synced</span>
    </div>
  </div>
</section>
