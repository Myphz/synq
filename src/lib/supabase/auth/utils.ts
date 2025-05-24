import { throwError } from "@utils/throw-error";
import { supabase } from "../client";

export const getSupabaseSession = async () =>
  (await supabase.auth.getSession()).data.session;

export const getSupabaseSession_forced = async () => {
  const session = await getSupabaseSession();
  if (!session)
    return throwError("getSupabaseSession_forced(): session is null?");
  return session;
};

export const getSupabaseSession_ensureLogged = async () => {
  const session = await getSupabaseSession_forced();
  if (!checkIsUserLogged(session))
    return throwError(
      "getSupabaseSession_ensureLogged(): user is not logged in?"
    );
  return session;
};

// Check if user is really logged in (i.e., not an anonymous user)
export const checkIsUserLogged = (
  session: Awaited<ReturnType<typeof getSupabaseSession>>
) => !!session && !session?.user.is_anonymous;
