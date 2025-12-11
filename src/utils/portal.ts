import type { Action } from "svelte/action";
import { throwError } from "./throw-error";

export const portal: Action<HTMLElement, string> = (node, selector) => {
  const parent = document.querySelector(selector);
  if (!parent)
    return throwError(`No existing node that matches selector "${selector}"`);

  parent.append(node);

  return {
    destroy() {
      node.remove();
    }
  };
};
