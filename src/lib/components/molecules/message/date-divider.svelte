<script lang="ts">
  import CyberElement from "@atoms/cyber-element.svelte";
  import { toDate } from "@utils/dates";

  type Props = {
    date: string;
  };

  const { date }: Props = $props();
</script>

<div class="mt-2 flex w-full justify-center first-of-type:mt-0">
  <CyberElement
    class="bg-accent px-4 py-1"
    containerWidth="1.75vw"
    containerOffset="1.5px"
    lineThickness="0.5px"
    reversed
  >
    <span>{toDate(date)}</span>
  </CyberElement>
</div>
