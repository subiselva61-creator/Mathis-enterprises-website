"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { isAllowlistedAdminEmail } from "@/lib/admin-auth";
import { createServiceRoleClient } from "@/lib/supabase/service";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function requireAdminUser() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase is not configured");
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email || !isAllowlistedAdminEmail(user.email)) {
    throw new Error("Forbidden");
  }
  return user;
}

export type SaveOverrideState = { ok?: boolean; error?: string };

export async function saveProductOverride(_prev: SaveOverrideState, formData: FormData): Promise<SaveOverrideState> {
  try {
    await requireAdminUser();
    const service = createServiceRoleClient();
    if (!service) return { error: "SUPABASE_SERVICE_ROLE_KEY is not set" };

    const productId = (formData.get("product_id") as string)?.trim();
    if (!productId) return { error: "Missing product id" };

    const priceRaw = (formData.get("price") as string)?.trim();
    const price = priceRaw === "" ? null : Number(priceRaw);
    if (priceRaw !== "" && (Number.isNaN(price!) || price! < 0)) {
      return { error: "Invalid price" };
    }

    const descriptionRaw = (formData.get("description") as string) ?? "";
    const description = descriptionRaw.trim() === "" ? null : descriptionRaw.trim();

    const imagesRaw = (formData.get("images") as string) ?? "";
    const images =
      imagesRaw.trim() === ""
        ? null
        : imagesRaw
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean);

    const skipIndiamart = formData.get("skip_indiamart_price") === "on";
    const porMode = (formData.get("price_on_request_mode") as string) || "inherit";
    const priceOnRequest =
      porMode === "inherit" ? null : porMode === "true" ? true : porMode === "false" ? false : null;

    const payload = {
      product_id: productId,
      price,
      description,
      images,
      skip_indiamart_price: skipIndiamart,
      price_on_request: priceOnRequest,
      updated_at: new Date().toISOString(),
    };

    const { error } = await service.from("product_overrides").upsert(payload, { onConflict: "product_id" });
    if (error) return { error: error.message };

    revalidateTag("catalog", "max");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Save failed";
    return { error: msg };
  }
}

export type SimpleActionState = { ok?: boolean; error?: string };

export async function deleteProductOverride(productId: string): Promise<SimpleActionState> {
  try {
    await requireAdminUser();
    const service = createServiceRoleClient();
    if (!service) return { error: "SUPABASE_SERVICE_ROLE_KEY is not set" };
    const { error } = await service.from("product_overrides").delete().eq("product_id", productId);
    if (error) return { error: error.message };
    revalidateTag("catalog", "max");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Delete failed";
    return { error: msg };
  }
}

export async function uploadProductImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  try {
    await requireAdminUser();
    const service = createServiceRoleClient();
    if (!service) return { error: "SUPABASE_SERVICE_ROLE_KEY is not set" };

    const productId = (formData.get("product_id") as string)?.trim();
    const file = formData.get("file");
    if (!productId || !file || !(file instanceof File) || file.size === 0) {
      return { error: "Missing file or product id" };
    }
    if (file.size > 6 * 1024 * 1024) return { error: "File too large (max 6MB)" };

    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `${productId}/${Date.now()}-${safeName}`;
    const buf = Buffer.from(await file.arrayBuffer());

    const { error } = await service.storage.from("product-images").upload(path, buf, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
    if (error) return { error: error.message };

    const { data } = service.storage.from("product-images").getPublicUrl(path);
    return { url: data.publicUrl };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    return { error: msg };
  }
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/admin/login");
}
