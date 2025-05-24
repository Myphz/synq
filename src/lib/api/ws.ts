import { getJWT } from "$lib/supabase/client";
import {
  serverMessageSchema,
  type ClientMessage,
  type ServerMessage
} from "./protocol";

const SERVER_URL = "ws://localhost:3000";

let socket: WebSocket | null = null;
let isInitializing = false;

const initializeWs = async () => {
  isInitializing = true;
  const jwt = getJWT().jwt;
  if (!jwt) throw new Error("initializeWs: no jwt");

  const ws = new WebSocket(SERVER_URL, ["synq", jwt]);

  ws.addEventListener("error", (e) =>
    console.error("SOCKET ERROR:", JSON.stringify(e))
  );

  while (ws.readyState !== WebSocket.OPEN) {
    await new Promise((res) => setTimeout(res, 100));
  }

  socket = ws;

  isInitializing = false;
  return ws;
};

const getSocket = async () => {
  while (isInitializing) {
    await new Promise((res) => setTimeout(res, 100));
  }

  if (socket) return socket;
  return await initializeWs();
};

export const sendMessage = async (message: ClientMessage) => {
  const socket = await getSocket();
  socket.send(JSON.stringify(message));
};

export const onMessage = async <T extends ServerMessage["type"]>(
  fn: (
    message: T extends string
      ? Extract<ServerMessage, { type: T }>
      : ServerMessage
  ) => unknown,
  type?: T
) => {
  const socket = await getSocket();

  socket.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    // @ts-expect-error its ok
    if (!type) fn(message);
    // @ts-expect-error its ok
    if (message.type === type) fn(message);
  });
};
