import { createClient } from "@supabase/supabase-js";
import type { ProductOverrideRow } from "./types";

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchProductOverrideRows(): Promise<ProductOverrideRow[]> {
  const supabase = createServiceRoleClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("product_overrides").select("*");
  if (error) {
    console.error("[catalog] product_overrides fetch failed:", error.message);
    return [];
  }
  return (data ?? []) as ProductOverrideRow[];
}

export async function fetchProductOverrideRow(productId: string): Promise<ProductOverrideRow | null> {
  const supabase = createServiceRoleClient();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("product_overrides")
    .select("*")
    .eq("product_id", productId)
    .maybeSingle();
  if (error) {
    console.error("[admin] product_override fetch failed:", error.message);
    return null;
  }
  return data as ProductOverrideRow | null;
}
