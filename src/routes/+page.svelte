<script>
  import { onMount, onDestroy } from "svelte";

  let socket;
  // Change lastMessage to an array to store all messages
  let messages = [];
  let input = "";

  function sendMessage() {
    if (socket && socket.readyState === WebSocket.OPEN && input.trim()) {
      socket.send(input);
      input = "";
    }
  }

  onMount(() => {
    socket = new WebSocket("ws://localhost:3000", [
      "synq",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ4MDI5NjQ1LCJpYXQiOjE3NDc5Mjk2NDYsImlzcyI6Imh0dHBzOi8vZWljZG96Zml3bm90bWdzZXd3bWouc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjRhNzFiYjg4LThkMzctNGIzMy05MjMxLTQyMzNhZWQzZTlhYiIsImVtYWlsIjoibWFyaW9AbWFyaW8uY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzQ3OTI5NjQ2fV19.Dkm1CjrKmuWSz-ncGMo1hINcOImN4J3RfQSdY6PWtiQ"
    ]);

    socket.addEventListener("open", () => {
      console.log("WebSocket connected");
    });

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received:", data);
        // Add the new message to the beginning of the array
        messages = [JSON.stringify(data, null, 2), ...messages];
      } catch (e) {
        console.error("Failed to parse message as JSON:", event.data, e);
        // If it's not JSON, just add the raw string
        messages = [event.data, ...messages];
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
      messages = ["ERROR! " + JSON.stringify(err), ...messages];
    };

    socket.addEventListener("close", () => {
      console.log("WebSocket disconnected");
    });
  });

  onDestroy(() => {
    socket?.close();
  });
</script>

<main>
  <div>
    <strong>Messages:</strong>
    <div class="message-container">
      {#each messages as message}
        <pre>{message}</pre>
        <hr />
      {/each}
      {#if messages.length === 0}
        <p>No messages yet.</p>
      {/if}
    </div>
  </div>

  <input
    type="text"
    placeholder="Type a message"
    bind:value={input}
    on:keydown={(e) => e.key === "Enter" && sendMessage()}
  />
  <button on:click={sendMessage} disabled={!input.trim()}>Send</button>
</main>

<style>
  main {
    max-width: 600px; /* Increased max-width for better message display */
    margin: 2rem auto;
    font-family: monospace, monospace;
  }
  input {
    width: 70%;
    padding: 0.5rem;
    margin-right: 0.5rem;
  }
  button {
    padding: 0.5rem 1rem;
  }
  .message-container {
    border: 1px solid #eee;
    padding: 1rem;
    max-height: 50vh; /* Added max-height for scrollability */
    overflow-y: auto; /* Added scroll for overflow messages */
    margin-bottom: 1rem;
    background-color: #f9f9f9;
  }
  pre {
    white-space: pre-wrap; /* Ensures long lines wrap */
    word-break: break-all; /* Breaks words if necessary to prevent horizontal scroll */
    margin: 0; /* Remove default margin from pre tags */
    padding-bottom: 0.5rem;
  }
  hr {
    border: 0;
    border-top: 1px dashed #ccc;
    margin: 0.5rem 0;
  }
</style>
