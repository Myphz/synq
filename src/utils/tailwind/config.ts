import type { FontHierarchy } from "./types";

export const SCREEN_LABELS = ["desktop", "tablet"] as const;
export const SEPARATOR = "-" as const;

export const FONT_HIERARCHY = {
  h: {
    font: "header",
    sizes: {
      1: [76, 60, 48],
      2: [48, 40, 40],
      3: [32, 32, 32],
      4: [28, 24, 24]
    },
    lineHeight: 1.2,
    letterSpacing: -0.02
  },
  paragraph: {
    font: "body",
    sizes: {
      body: [24, 18, 16],
      small: [18, 16, 14],
      xsmall: [16, 14, 13]
    },
    lineHeight: 1.5
  }
} as const satisfies FontHierarchy;

export const GRADIENTS = {
  primary: ["bg-gradient-to-r", "from-[#EF3340]", "to-[#F58220]"]
};
