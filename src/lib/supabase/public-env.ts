/**
 * Browser-safe Supabase key: legacy JWT `anon` or new `sb_publishable_...`.
 * Never use `sb_secret_...` or `service_role` JWT here — Supabase rejects those from browsers.
 * @see https://supabase.com/docs/guides/api/api-keys
 */
export function getSupabasePublishableKey(): string | undefined {
  const candidates = [
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim(),
  ].filter(Boolean) as string[];
  for (const key of candidates) {
    if (!key.startsWith("sb_secret_")) return key;
  }
  return undefined;
}

export function getSupabaseUrl(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || undefined;
}
