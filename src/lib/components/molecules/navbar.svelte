<script lang="ts">
</script>

<nav
  class="relative mb-4 w-full border-b border-secondary bg-secondary/20 p-2 font-semibold"
>
  <div class="px-4">
    <span class="text-h-1">SYNQ</span>
  </div>
</nav>

<style>
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
