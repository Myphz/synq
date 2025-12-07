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
      body: "'Inter', sans-serif",
      logo: "'Audiowide', sans-serif"
    },
    colors: {
      transparent: "transparent",
      background: "#070D12",
      primary: "#00FF9C",
      secondary: "#FF5F1F",
      accent: "#112029",
      text: "#F2F2F2",
      muted: "#D2D4D7"
    }
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        ".gradient-msg": {
          background: "linear-gradient(87.6deg, #ED4F10 0%, #2E1703 116.89%)"
        },
        ".gradient-bg": {
          background:
            "linear-gradient(to bottom, oklch(0.1473 0.0107 285.01), oklch(0.2151 0.0169 233.21))"
        }
      });
    }
  ]
} satisfies Config;
