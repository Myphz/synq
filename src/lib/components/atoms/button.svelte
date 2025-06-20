<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = {
    children: Snippet;
  } & HTMLButtonAttributes;

  const { children, class: className, ...rest }: Props = $props();
</script>

<button
  class="relative flex w-full -skew-x-[20deg] items-center justify-center border-4 border-[#6BD0DA66] bg-secondary/20 py-1.5 text-h-3 text-primary"
  {...rest}
>
  <div class="skew-x-[20deg]">
    {@render children()}
  </div>

  <div class="absolute -bottom-2 -right-2 aspect-square w-[10%]">
    <div class="absolute bottom-0 right-0 h-full w-px bg-primary"></div>
    <div class="absolute bottom-0 right-0 h-px w-full bg-primary"></div>
  </div>

  <div class="absolute -left-2 -top-2 aspect-square w-[10%]">
    <div class="absolute left-0 top-0 h-full w-px bg-primary"></div>
    <div class="absolute left-0 top-0 h-px w-full bg-primary"></div>
  </div>
</button>
