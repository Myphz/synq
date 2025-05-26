<script lang="ts">
  import { twMerge } from "tailwind-merge";

  type Props = {
    class?: string;
    src: string;
  };

  const { class: className, src }: Props = $props();
</script>

<div class="p-[3px]">
  <div class={twMerge("relative", className)}>
    <img {src} class="h-full w-full" alt="Profile" />
    <div class="absolute -bottom-1 -left-1 aspect-square w-[50%]">
      <div class="absolute bottom-0 left-0 h-full w-px bg-secondary"></div>
      <div class="absolute bottom-0 left-0 h-px w-full bg-secondary"></div>
    </div>

    <div class="absolute -right-1 -top-1 aspect-square w-[50%]">
      <div class="absolute right-0 top-0 h-full w-px bg-secondary"></div>
      <div class="absolute right-0 top-0 h-px w-full bg-secondary"></div>
    </div>
  </div>
</div>
