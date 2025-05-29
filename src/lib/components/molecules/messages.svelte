<script lang="ts">
  import type { ServerMessage } from "$lib/api/protocol";
  import { onMessage } from "$lib/api/ws";
  import { getUserId } from "$lib/supabase/auth/utils";
  import Message from "@atoms/message.svelte";

  type Messages = Extract<
    ServerMessage,
    { type: "GET_MESSAGES" }
  >["data"]["messages"];

  let container: HTMLDivElement;

  const messages: Messages = $props();

  // Scroll to bottom on messages load && when you send a message
  onMessage("GET_MESSAGES", () => {
    container.scrollTo({ top: container.scrollHeight, behavior: "instant" });
  });

  onMessage("RECEIVE_MESSAGE", async (msg) => {
    if (msg.userId === (await getUserId()))
      container.scrollTo({ top: container.scrollHeight });
  });
</script>

<div
  bind:this={container}
  id="messages"
  class="flex flex-1 flex-col gap-2 overflow-y-scroll scroll-smooth pb-8"
>
  {#each messages as msg (msg.id)}
    <Message {...msg} />
  {/each}
</div>
