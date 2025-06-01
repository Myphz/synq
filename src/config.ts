import "core-js/actual"; // Polyfills
import { SocialLogin } from "@capgo/capacitor-social-login";
import { GOOGLE_CLIENT_ID_WEB } from "./constants";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { closeSocket, getSocket_forced } from "$lib/api/ws";

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
    if (isActive) getSocket_forced();
    else closeSocket();
  });

  // App.addListener("pause", closeSocket);
  // App.addListener("resume", getSocket_forced);

  // Theoretically not needed
  // Network.addListener("networkStatusChange", (status) => {
  //   if (status.connected) getSocket_forced();
  //   else closeSocket();
  // });
};
