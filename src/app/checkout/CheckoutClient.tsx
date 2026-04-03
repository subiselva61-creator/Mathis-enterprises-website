"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/data/products";
import { useCart } from "@/components/cart/cart-context";
import Stepper, { Step } from "@/components/Stepper";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { placeOrder } from "./actions";
import { formatPrice, formatProductPrice } from "@/lib/format";

type Props = { products: Product[] };

function normalizeIndianMobileDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length === 12 && d.startsWith("91")) d = d.slice(2);
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 10);
}

function clientPhoneOk(raw: string): boolean {
  const d = normalizeIndianMobileDigits(raw);
  return d.length === 10;
}

function clientEmailOk(raw: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
}

export default function CheckoutClient({ products }: Props) {
  const router = useRouter();
  const { user } = useSupabaseUser();
  const { lines, subtotalCents, isReady, clear } = useCart();
  const byId = useMemo(() => new Map(products.map((p) => [p.id, p])), [products]);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [emailNotes, setEmailNotes] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");

  const [codAccepted, setCodAccepted] = useState(false);

  useEffect(() => {
    if (isReady && lines.length === 0 && !orderId) {
      router.replace("/cart");
    }
  }, [isReady, lines.length, orderId, router]);

  const currency = useMemo(() => {
    for (const l of lines) {
      const p = byId.get(l.productId);
      if (p && !p.priceOnRequest) return p.currency;
    }
    return products.find((x) => !x.priceOnRequest)?.currency ?? "INR";
  }, [lines, byId, products]);

  const accountEmail = user?.email?.trim() ?? "";
  const effectiveEmail = accountEmail || email.trim();
  const step1Ok =
    name.trim().length >= 2 && clientPhoneOk(phone) && clientEmailOk(effectiveEmail);
  const step2Ok =
    line1.trim().length >= 1 &&
    city.trim().length >= 1 &&
    state.trim().length >= 1 &&
    /^\d{6}$/.test(pincode.trim());

  const handleFinal = useCallback(async () => {
    if (!codAccepted) {
      setSubmitError("Please confirm cash on delivery.");
      return false;
    }
    setSubmitError(null);
    setPlacing(true);
    try {
      const res = await placeOrder({
        customerName: name,
        customerPhone: phone,
        customerEmail: effectiveEmail,
        shipping: {
          line1,
          line2,
          city,
          state,
          pincode: pincode.trim(),
          landmark,
        },
        lines: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        codAccepted: true,
      });
      if (!res.ok) {
        setSubmitError(res.error);
        return false;
      }
      setEmailNotes("emailNotes" in res && Array.isArray(res.emailNotes) ? res.emailNotes : []);
      setOrderId(res.orderId);
      clear();
      return true;
    } finally {
      setPlacing(false);
    }
  }, [
    codAccepted,
    name,
    phone,
    effectiveEmail,
    line1,
    line2,
    city,
    state,
    pincode,
    landmark,
    lines,
    clear,
  ]);

  if (!isReady) {
    return <p className="text-neutral-500">Loading…</p>;
  }

  if (orderId) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-neutral-900">Order received</h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Thank you. Your reference number is{" "}
          <span className="font-mono font-medium text-neutral-900">{orderId}</span>. We will call or message you to confirm
          your order and delivery before dispatch. Payment is cash on delivery.
        </p>
        {emailNotes.length > 0 ? (
          <div className="mt-5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs leading-relaxed text-amber-950">
            <p className="font-semibold text-amber-900">Email status</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {emailNotes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </div>
        ) : null}
        <Link
          href="/shop"
          className="mt-8 inline-flex min-h-[2.75rem] items-center justify-center rounded-full bg-[#0027eb] px-6 text-sm font-medium text-white hover:bg-[#1e46f4]"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const input =
    "mt-1.5 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none ring-[#0027eb] focus:border-[#0027eb] focus:ring-2";
  const label = "text-sm font-medium text-neutral-800";

  return (
    <Stepper
      initialStep={1}
      disableStepIndicators
      onFinalStepCompleted={handleFinal}
      backButtonText="Previous"
      nextButtonText="Next"
      isNextDisabled={(s) =>
        placing || (s === 1 && !step1Ok) || (s === 2 && !step2Ok) || (s === 3 && !codAccepted)
      }
      className="items-stretch justify-start md:py-10"
      stepCircleContainerClassName="border-b border-neutral-100"
    >
      <Step>
        <h2 className="text-lg font-semibold text-neutral-900">Contact</h2>
        <p className="text-sm text-neutral-600">How we reach you about this order.</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className={label} htmlFor="co-name">
              Full name
            </label>
            <input id="co-name" className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </div>
          <div>
            <label className={label} htmlFor="co-phone">
              Mobile number
            </label>
            <div
              className={`mt-1.5 flex overflow-hidden rounded-lg border border-neutral-300 bg-white ring-[#0027eb] focus-within:border-[#0027eb] focus-within:ring-2`}
            >
              <span
                className="flex shrink-0 items-center gap-2 border-r border-neutral-200 bg-neutral-50 px-3 py-2 text-sm text-neutral-800"
                aria-hidden="true"
              >
                <span className="text-[1.125rem] leading-none" title="India">
                  🇮🇳
                </span>
                <span className="font-medium tabular-nums tracking-tight">+91</span>
              </span>
              <input
                id="co-phone"
                name="phone"
                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-neutral-900 outline-none"
                value={phone}
                onChange={(e) => setPhone(normalizeIndianMobileDigits(e.target.value))}
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="98765 43210"
                maxLength={10}
                aria-describedby="co-phone-hint"
              />
            </div>
            <p id="co-phone-hint" className="mt-1 text-xs text-neutral-500">
              10-digit Indian mobile number (without country code).
            </p>
          </div>
          {accountEmail ? (
            <div>
              <p className={label}>Email</p>
              <div className="mt-1.5 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-sm text-neutral-800">
                <span className="break-all">{accountEmail}</span>
              </div>
              <p className="mt-1 text-xs text-neutral-500">Using your signed-in account email for this order.</p>
            </div>
          ) : (
            <div>
              <label className={label} htmlFor="co-email">
                Email <span className="font-normal text-neutral-500">(required — invoice PDF)</span>
              </label>
              <input
                id="co-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                className={input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}
        </div>
      </Step>
      <Step>
        <h2 className="text-lg font-semibold text-neutral-900">Delivery address</h2>
        <p className="text-sm text-neutral-600">Where we should deliver your materials.</p>
        <div className="mt-5 space-y-4">
          <div>
            <label className={label} htmlFor="co-a1">
              Address line 1
            </label>
            <input id="co-a1" className={input} value={line1} onChange={(e) => setLine1(e.target.value)} />
          </div>
          <div>
            <label className={label} htmlFor="co-a2">
              Address line 2 <span className="font-normal text-neutral-500">(optional)</span>
            </label>
            <input id="co-a2" className={input} value={line2} onChange={(e) => setLine2(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="co-city">
                City
              </label>
              <input id="co-city" className={input} value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className={label} htmlFor="co-state">
                State
              </label>
              <input id="co-state" className={input} value={state} onChange={(e) => setState(e.target.value)} />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="co-pin">
                PIN code
              </label>
              <input
                id="co-pin"
                className={input}
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                inputMode="numeric"
              />
            </div>
            <div>
              <label className={label} htmlFor="co-lm">
                Landmark <span className="font-normal text-neutral-500">(optional)</span>
              </label>
              <input id="co-lm" className={input} value={landmark} onChange={(e) => setLandmark(e.target.value)} />
            </div>
          </div>
        </div>
      </Step>
      <Step>
        <h2 className="text-lg font-semibold text-neutral-900">Review & confirm</h2>
        <p className="text-sm text-neutral-600">Indicative totals; final amount confirmed before delivery.</p>
        {submitError ? (
          <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {submitError}
          </p>
        ) : null}
        <ul className="mt-4 space-y-3 border-t border-neutral-100 pt-4">
          {lines.map((line) => {
            const p = byId.get(line.productId);
            if (!p) return null;
            return (
              <li key={line.productId} className="flex justify-between gap-4 text-sm">
                <span className="text-neutral-800">
                  {p.name} × {line.quantity}
                  {p.priceBasis ? (
                    <span className="block text-xs font-normal text-neutral-500">
                      {formatProductPrice(p)} / {p.priceBasis.toLowerCase()}
                    </span>
                  ) : null}
                </span>
                <span className="shrink-0 font-medium text-neutral-900">
                  {formatPrice(p.price * line.quantity, p.currency)}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold">
          <span>Subtotal</span>
          <span>{formatPrice(subtotalCents / 100, currency)}</span>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-neutral-500">
          Rates shown are indicative. MOQ, freight, and the amount due will be confirmed when we contact you.
        </p>
        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={codAccepted}
            onChange={(e) => setCodAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-[#0027eb] focus:ring-[#0027eb]"
          />
          <span>
            I understand payment is cash on delivery when the order is fulfilled, and the final payable amount may differ
            after confirmation.
          </span>
        </label>
      </Step>
    </Stepper>
  );
}
