<script lang="ts">
  import { deleteAvatar, uploadAvatar } from "$lib/api/avatar";
  import Icon from "@atoms/icon.svelte";
</script>

<div class="absolute -right-1 bottom-0 translate-y-1/2">
  <div class="cyberpunk cyberpunk-br absolute -inset-px -z-10 bg-primary"></div>

  <div
    class="cyberpunk cyberpunk-br flex h-full w-full items-center gap-2 bg-background p-2 text-h-4"
  >
    <button onclick={uploadAvatar}>
      <Icon class="align-middle" name="image_arrow_up" />
    </button>

    <button onclick={deleteAvatar}>
      <Icon class="align-middle" name="delete" />
    </button>
  </div>
</div>
