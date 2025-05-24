import {
  serverMessageSchema,
  type ClientMessage,
  type ServerMessage
} from "./protocol";

const SERVER_URL = "ws://localhost:3000";

let socket: WebSocket | null = null;

const initializeWs = () => {
  socket = new WebSocket(SERVER_URL, [
    "synq",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoyNzQ4MDY5NDA5LCJpYXQiOjE3NDgwNjk0MTAsImlzcyI6Imh0dHBzOi8vZWljZG96Zml3bm90bWdzZXd3bWouc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6IjRhNzFiYjg4LThkMzctNGIzMy05MjMxLTQyMzNhZWQzZTlhYiIsImVtYWlsIjoibWFyaW9AbWFyaW8uY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJlbWFpbCIsInByb3ZpZGVycyI6WyJlbWFpbCJdfSwidXNlcl9tZXRhZGF0YSI6e30sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib3RwIiwidGltZXN0YW1wIjoxNzQ4MDY5NDEwfV19.X26nA7iYLXas6ROY0gmbhDnUDM1ck2i3CsshCnT6Pjs"
  ]);

  socket.addEventListener("error", (e) =>
    console.error("SOCKET ERROR:", JSON.stringify(e))
  );

  return socket;
};

const getSocket = () => {
  if (socket) return socket;
  return initializeWs();
};

export const sendMessage = async (message: ClientMessage) => {
  const socket = getSocket();
  while (socket.readyState !== WebSocket.OPEN) {
    await new Promise((res) => setTimeout(res, 100));
  }
  socket.send(JSON.stringify(message));
};

export const onMessage = <T extends ServerMessage["type"]>(
  fn: (
    message: T extends string
      ? Extract<ServerMessage, { type: T }>
      : ServerMessage
  ) => unknown,
  type?: T
) => {
  const socket = getSocket();

  socket.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    // @ts-expect-error its ok
    if (!type) fn(message);
    // @ts-expect-error its ok
    if (message.type === type) fn(message);
  });
};
