<script lang="ts" module>
  const CORNER_LENGTH = 20;
</script>

<script lang="ts">
  type Props = { class?: string; strokeWidth?: number };
  const { class: className, strokeWidth = 3 }: Props = $props();

  const sideLengths = [50.3115, 45, 50.3115, 50.3115, 45, 50.3115];

  // Reactively compute the dasharray string based on CORNER_LENGTH.
  const strokeDasharray = sideLengths
    .map((side) => `${CORNER_LENGTH} ${side - CORNER_LENGTH}`)
    .join(" ");

  // The offset is half the corner length to center the dashes.
  const strokeDashoffset = CORNER_LENGTH / 2;
</script>

<svg class="w-[70vw] {className}" viewBox="0 0 100 100">
  <polygon
    points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
    fill="none"
    class="stroke-primary"
    stroke-width={strokeWidth}
    stroke-dasharray={strokeDasharray}
    stroke-dashoffset={strokeDashoffset}
  />
</svg>
