<script>
  import { onMount, onDestroy } from "svelte";

  let socket;
  let lastMessage = "No messages yet";
  let input = "";

  function sendMessage() {
    if (socket && socket.readyState === WebSocket.OPEN && input.trim()) {
      socket.send(input);
      input = "";
    }
  }

  onMount(() => {
    // https://stackoverflow.com/a/77060459
    socket = new WebSocket("ws://localhost:3000", [
      "synq",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzQ3OTIxNDAyLCJpYXQiOjE3NDc4MjE0MDMsImlzcyI6Imh0dHBzOi8vZWljZG96Zml3bm90bWdzZXd3bWouc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjRhNzFiYjg4LThkMzctNGIzMy05MjMxLTQyMzNhZWQzZTlhYiIsImVtYWlsIjoibWFyaW9AbWFyaW8uY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzQ3ODIxNDAzfV19.43Okr3uxfvCBV2r2KYtFHoYSgcW9k7nXRbvzHffepAs"
    ]);

    socket.addEventListener("open", () => {
      console.log("WebSocket connected");
    });

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received:", data);
      lastMessage = JSON.stringify(data);
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
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
    <strong>Last message:</strong>
    <pre>{lastMessage}</pre>
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
    max-width: 400px;
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
</style>
