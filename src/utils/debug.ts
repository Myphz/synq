import { dev } from "$app/environment";
import { Capacitor } from "@capacitor/core";

export const debugAlert = (...args: unknown[]) => {
  if (Capacitor.getPlatform() === "web") return console.error(...args);

  if (dev) {
    const formattedArgs = args.map((arg) =>
      arg === undefined ? "undefined" : JSON.stringify(arg, null, 2)
    );
    alert(formattedArgs.join(" "));
  }
};

export const debugAlert_FORCE_DO_NOT_USE = (...args: unknown[]) => {
  if (Capacitor.getPlatform() === "web") return console.error(...args);

  const formattedArgs = args.map((arg) =>
    arg === undefined ? "undefined" : JSON.stringify(arg, null, 2)
  );
  alert(formattedArgs.join(" "));
};
