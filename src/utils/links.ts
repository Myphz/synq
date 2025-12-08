import { Browser } from "@capacitor/browser";
import type { Action } from "svelte/action";

export const openLinksInBrowser: Action = (node: HTMLElement) => {
  const onClick = async (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");

    if (anchor && anchor.href) {
      e.preventDefault();
      await Browser.open({ url: anchor.href });
    }
  };

  node.addEventListener("click", onClick);

  return {
    destroy() {
      node.removeEventListener("click", onClick);
    }
  };
};
