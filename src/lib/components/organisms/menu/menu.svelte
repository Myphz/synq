<script lang="ts">
  import Icon from "@atoms/icon.svelte";
  import MenuAside from "./menu-aside.svelte";

  let isOpen = $state(false);
  let clickedOutside = false;

  const closeMenu = () => {
    // onClickOutside is called also when clicking menu button for the first time..
    if (!clickedOutside) return (clickedOutside = true);
    isOpen = false;
  };

  $effect(() => {
    if (!isOpen) clickedOutside = false;
  });
</script>

<button onclick={() => (isOpen = !isOpen)}>
  <Icon class="text-h-2" name="dehaze" />
</button>

<MenuAside {isOpen} {closeMenu} />
