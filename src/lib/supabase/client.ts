"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabasePublishableKey, getSupabaseUrl } from "./public-env";

export function createClient() {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();
  if (!url || !key) {
    const hasSecretInPublicSlot =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim().startsWith("sb_secret_") ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim().startsWith("sb_secret_");
    if (hasSecretInPublicSlot) {
      throw new Error(
        "Supabase secret key (sb_secret_…) was set as a NEXT_PUBLIC_ variable. Use the publishable key (sb_publishable_…) or legacy anon JWT for NEXT_PUBLIC_SUPABASE_ANON_KEY, and put the secret in SUPABASE_SERVICE_ROLE_KEY only."
      );
    }
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and a public key: set NEXT_PUBLIC_SUPABASE_ANON_KEY (legacy anon JWT or sb_publishable_…) or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, then redeploy."
    );
  }
  return createBrowserClient(url, key);
}
