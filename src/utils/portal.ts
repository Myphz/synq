import type { Action } from "svelte/action";

export const portal: Action<HTMLElement, string> = (node, selector) => {
  const parent = document.querySelector(selector);
  if (!parent)
    throw new Error(`No existing node that matches selector "${selector}"`);

  parent.append(node);

  return {
    destroy() {
      node.remove();
    }
  };
};
