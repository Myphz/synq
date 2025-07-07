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
import { goto } from "$app/navigation";
import { restoreAppState, saveAppState } from "$lib/api/cache";

export const setupNotifications = async () => {
  if (!(await getSupabaseSession()))
    return supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" || !session) return;
      configNotifications();
    });

  configNotifications();
};

const configNotifications = async () => {
  let permStatus = await PushNotifications.checkPermissions();

  if (permStatus.receive === "prompt") {
    permStatus = await PushNotifications.requestPermissions();
  }

  if (permStatus.receive !== "granted") {
    throw new Error("User denied permissions!");
  }

  await PushNotifications.addListener("registration", async (token) => {
    const fcmToken = token.value;
    if (!(await getSupabaseSession())) return;
    const userId = await getUserId();

    // Save token in supabase
    await supabase
      .from("profiles")
      .update({ fcm_token: fcmToken })
      .eq("id", userId)
      .throwOnError();
  });

  await PushNotifications.addListener(
    "pushNotificationActionPerformed",
    (event) => {
      const { chatId } = event.notification.data || {};
      if (chatId) goto(`/${chatId}`);
    }
  );

  await PushNotifications.register();
};

export const appConfig = () => {
  restoreAppState();

  App.addListener("backButton", () => {
    goto("/");
  });

  SocialLogin.initialize({
    google: {
      webClientId: GOOGLE_CLIENT_ID_WEB
    }
  });

  App.addListener("appStateChange", ({ isActive }) => {
    if (isActive) {
      restoreAppState();
      getSocket_forced();
    } else {
      saveAppState();
      closeSocket();
    }
  });

  if (Capacitor.getPlatform() === "web") return;

  StatusBar.setOverlaysWebView({ overlay: true });
  StatusBar.setStyle({ style: Style.Dark });

  setupNotifications();

  // App.addListener("pause", closeSocket);
  // App.addListener("resume", getSocket_forced);

  // Theoretically not needed
  // Network.addListener("networkStatusChange", (status) => {
  //   if (status.connected) getSocket_forced();
  //   else closeSocket();
  // });
};
