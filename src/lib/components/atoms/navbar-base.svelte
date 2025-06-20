<script lang="ts">
  import { portal } from "@utils/portal";
  import type { Snippet } from "svelte";

  type Props = {
    children: Snippet;
  };
  const { children }: Props = $props();
</script>

<nav
  use:portal={"#main-navbar"}
  class="relative h-16 w-full border-b border-secondary p-2 *:px-3"
>
  {@render children()}
</nav>

<style lang="postcss">
  nav::before,
  nav::after {
    content: "";
    position: absolute;
    clip-path: polygon(
      20% 0,
      20% 40%,
      40% 40%,
      40% 60%,
      20% 60%,
      20% 100%,
      0 100%,
      0 0
    );
    width: 1rem;
    height: 70%;
    top: 50%;
    translate: 0 -50%;
    @apply bg-secondary;
  }

  nav::before {
    left: 0;
  }

  nav::after {
    right: 0;
    scale: -1 1;
  }
</style>
