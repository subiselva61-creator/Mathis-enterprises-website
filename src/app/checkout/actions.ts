"use server";

import { getMergedProducts } from "@/lib/catalog";
import { sendOrderEmails } from "@/lib/orders/send-order-emails";
import { createServiceRoleClient } from "@/lib/supabase/service";
import type { OrderLineItem, OrderShippingAddress } from "@/lib/supabase/types";

export type PlaceOrderInput = {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shipping: OrderShippingAddress;
  lines: { productId: string; quantity: number }[];
  codAccepted: boolean;
};

function normalizePhone(raw: string): string | null {
  const d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) return d.slice(2);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  if (d.length === 10) return d;
  return null;
}

function validateShipping(s: OrderShippingAddress): string | null {
  if (!s.line1?.trim()) return "Address line 1 is required.";
  if (!s.city?.trim()) return "City is required.";
  if (!s.state?.trim()) return "State is required.";
  if (!/^\d{6}$/.test(s.pincode?.trim() ?? "")) return "PIN code must be 6 digits.";
  return null;
}

export async function placeOrder(input: PlaceOrderInput): Promise<
  { ok: true; orderId: string; emailNotes?: string[] } | { ok: false; error: string }
> {
  if (!input.codAccepted) return { ok: false, error: "Please confirm cash on delivery." };
  const name = input.customerName?.trim();
  if (!name || name.length < 2) return { ok: false, error: "Please enter your full name." };
  const phone = normalizePhone(input.customerPhone ?? "");
  if (!phone) return { ok: false, error: "Please enter a valid 10-digit mobile number." };
  const email = input.customerEmail?.trim() ?? "";
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      error: "Please enter a valid email address. We send your confirmation and invoice PDF there.",
    };
  }
  const shipErr = validateShipping(input.shipping);
  if (shipErr) return { ok: false, error: shipErr };
  if (!input.lines?.length) return { ok: false, error: "Your cart is empty." };

  const supabase = createServiceRoleClient();
  if (!supabase) return { ok: false, error: "Orders are temporarily unavailable. Please try again later." };

  const products = await getMergedProducts();
  const byId = new Map(products.map((p) => [p.id, p]));

  const lineItems: OrderLineItem[] = [];
  let subtotalCents = 0;
  let currency = "INR";

  for (const line of input.lines) {
    const q = Math.floor(line.quantity);
    if (q < 1) return { ok: false, error: "Invalid quantity." };
    const p = byId.get(line.productId);
    if (!p) return { ok: false, error: "One or more products are no longer available." };
    if (p.priceOnRequest) return { ok: false, error: `"${p.name}" is price on request — remove it from your bag or contact us directly.` };
    currency = p.currency;
    const lineTotalCents = Math.round(p.price * q * 100);
    subtotalCents += lineTotalCents;
    lineItems.push({
      product_id: p.id,
      name: p.name,
      quantity: q,
      unit_price: p.price,
      currency: p.currency,
      line_total_cents: lineTotalCents,
    });
  }

  const shipping: OrderShippingAddress = {
    line1: input.shipping.line1.trim(),
    line2: input.shipping.line2?.trim() || undefined,
    city: input.shipping.city.trim(),
    state: input.shipping.state.trim(),
    pincode: input.shipping.pincode.trim(),
    landmark: input.shipping.landmark?.trim() || undefined,
  };

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: name,
      customer_phone: phone,
      customer_email: email,
      shipping_address: shipping,
      line_items: lineItems,
      subtotal_cents: subtotalCents,
      currency,
      payment_method: "cod",
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    console.error("[checkout] order insert failed:", error.message, error.code, error.details);
    const msg = error.message ?? "";
    const isDev = process.env.NODE_ENV === "development";
    if (isDev) {
      const cacheHint = /schema cache/i.test(msg)
        ? " Run NOTIFY pgrst, 'reload schema'; in Supabase SQL Editor (see supabase/migrations/004_postgrest_reload_schema.sql)."
        : "";
      return {
        ok: false,
        error: `[dev] ${msg}${error.hint ? ` (${error.hint})` : ""}${cacheHint}`,
      };
    }
    if (/does not exist|schema cache|42P01|PGRST205/i.test(msg) || error.code === "42P01") {
      return {
        ok: false,
        error:
          "Orders are not set up on the server yet. Ask the administrator to run the database migration for the orders table.",
      };
    }
    if (/permission denied|42501/i.test(msg) || error.code === "42501") {
      return {
        ok: false,
        error: "The server could not save your order. Check that the Supabase service role key is configured correctly.",
      };
    }
    return { ok: false, error: "Could not place your order. Please try again." };
  }

  if (!data?.id) {
    console.error("[checkout] order insert returned no id");
    return { ok: false, error: "Could not place your order. Please try again." };
  }

  const orderId = data.id as string;
  const createdAtIso = new Date().toISOString();
  let emailNotes: string[] | undefined;
  try {
    const { notes } = await sendOrderEmails({
      orderId,
      createdAtIso,
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      shipping,
      lineItems,
      subtotalCents,
      currency,
    });
    emailNotes = notes;
  } catch (e) {
    console.error("[orders] transactional email error:", e);
    emailNotes = [`Email system error: ${e instanceof Error ? e.message : String(e)}`];
  }

  return { ok: true, orderId, emailNotes };
}
