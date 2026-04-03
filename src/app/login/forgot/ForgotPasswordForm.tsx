"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

function getSupabase() {
  try {
    return createClient();
  } catch {
    return null;
  }
}

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError("Password reset is not configured.");
      return;
    }
    setPending(true);
    const origin = window.location.origin;
    const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${origin}/login`,
    });
    setPending(false);
    if (resetErr) {
      setError(resetErr.message);
      return;
    }
    setMessage("If an account exists for that email, you will receive reset instructions shortly.");
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-medium text-neutral-800">
        Email address
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          placeholder="Enter your email address"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className="mt-1.5 w-full rounded-[10px] border border-neutral-200 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {message ? <p className="text-sm text-emerald-800">{message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-[10px] bg-neutral-800 py-3 text-sm font-semibold text-white transition hover:bg-neutral-900 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
