<script lang="ts">
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  type Props = {
    children: Snippet;
  } & HTMLButtonAttributes;

  const { children, ...rest }: Props = $props();
</script>

<button
  class="bg-accent text-h-3 text-primary relative flex w-full -skew-x-20 items-center justify-center border-4 border-[#6BD0DA66] py-1.5"
  {...rest}
>
  <div class="skew-x-20">
    {@render children()}
  </div>

  <div class="absolute -right-2 -bottom-2 aspect-square w-[10%]">
    <div class="bg-primary absolute right-0 bottom-0 h-full w-px"></div>
    <div class="bg-primary absolute right-0 bottom-0 h-px w-full"></div>
  </div>

  <div class="absolute -top-2 -left-2 aspect-square w-[10%]">
    <div class="bg-primary absolute top-0 left-0 h-full w-px"></div>
    <div class="bg-primary absolute top-0 left-0 h-px w-full"></div>
  </div>
</button>
