import { FONT_HIERARCHY, GRADIENTS, SCREEN_LABELS, SEPARATOR } from "./config";
import { getFontAttribute, pxToRem } from "./utils";

import type { EmptyObject, FontHierarchy } from "./types";

// Example return:
// {
//   ".text-display-1": {
//     "@apply ...": {}
//   }
// }
export function fontHierarchyToTWConfig(
  fontHierarchy: FontHierarchy | FontHierarchy[string]["sizes"] = FONT_HIERARCHY,
  currentPath: string[] = [],
  fontFamily = "",
  lineHeight = 0,
  letterSpacing = 0
): Record<string, Record<string, EmptyObject>> {
  const [DESKTOP_SCREEN, TABLET_SCREEN] = SCREEN_LABELS;
  const result: Record<string, Record<string, EmptyObject>> = {};

  for (const key in fontHierarchy) {
    const currentSize = fontHierarchy[key];

    const newPath = [...currentPath, key];

    const sizes = getFontAttribute(currentSize, "sizes") || currentSize;
    const family = fontFamily || getFontAttribute(currentSize, "font") || "";
    const height = lineHeight || getFontAttribute(currentSize, "lineHeight") || 0;
    const spacing = letterSpacing || getFontAttribute(currentSize, "letterSpacing") || 0;

    if (Array.isArray(sizes)) {
      const [desktop, tablet, mobile] = sizes as number[];
      // Convert px to rem
      const sizeClasses = `text-[${pxToRem(mobile)}] ${TABLET_SCREEN}:text-[${pxToRem(
        tablet
      )}] ${DESKTOP_SCREEN}:text-[${pxToRem(desktop)}]`;

      const fontClasses = family ? `font-${family}` : "";
      const lineHeightClasses = height ? `leading-[${height}]` : "";
      const letterSpacingClasses = spacing ? `tracking-[${spacing}em]` : "";
      const finalClasses = `@apply ${sizeClasses} ${fontClasses} ${lineHeightClasses} ${letterSpacingClasses}`;

      const cssClasses: Record<string, EmptyObject> = {
        [finalClasses.trim()]: {}
      };

      result[newPath.join(SEPARATOR)] = cssClasses;
    } else if (typeof sizes === "object") {
      const nestedResult = fontHierarchyToTWConfig(
        sizes as Parameters<typeof fontHierarchyToTWConfig>[0],
        newPath,
        family,
        height,
        spacing
      );
      Object.assign(result, nestedResult);
    }
  }

  return currentPath.length
    ? result
    : Object.fromEntries(Object.entries(result).map(([k, v]) => [`.text${SEPARATOR}${k}`, v]));
}

// Example return:
// {
//   ".gradient-primary": {
//     "@apply ...": {}
//   }
// }
export function gradientsToTWConfig() {
  const ret: Record<string, Record<string, EmptyObject>> = {};

  for (const [key, value] of Object.entries(GRADIENTS)) {
    ret[`.gradient-${key}`] = { [`@apply ${value.join(" ")}`]: {} };
  }

  return ret;
}
