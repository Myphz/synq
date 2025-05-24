import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.synq.app",
  appName: "SYNQ",
  webDir: "build",
  server: {
    androidScheme: "https",
    hostname: "SYNQ"
  },
  plugins: {
    Keyboard: {
      resizeOnFullScreen: true
    }
  }
};

export default config;
