import { dev } from "$app/environment";
import { setLatestMessageLog } from "$lib/stores/debug.svelte";
import { Capacitor } from "@capacitor/core";

export const debugLog = (...args: unknown[]) => {
  console.log(`[LOG]`, ...args);

  const formattedArgs = args
    .map((arg) =>
      arg === undefined ? "undefined" : JSON.stringify(arg, null, 2)
    )
    .join(" ");

  // @ts-expect-error its ok
  if (args?.[0]?.type) setLatestMessageLog(args?.[0].type);
  else setLatestMessageLog(formattedArgs);
};

export const debugAlert = (...args: unknown[]) => {
  if (Capacitor.getPlatform() === "web") return console.error(...args);
  if (!dev) return;

  const formattedArgs = args.map((arg) => {
    if (arg instanceof Error) {
      return `Error: ${arg.message}\nStack: ${arg.stack}`;
    }
    return arg === undefined ? "undefined" : JSON.stringify(arg, null, 2);
  });

  alert(formattedArgs.join(" "));
};

export const debugAlert_FORCE_DO_NOT_USE = (...args: unknown[]) => {
  if (Capacitor.getPlatform() === "web") return console.error(...args);

  const formattedArgs = args.map((arg) => {
    if (arg instanceof Error) {
      return `Error: ${arg.message}\nStack: ${arg.stack}`;
    }
    return arg === undefined ? "undefined" : JSON.stringify(arg, null, 2);
  });

  alert(formattedArgs.join(" "));
};
