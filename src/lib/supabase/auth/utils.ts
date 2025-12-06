import { throwError } from "@utils/throw-error";
import { supabase } from "../client";
import { toAsyncSingleton } from "@utils/async-singleton";

export const getUserId = toAsyncSingleton(
  async () => (await getSupabaseSession_forced()).user.id,
  "id"
);

export const getSupabaseSession = async () =>
  (await supabase.auth.getSession()).data.session;

export const getSupabaseSession_forced = async () => {
  const session = await getSupabaseSession();
  if (!session)
    return throwError("getSupabaseSession_forced(): session is null?");
  return session;
};
