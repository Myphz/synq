<script lang="ts">
  import { toDate } from "@utils/dates";
  import CyberElement from "./cyber-element.svelte";

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
  >
    <span>{toDate(date)}</span>
  </CyberElement>
</div>
