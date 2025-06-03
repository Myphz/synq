import "core-js/actual"; // Polyfills
import { SocialLogin } from "@capgo/capacitor-social-login";
import { GOOGLE_CLIENT_ID_WEB } from "./constants";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { closeSocket, getSocket_forced } from "$lib/api/ws";
import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "$lib/supabase/client";
import { getSupabaseSession, getUserId } from "$lib/supabase/auth/utils";

export const setupNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== "granted") {
    throw new Error("User denied permissions!");
  }

  await PushNotifications.addListener("registration", async (token) => {
    const fcmToken = token.value;
    // Save token in supabase
    if (!(await getSupabaseSession())) return;
    const userId = await getUserId();

    await supabase
      .from("profiles")
      .update({ fcm_token: fcmToken })
      .eq("id", userId)
      .throwOnError();
  });

  await PushNotifications.register();
};

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

  setupNotifications();

  // App.addListener("pause", closeSocket);
  // App.addListener("resume", getSocket_forced);

  // Theoretically not needed
  // Network.addListener("networkStatusChange", (status) => {
  //   if (status.connected) getSocket_forced();
  //   else closeSocket();
  // });
};
