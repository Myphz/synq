import { goto } from "$app/navigation";
import { APP_VERSION } from "../../version";
import { Preferences } from "@capacitor/preferences";
import { page } from "$app/state";
import {
  chats,
  setChats,
  type ChatWithMessages
} from "$lib/stores/chats.svelte";

// const appStateSchema = z.object({
//   url: z.string(),
//   version: z.string(),
//   chats: Record<string, ChatWithMessages>,
// });

type Cache = {
  url: string;
  version: string;
  chats: Record<string, ChatWithMessages>;
};

export const saveAppState = async () => {
  const urlToSave = /^\/\d+\/?$/.test(page.url.pathname)
    ? page.url.pathname
    : "/";

  const state: Cache = {
    url: urlToSave,
    version: APP_VERSION,
    // Override isInitialized of chats
    chats: Object.fromEntries(
      Object.entries(chats).map(([key, value]) => {
        return [key, { ...value, isInitialized: false }];
      })
    )
  };

  await Preferences.set({
    key: "state",
    value: JSON.stringify(state)
  });
};

export const restoreAppState = async () => {
  const { value: stateString } = await Preferences.get({ key: "state" });
  if (!stateString) return;

  try {
    const { url, chats } = JSON.parse(stateString) as Cache;
    setChats(chats);
    if (page.url.pathname !== url) goto(url);
  } catch {
    Preferences.remove({ key: "state" });
  }
};
