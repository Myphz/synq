import "core-js/actual"; // Polyfills
import { SocialLogin } from "@capgo/capacitor-social-login";
import { GOOGLE_CLIENT_ID_WEB } from "./constants";
import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { Capacitor, SystemBars, SystemBarsStyle } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import { supabase } from "$lib/supabase/client";
import { getSupabaseSession, getUserId } from "$lib/supabase/auth/utils";
import { goto } from "$app/navigation";
import { getAppState, restoreAppState, saveAppState } from "$lib/api/cache";
import { connect, disconnect } from "$lib/stores/socket.svelte";
import { LocalNotifications } from "@capacitor/local-notifications";
import { addDebugInputFile } from "@utils/files/debug";
import { finishSendImage } from "$lib/api/media";

export const setupNotifications = async () => {
  if (await getSupabaseSession()) return configNotifications();

  const listener = supabase.auth.onAuthStateChange((_, session) => {
    if (!session) return;
    configNotifications();
    listener.data.subscription.unsubscribe();
  });
};

const configNotifications = async () => {
  if ((await PushNotifications.checkPermissions()).receive === "prompt")
    await PushNotifications.requestPermissions();

  if ((await LocalNotifications.checkPermissions()).display === "prompt")
    await LocalNotifications.requestPermissions();

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

  if (Capacitor.getPlatform() === "web") return addDebugInputFile();

  StatusBar.setOverlaysWebView({ overlay: true });
  SystemBars.setStyle({ style: SystemBarsStyle.Dark });

  App.addListener("appRestoredResult", async (data) => {
    if (!data.success || data.pluginId !== "FilePicker") return;

    const state = await getAppState();
    if (!state) return;

    if (state.url) await goto(state.url);

    const images = data.data?.files;
    if (!images.length) return;

    await finishSendImage(images[0]);
  });

  setupNotifications();
};
