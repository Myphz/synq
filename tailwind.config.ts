// NB: SvelteKit aliases don't work here!
import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    fontSize: {
      "h-1": "2.5rem",
      "h-2": "2.25rem",
      "h-3": "1.75rem",
      "h-4": "1.25rem",
      body: "0.75rem",
      small: "0.625rem"
    },
    fontFamily: {
      header: "'Rajdhani', sans-serif",
      body: "'Inter', sans-serif"
    },
    colors: {
      transparent: "transparent",
      background: "#0A0A0F",
      primary: "#6BD0DA",
      secondary: "#AD0471",
      "secondary/20": "#35112A",
      accent: "#892F6233",
      text: "#F2F2F2",
      muted: "#D2D4D7"
    }
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        ".gradient-bg": {
          background:
            "linear-gradient(to bottom, oklch(0.1473 0.0107 285.01), oklch(0.1754 0.0783 333.29))"
        }
      });
    }
  ]
} satisfies Config;
