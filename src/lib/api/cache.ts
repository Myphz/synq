import { APP_VERSION } from "../../version";
import { Preferences } from "@capacitor/preferences";
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
  version: string;
  chats: Record<string, ChatWithMessages>;
};

export const saveAppState = async () => {
  const state: Cache = {
    version: APP_VERSION,
    // Override hasLatestUpdates of chats
    // to make sure the client refetches them and gets the latest updates
    // (cache might be outdated, can't be trusted!!)
    chats: Object.fromEntries(
      Object.entries(chats)
        .filter(([_, value]) => !value.isNew)
        .map(([key, value]) => {
          return [
            Number(key),
            { ...value, hasLatestUpdates: false, isNew: false }
          ];
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
    const { chats } = JSON.parse(stateString) as Cache;
    setChats(chats);
  } catch {
    Preferences.remove({ key: "state" });
  }
};
