<script lang="ts">
  import { openLinksInBrowser } from "@utils/links";
  import { renderMessage, type Message } from "@utils/message";

  type Props = Message;
  const message: Props = $props();

  const messageHtml = $derived(renderMessage(message));
</script>

<p use:openLinksInBrowser class="min-w-0 flex-1 break-words leading-[18px]">
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html messageHtml}
</p>
