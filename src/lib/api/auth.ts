import { supabase } from "$lib/supabase/client";
import {
  SocialLogin,
  type GoogleLoginResponseOnline
} from "@capgo/capacitor-social-login";
import { throwError } from "@utils/throw-error";
import { getSocket_forced } from "./ws";

export const logInWithGoogle = async () => {
  const response = await SocialLogin.login({
    provider: "google",
    options: {
      scopes: ["email", "profile"],
      forceRefreshToken: true
    }
  });

  // Automatically create an account or login
  // if user already exists
  // NB: Nonce check must be disabled in Supabase! (https://github.com/orgs/supabase/discussions/17801#discussioncomment-8003255)
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: (response.result as GoogleLoginResponseOnline).idToken!,
    access_token: (response.result as GoogleLoginResponseOnline).accessToken
      ?.token
  });

  if (error || !data.user)
    return throwError("Google Login: signInWithIdToken failed?!?");

  getSocket_forced();
};
