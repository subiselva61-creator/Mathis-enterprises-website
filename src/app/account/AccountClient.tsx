"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { LogOut, Package, UserRound } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { storefrontPillBrand } from "@/lib/storefront-styles";
import { cn } from "@/lib/utils";

function getSupabase() {
  try {
    return createClient();
  } catch {
    return null;
  }
}

export default function AccountClient() {
  const router = useRouter();
  const { user, loading } = useSupabaseUser();
  const [signOutPending, setSignOutPending] = useState(false);

  const onSignOut = useCallback(async () => {
    const supabase = getSupabase();
    if (!supabase) return;
    setSignOutPending(true);
    await supabase.auth.signOut();
    setSignOutPending(false);
    router.refresh();
    router.push("/");
  }, [router]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="mx-auto max-w-lg animate-pulse space-y-4">
          <div className="h-9 w-48 rounded-lg bg-slate-200/80" />
          <div className="h-24 rounded-2xl bg-slate-100" />
          <div className="h-40 rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="page-container">
        <h1 className="pageTitle">Account</h1>
        <p className="pageLead max-w-xl">
          Sign in to see your account details and quick links to your cart. New here? You can create an account from the
          same page.
        </p>
        <div className="mt-8 max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm shadow-slate-900/[0.04]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <UserRound className="h-6 w-6" strokeWidth={1.5} aria-hidden />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            You are not signed in. Use your email or Google to continue.
          </p>
          <Link href="/login?next=/account" className={cn(storefrontPillBrand, "mt-6 w-full justify-center text-center")}>
            Sign in or create account
          </Link>
        </div>
      </div>
    );
  }

  const displayName =
    (typeof user.user_metadata?.full_name === "string" && user.user_metadata.full_name) ||
    (typeof user.user_metadata?.name === "string" && user.user_metadata.name) ||
    null;

  return (
    <div className="page-container">
      <h1 className="pageTitle">Account</h1>
      <p className="pageLead max-w-xl">Signed in as {user.email}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-10">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/[0.04] sm:p-8">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <UserRound className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">Account details</h2>
          </div>
          <dl className="mt-6 space-y-4 text-sm">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="mt-1 font-medium text-slate-900">{user.email}</dd>
            </div>
            {displayName ? (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Name</dt>
                <dd className="mt-1 font-medium text-slate-900">{displayName}</dd>
              </div>
            ) : null}
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">User ID</dt>
              <dd className="mt-1 break-all font-mono text-xs text-slate-600">{user.id}</dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={onSignOut}
            disabled={signOutPending}
            className={cn(
              "mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 disabled:opacity-50"
            )}
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} aria-hidden />
            {signOutPending ? "Signing out…" : "Sign out"}
          </button>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm shadow-slate-900/[0.04] sm:p-8">
          <div className="flex items-center gap-3 text-slate-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Package className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">Your orders</h2>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            We do not store a full order history on this site yet. Your current items live in your shopping bag on this
            device. For confirmed purchases and invoices, please reach out via{" "}
            <Link href="/contact" className="font-semibold text-[#0071e3] hover:underline">
              Contact
            </Link>{" "}
            or your usual IndiaMART channel.
          </p>
          <Link
            href="/cart"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 py-3.5 text-center text-base font-semibold text-white transition hover:bg-slate-800"
          >
            Open shopping bag
          </Link>
        </section>
      </div>
    </div>
  );
}
