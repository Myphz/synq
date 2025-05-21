// NB: SvelteKit aliases don't work here!
import { SCREEN_LABELS } from "./src/utils/tailwind/config";
import { fontHierarchyToTWConfig, gradientsToTWConfig } from "./src/utils/tailwind/theme";

import type { Config } from "tailwindcss";
import type { PluginCreator } from "tailwindcss/types/config";

const [DESKTOP_SCREEN, TABLET_SCREEN] = SCREEN_LABELS;

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    fontSize: {},
    fontFamily: {
      header: "'Space Grotesk', sans-serif;",
      body: "'Work Sans', sans-serif;"
    },
    screens: {
      mobile: "320px",
      [TABLET_SCREEN]: "744px",
      [DESKTOP_SCREEN]: "1440px"
    },
    colors: {
      transparent: "transparent",
      text: "#F5F7FA",
      background: "#131518",
      "text-secondary": "#C0C5CC",
      primary: "#F58F38",
      secondary: "#EF4A55"
    }
  },
  plugins: [
    ({ addUtilities }: Parameters<PluginCreator>[0]) => {
      addUtilities(fontHierarchyToTWConfig());
    },
    ({ addUtilities }: Parameters<PluginCreator>[0]) => {
      addUtilities(gradientsToTWConfig());
    }
  ]
} satisfies Config;
