import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    fs: {
      // Allow serving tailwind config to FE
      allow: ["./tailwind.config.ts"]
    }
  }
});
