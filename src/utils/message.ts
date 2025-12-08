import type { ServerMessage } from "$lib/api/protocol";
import DOMPurify from "dompurify";
import linkifyHtml from "linkify-html";

export type Message = Extract<
  ServerMessage,
  { type: "GET_MESSAGES" }
>["data"]["messages"][number];

export const renderMessage = (message: Message) => {
  return DOMPurify.sanitize(
    linkifyHtml(message.content, {
      defaultProtocol: "https",
      target: "_blank",
      className: "underline"
    })
  );
};
