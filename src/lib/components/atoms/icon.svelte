<script lang="ts">
  type Props = { name: string; class?: string };
  const { name, class: className }: Props = $props();
</script>

<span class="material-symbols-outlined text-primary {className}">{name}</span>
