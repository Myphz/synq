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
    <div class="absolute -bottom-[7%] -left-[7%] aspect-square w-[50%]">
      <div class="absolute bottom-0 left-0 h-full w-[5%] bg-secondary"></div>
      <div class="absolute bottom-0 left-0 h-[5%] w-full bg-secondary"></div>
    </div>

    <div class="absolute -right-[7%] -top-[7%] aspect-square w-[50%]">
      <div class="absolute right-0 top-0 h-full w-[5%] bg-secondary"></div>
      <div class="absolute right-0 top-0 h-[5%] w-full bg-secondary"></div>
    </div>
  </div>
</div>
