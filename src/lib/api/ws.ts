import { getSupabaseSession_forced } from "$lib/supabase/auth/utils";
import { toAsyncSingleton } from "@utils/async-singleton";
import {
  serverMessageSchema,
  type ClientMessage,
  type ServerMessage
} from "./protocol";
import { setChats } from "$lib/stores/sync.svelte";

const SERVER_URL = "wss://synq.fly.dev";

export const getSocket = toAsyncSingleton(async () => {
  const { access_token: jwt } = await getSupabaseSession_forced();
  if (!jwt) throw new Error("initializeWs: no jwt");

  const socket = new WebSocket(SERVER_URL, ["synq", jwt]);

  socket.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    if (message.type === "INITIAL_SYNC") setChats(message.chats);
  });

  socket.addEventListener("error", (e) =>
    console.error("SOCKET ERROR:", JSON.stringify(e))
  );

  while (socket.readyState !== WebSocket.OPEN) {
    await new Promise((res) => setTimeout(res, 50));
  }

  return socket;
});

export const sendMessage = async (message: ClientMessage) => {
  const socket = await getSocket();
  socket.send(JSON.stringify(message));
};

export const onMessage = async <T extends ServerMessage["type"]>(
  type: T,
  fn: (
    message: T extends string
      ? Extract<ServerMessage, { type: T }>
      : ServerMessage
  ) => unknown
) => {
  const socket = await getSocket();

  socket.addEventListener("message", (msg) => {
    const message = serverMessageSchema.parse(JSON.parse(msg.data));
    // @ts-expect-error its ok
    if (message.type === type) fn(message);
  });
};
