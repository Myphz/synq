import "core-js/actual"; // Polyfills
import { SocialLogin } from "@capgo/capacitor-social-login";
import { GOOGLE_CLIENT_ID_WEB } from "./constants";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { getSocket } from "$lib/api/ws";
import { resetSingletons } from "@utils/async-singleton";
import { Network } from "@capacitor/network";

export const appConfig = () => {
  App.addListener("backButton", () => {
    window.history.back();
  });

  SocialLogin.initialize({
    google: {
      webClientId: GOOGLE_CLIENT_ID_WEB
    }
  });

  if (Capacitor.getPlatform() === "web") return;

  StatusBar.setOverlaysWebView({ overlay: true });
  StatusBar.setStyle({ style: Style.Dark });

  App.addListener("appStateChange", ({ isActive }) => {
    if (isActive) getSocket();
    else resetSingletons();
  });

  App.addListener("pause", resetSingletons);
  App.addListener("resume", getSocket);

  // Theoretically not needed
  Network.addListener("networkStatusChange", (status) => {
    if (status.connected) getSocket();
    else resetSingletons();
  });
};
