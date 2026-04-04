import { Resend } from "resend";
import type { OrderLineItem, OrderShippingAddress } from "@/lib/supabase/types";
import { formatMoneyPdf } from "./format-money-pdf";
import type { OrderInvoicePdfInput } from "./invoice-types";
import { renderOrderInvoicePdf } from "./render-invoice-pdf";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const DEFAULT_ORDER_NOTIFY_EMAIL = "subiselva61@gmail.com";

function notifyRecipients(): string[] {
  const direct = process.env.ORDERS_NOTIFY_EMAIL?.trim();
  if (direct) return direct.split(",").map((e) => e.trim()).filter(Boolean);
  const fromAdmin = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  if (fromAdmin.length > 0) return fromAdmin;
  return [DEFAULT_ORDER_NOTIFY_EMAIL];
}

function shippingHtml(s: OrderShippingAddress): string {
  const lines = [s.line1, s.line2, `${s.city}, ${s.state} ${s.pincode}`, s.landmark].filter(Boolean);
  return lines.map((l) => `<div>${escapeHtml(l!)}</div>`).join("");
}

function lineItemsHtml(items: OrderLineItem[]): string {
  const rows = items
    .map(
      (l) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee">${escapeHtml(l.name)}</td>` +
        `<td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${l.quantity}</td>` +
        `<td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${escapeHtml(formatMoneyPdf(l.unit_price, l.currency))}</td>` +
        `<td style="padding:8px;border-bottom:1px solid #eee;text-align:right">${escapeHtml(formatMoneyPdf(l.line_total_cents / 100, l.currency))}</td></tr>`,
    )
    .join("");
  return `<table style="border-collapse:collapse;width:100%;max-width:560px;font-family:sans-serif;font-size:14px"><thead><tr style="background:#f5f5f7"><th style="padding:8px;text-align:left">Item</th><th style="padding:8px;text-align:right">Qty</th><th style="padding:8px;text-align:right">Unit</th><th style="padding:8px;text-align:right">Line</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function formatResendErr(e: { message: string; name?: string }): string {
  return e.name ? `${e.name}: ${e.message}` : e.message;
}

export type OrderEmailPayload = {
  orderId: string;
  createdAtIso: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shipping: OrderShippingAddress;
  lineItems: OrderLineItem[];
  subtotalCents: number;
  currency: string;
};

export type SendOrderEmailsResult = { notes: string[] };

export async function sendOrderEmails(payload: OrderEmailPayload): Promise<SendOrderEmailsResult> {
  const notes: string[] = [];
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ORDERS_FROM_EMAIL?.trim();
  if (!apiKey || !from) {
    const hint =
      process.env.NODE_ENV === "development"
        ? "add RESEND_API_KEY and ORDERS_FROM_EMAIL to .env.local, then restart the dev server"
        : "add RESEND_API_KEY and ORDERS_FROM_EMAIL in your host’s environment variables (e.g. Vercel → Settings → Environment Variables), then redeploy";
    notes.push(`Emails were not sent: ${hint}.`);
    console.warn("[orders]", notes[0]);
    return { notes };
  }

  if (/onboarding@resend\.dev/i.test(from)) {
    notes.push(
      "Using onboarding@resend.dev: Resend only delivers test mail to your Resend account email. Verify a domain and set ORDERS_FROM_EMAIL to orders@yourdomain.com to email any customer.",
    );
  }

  const resend = new Resend(apiKey);
  const toAdmin = notifyRecipients();
  const subtotal = formatMoneyPdf(payload.subtotalCents / 100, payload.currency);

  if (toAdmin.length > 0) {
    const adminHtml = `
      <h1 style="font-family:sans-serif;font-size:20px">New COD order</h1>
      <p style="font-family:sans-serif;font-size:14px;color:#333">Order <strong>${escapeHtml(payload.orderId)}</strong> · ${escapeHtml(payload.createdAtIso)}</p>
      <h2 style="font-family:sans-serif;font-size:16px;margin-top:24px">Customer</h2>
      <p style="font-family:sans-serif;font-size:14px">${escapeHtml(payload.customerName)}<br/>
      +91 ${escapeHtml(payload.customerPhone)}<br/>
      ${escapeHtml(payload.customerEmail)}</p>
      <h2 style="font-family:sans-serif;font-size:16px;margin-top:20px">Delivery address</h2>
      <div style="font-family:sans-serif;font-size:14px">${shippingHtml(payload.shipping)}</div>
      <h2 style="font-family:sans-serif;font-size:16px;margin-top:20px">Lines</h2>
      ${lineItemsHtml(payload.lineItems)}
      <p style="font-family:sans-serif;font-size:16px;margin-top:16px"><strong>Subtotal:</strong> ${escapeHtml(subtotal)} (indicative)</p>
      <p style="font-family:sans-serif;font-size:13px;color:#666">Payment: cash on delivery · Status: pending</p>
    `;
    const adminRes = await resend.emails.send({
      from,
      to: toAdmin,
      subject: `New order ${payload.orderId} — ${payload.customerName}`,
      html: adminHtml,
    });
    if (adminRes.error) {
      const msg = formatResendErr(adminRes.error);
      notes.push(`Admin notification failed: ${msg}`);
      console.error("[orders] admin email failed:", msg);
    } else {
      notes.push(`Admin notification sent (Resend id: ${adminRes.data?.id ?? "ok"}).`);
      console.log("[orders] admin email ok", adminRes.data?.id);
    }
  }

  const invoiceInput: OrderInvoicePdfInput = {
    orderId: payload.orderId,
    createdAtIso: payload.createdAtIso,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    customerEmail: payload.customerEmail,
    shipping: payload.shipping,
    lineItems: payload.lineItems,
    subtotalCents: payload.subtotalCents,
    currency: payload.currency,
    paymentMethod: "cod",
  };

  let pdfBase64: string | null = null;
  try {
    const buf = await renderOrderInvoicePdf(invoiceInput);
    pdfBase64 = Buffer.from(buf).toString("base64");
  } catch (e) {
    console.error("[orders] PDF render failed:", e);
    notes.push("Invoice PDF could not be generated; customer email may be sent without attachment.");
  }

  const customerHtml = `
    <p style="font-family:sans-serif;font-size:16px">Hi ${escapeHtml(payload.customerName)},</p>
    <p style="font-family:sans-serif;font-size:15px;line-height:1.5">Thank you for ordering with <strong>Mathi Enterprises</strong>. We received your order <strong>${escapeHtml(payload.orderId)}</strong> (cash on delivery).</p>
    <p style="font-family:sans-serif;font-size:15px;line-height:1.5">Our team will contact you to confirm availability, freight, and the final amount before dispatch.</p>
    <p style="font-family:sans-serif;font-size:14px;color:#555">Indicative subtotal: ${escapeHtml(subtotal)}</p>
    <p style="font-family:sans-serif;font-size:14px;margin-top:24px">— Mathi Enterprises<br/>Chennai, Tamil Nadu</p>
  `;

  const sendCustomer = (attachments?: { filename: string; content: string; contentType: string }[]) =>
    resend.emails.send({
      from,
      to: payload.customerEmail,
      subject: `Thank you — order ${payload.orderId} received`,
      html: customerHtml,
      attachments,
    });

  let cRes = await sendCustomer(
    pdfBase64
      ? [
          {
            filename: `invoice-${payload.orderId}.pdf`,
            content: pdfBase64,
            contentType: "application/pdf",
          },
        ]
      : undefined,
  );

  if (cRes.error && pdfBase64) {
    const msg = formatResendErr(cRes.error);
    console.warn("[orders] customer email with PDF failed, retrying without attachment:", msg);
    cRes = await sendCustomer(undefined);
    if (!cRes.error) {
      notes.push("Customer email sent without PDF attachment (invoice upload failed on first try).");
    }
  }

  if (cRes.error) {
    const msg = formatResendErr(cRes.error);
    notes.push(`Customer confirmation failed: ${msg}`);
    console.error("[orders] customer email failed:", msg);
  } else {
    notes.push(`Customer confirmation sent (Resend id: ${cRes.data?.id ?? "ok"}).`);
    console.log("[orders] customer email ok", cRes.data?.id);
  }

  return { notes };
}
