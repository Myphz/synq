import tailwindConfig from "../../../tailwind.config";

import type { FontAttributes } from "./types";

export function pxToRem(px: number) {
  return `${Math.round((px / 16) * 1e4) / 1e4}rem`;
}

export function getFontAttribute<T extends keyof FontAttributes>(
  attributes: FontAttributes | number[],
  key: T
) {
  if (key in attributes) return (attributes as FontAttributes)[key];
}

export function getTWConfig() {
  return tailwindConfig.theme;
}
