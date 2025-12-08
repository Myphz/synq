import "core-js/actual"; // Polyfills
import { SocialLogin } from "@capgo/capacitor-social-login";
import { GOOGLE_CLIENT_ID_WEB } from "./constants";
import { App } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "$lib/supabase/client";
import { getSupabaseSession, getUserId } from "$lib/supabase/auth/utils";
import { goto } from "$app/navigation";
import { restoreAppState, saveAppState } from "$lib/api/cache";
import { connect, disconnect } from "$lib/stores/socket.svelte";
import { LocalNotifications } from "@capacitor/local-notifications";

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

  // Repeat setup for local notifications
  let localPerm = await LocalNotifications.checkPermissions();
  if (localPerm.display === "prompt") {
    localPerm = await LocalNotifications.requestPermissions();
  }
  if (localPerm.display !== "granted") {
    console.warn("Local notification permissions denied!");
  }

  await LocalNotifications.createChannel({
    id: "local_notifications",
    name: "Chat Messages",
    importance: 5
  });

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
      if (chatId) goto(`/${chatId}`, { replaceState: true });
    }
  );

  await LocalNotifications.addListener(
    "localNotificationActionPerformed",
    (event) => {
      const { chatId } = event.notification.extra || {};
      if (chatId) goto(`/${chatId}`, { replaceState: true });
    }
  );

  await PushNotifications.register();
};

export const appConfig = () => {
  restoreAppState();

  supabase.auth.onAuthStateChange((_, session) => {
    const isUserLogged = !!session;
    if (!isUserLogged) return;

    connect();
  });

  App.addListener("backButton", () => {
    goto("/");
  });

  SocialLogin.initialize({
    google: {
      webClientId: GOOGLE_CLIENT_ID_WEB
    }
  });

  App.addListener("appStateChange", async ({ isActive }) => {
    if (isActive) {
      await restoreAppState();
      await connect();
    } else {
      await saveAppState();
      await disconnect();
    }
  });

  if (Capacitor.getPlatform() === "web") return;

  StatusBar.setOverlaysWebView({ overlay: true });
  StatusBar.setStyle({ style: Style.Dark });

  setupNotifications();
};
