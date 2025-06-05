import { goto } from "$app/navigation";
import { getSupabaseSession } from "$lib/supabase/auth/utils";
import { supabase } from "$lib/supabase/client";

// Redirect to / if the user auth status is not what is supposed to be.
// Examples:
// - Edit password page (must be logged). If unauthorized tries to view that page, redirect to / (the base app).
// - Login page (must be NOT logged). If logged user tries to view, redirect to / (base app)
function redirect(isLogged: boolean, mustBeLogged: boolean) {
  if (isLogged !== mustBeLogged) {
    if (mustBeLogged) goto("/auth");
    else goto("/");
  }
}

export async function authGuard(mustBeLogged = true) {
  const isUserLogged = !!(await getSupabaseSession());
  redirect(isUserLogged, mustBeLogged);

  supabase.auth.onAuthStateChange(async (event, session) => {
    const isUserLogged = !!session;
    // Prevent duplicate checks
    if (event === "INITIAL_SESSION") return;
    redirect(isUserLogged, mustBeLogged);
  });
}
