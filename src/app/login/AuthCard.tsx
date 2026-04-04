"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { LogIn } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

const accentRingCheckbox = "accent-[#0071e3] focus:ring-[#0071e3]/25";
const fieldFocusOuter =
  "focus:bg-white focus:shadow-md focus:shadow-slate-900/[0.08] focus:outline-none";
const fieldFocusWithinOuter =
  "focus-within:bg-white focus-within:shadow-md focus-within:shadow-slate-900/[0.08]";

function getSupabase() {
  try {
    return createClient();
  } catch {
    return null;
  }
}

function isExplicitUnconfirmedError(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("email not confirmed") ||
    m.includes("email address is not confirmed") ||
    m.includes("user not confirmed") ||
    (m.includes("not confirmed") && m.includes("email"))
  );
}

const DEFAULT_POST_AUTH = "/shop";

/** Where to tell users to set keys: local file vs hosting dashboard. */
const ENV_SETUP_HINT =
  process.env.NODE_ENV === "development"
    ? ".env.local"
    : "your host’s environment variables (for Vercel: Project → Settings → Environment Variables), then redeploy";

function safePostAuthPath(path: string | undefined): string {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("://")) {
    return DEFAULT_POST_AUTH;
  }
  return path;
}

function OrDivider() {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center" aria-hidden>
        <div className="h-px w-full bg-slate-200/90" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
          or
        </span>
      </div>
    </div>
  );
}

function SignUpToggleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4"
        y="4"
        width="12.5"
        height="12.5"
        rx="2.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10.25" cy="9.25" r="1.65" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6.75 15.25c0-1.15 1.45-2 3.5-2s3.5.85 3.5 2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M17.25 4.35v2M16.25 5.35h2"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClosedEyeIcon({ className }: { className?: string }) {
  const lashXs = [5.5, 8.25, 11, 13.75, 16.5];
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 12.25c2.85-2.35 6.15-3.75 9-3.75s6.15 1.4 9 3.75"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      {lashXs.map((x) => (
        <line
          key={x}
          x1={x}
          y1="11.35"
          x2={x}
          y2="14.15"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

function OpenEyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s4.2 7 10 7 10-7 10-7-4.2-7-10-7-10 7-10 7z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.35" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

type Props = {
  initialMode: Mode;
  urlError?: string;
  /** Supabase/provider message from /auth/callback when error=oauth (debugging). */
  oauthErrorDetail?: string;
  registered?: boolean;
  /** Path after successful sign-in (must be same-origin, e.g. /account). */
  postAuthPath?: string;
};

export default function AuthCard({
  initialMode,
  urlError,
  oauthErrorDetail,
  registered,
  postAuthPath,
}: Props) {
  const router = useRouter();
  const nextPath = safePostAuthPath(postAuthPath);
  const buildAuthCallbackUrl = useCallback(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;
  }, [nextPath]);
  const reduceMotion = usePrefersReducedMotion();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(registered ? "You can sign in with your new account." : null);
  const [pending, setPending] = useState(false);
  const [awaitingEmailConfirm, setAwaitingEmailConfirm] = useState(false);
  const [resendPending, setResendPending] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<string | null>(null);

  const configBanner =
    urlError === "config" ? (
      <p className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm leading-relaxed text-amber-950">
        Supabase is not configured. Add{" "}
        <code className="rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[13px]">NEXT_PUBLIC_SUPABASE_URL</code> and a{" "}
        <strong>publishable</strong> key:{" "}
        <code className="rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[13px]">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> (anon JWT or{" "}
        <code className="rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[13px]">sb_publishable_…</code>) or{" "}
        <code className="rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[13px]">NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>. Do not put{" "}
        <code className="rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[13px]">sb_secret_…</code> in{" "}
        <code className="rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[13px]">NEXT_PUBLIC_*</code> — use{" "}
        <code className="rounded-md bg-amber-100/90 px-1.5 py-0.5 text-[13px]">SUPABASE_SERVICE_ROLE_KEY</code> for that.{" "}
        {ENV_SETUP_HINT}
      </p>
    ) : null;

  const oauthBanner =
    urlError === "oauth" ? (
      <div className="rounded-xl border border-red-200/80 bg-red-50/90 px-4 py-3 text-sm leading-relaxed text-red-950">
        <p>We could not finish signing you in. Try again or use email and password.</p>
        {oauthErrorDetail ? (
          <p className="mt-2 break-words font-mono text-[13px] text-red-900/90">{oauthErrorDetail}</p>
        ) : null}
      </div>
    ) : null;

  const onResendConfirmation = useCallback(async () => {
    setResendFeedback(null);
    const supabase = getSupabase();
    if (!supabase) {
      setResendFeedback(`Sign-in is not configured. Add Supabase keys to ${ENV_SETUP_HINT}.`);
      return;
    }
    const trimmed = email.trim();
    if (!trimmed) {
      setResendFeedback("Enter your email address first.");
      return;
    }
    setResendPending(true);
    const { error: resendErr } = await supabase.auth.resend({
      type: "signup",
      email: trimmed,
      options: { emailRedirectTo: buildAuthCallbackUrl() },
    });
    setResendPending(false);
    if (resendErr) {
      setResendFeedback(resendErr.message);
      return;
    }
    setResendFeedback("Confirmation email sent. Check your inbox (and spam).");
  }, [email, buildAuthCallbackUrl]);

  const oauthGoogle = useCallback(async () => {
    setError(null);
    setResendFeedback(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError(`Sign-in is not configured. Add Supabase keys to ${ENV_SETUP_HINT}.`);
      return;
    }
    setPending(true);
    const { error: oAuthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: buildAuthCallbackUrl() },
    });
    if (oAuthError) {
      setError(oAuthError.message);
      setPending(false);
    }
  }, [buildAuthCallbackUrl]);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setResendFeedback(null);
    const supabase = getSupabase();
    if (!supabase) {
      setError(`Sign-in is not configured. Add Supabase keys to ${ENV_SETUP_HINT}.`);
      return;
    }
    setPending(true);
    const { error: signErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signErr) {
      if (isExplicitUnconfirmedError(signErr.message)) {
        setError(
          "This email is not confirmed yet. Open the link we sent when you signed up, or resend the confirmation email."
        );
      } else {
        setError(signErr.message);
      }
      setPending(false);
      return;
    }
    setAwaitingEmailConfirm(false);
    router.push(nextPath);
    router.refresh();
  };

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setResendFeedback(null);
    setAwaitingEmailConfirm(false);
    const supabase = getSupabase();
    if (!supabase) {
      setError(`Sign-up is not configured. Add Supabase keys to ${ENV_SETUP_HINT}.`);
      return;
    }
    setPending(true);
    const { data, error: signErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: buildAuthCallbackUrl(),
        data: { marketing_opt_in: marketingOptIn },
      },
    });
    if (signErr) {
      setError(signErr.message);
      setPending(false);
      return;
    }
    if (data.session) {
      setAwaitingEmailConfirm(false);
      router.push(nextPath);
      router.refresh();
      return;
    }
    setAwaitingEmailConfirm(true);
    setInfo("Check your email to confirm your account, then sign in.");
    setPending(false);
  };

  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500";

  const inputFieldClass = cn(
    "w-full rounded-xl border-0 bg-slate-50 px-4 py-3.5 text-base text-slate-900 transition-[box-shadow,background-color] duration-200 placeholder:text-slate-400",
    fieldFocusOuter
  );

  const passwordShellClass = cn(
    "flex min-h-[52px] items-center rounded-xl bg-slate-50 transition-[box-shadow,background-color] duration-200",
    fieldFocusWithinOuter
  );

  const passwordInputClass =
    "min-h-0 min-w-0 flex-1 border-0 bg-transparent px-4 py-3.5 text-base leading-normal text-slate-900 outline-none placeholder:text-slate-400";

  const passwordEyeClass =
    "mr-1.5 inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-700 focus-visible:bg-slate-200/80 focus-visible:outline-none";

  const primaryButtonClass =
    "w-full cursor-pointer rounded-xl border-0 bg-slate-900 py-3.5 text-base font-semibold text-white shadow-lg shadow-slate-900/18 transition-all duration-200 hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/22 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-35 disabled:shadow-none";

  const googleButtonClass =
    "flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border-0 bg-white px-4 py-3.5 text-base font-medium text-slate-700 shadow-sm shadow-slate-900/[0.06] transition-all duration-200 hover:bg-slate-50/90 hover:shadow-md hover:shadow-slate-900/[0.08] active:scale-[0.99] disabled:pointer-events-none disabled:opacity-40";

  const footerModeButtonClass =
    "cursor-pointer rounded-lg border-0 bg-transparent px-2 py-1 font-semibold text-[#0071e3] transition-colors hover:bg-slate-100 hover:text-[#0077ed] focus-visible:bg-slate-100 focus-visible:outline-none";

  const headerTransition = reduceMotion ? { duration: 0 } : { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const };
  const mainTransition = reduceMotion ? { duration: 0 } : { duration: 0.26, ease: [0.25, 0.1, 0.25, 1] as const };
  const footerTransition = reduceMotion ? { duration: 0 } : { duration: 0.15, ease: [0.25, 0.1, 0.25, 1] as const };
  const fadeYInitial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 };
  const fadeYExit = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: -6 };
  const fadeInitial = reduceMotion ? { opacity: 1 } : { opacity: 0 };
  const fadeExit = reduceMotion ? { opacity: 1 } : { opacity: 0 };

  return (
    <div className="w-full rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-[0_28px_64px_-18px_rgba(15,23,42,0.14)] transition-shadow duration-300 sm:p-10 lg:p-11 xl:p-12 xl:shadow-[0_32px_72px_-20px_rgba(15,23,42,0.16)]">
      <header className="mb-8 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">Mathi Enterprises</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={fadeYInitial}
            animate={{ opacity: 1, y: 0 }}
            exit={fadeYExit}
            transition={headerTransition}
          >
            <h1 className="mt-3 text-balance text-[1.625rem] font-semibold leading-[1.15] tracking-tight text-slate-900 sm:text-[1.75rem]">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mx-auto mt-2 max-w-[32ch] text-pretty text-sm leading-relaxed text-slate-500">
              {mode === "login"
                ? "Sign in to browse the catalog and continue where you left off."
                : "A quick setup—then you can shop and manage your details."}
            </p>
          </motion.div>
        </AnimatePresence>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-1 rounded-2xl bg-slate-100/90 p-1">
        <button
          type="button"
          onClick={() => {
            setMode("login");
            setError(null);
            setResendFeedback(null);
          }}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-[0.65rem] border-0 py-2.5 text-sm font-semibold tracking-tight transition-all duration-200",
            mode === "login"
              ? "bg-white text-slate-900 shadow-sm shadow-slate-900/[0.06]"
              : "bg-transparent text-slate-500 hover:bg-white/50 hover:text-slate-800"
          )}
        >
          <LogIn className="h-[17px] w-[17px] shrink-0" strokeWidth={1.65} aria-hidden />
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setResendFeedback(null);
          }}
          className={cn(
            "flex cursor-pointer items-center justify-center gap-2 rounded-[0.65rem] border-0 py-2.5 text-sm font-semibold tracking-tight transition-all duration-200",
            mode === "signup"
              ? "bg-white text-slate-900 shadow-sm shadow-slate-900/[0.06]"
              : "bg-transparent text-slate-500 hover:bg-white/50 hover:text-slate-800"
          )}
        >
          <SignUpToggleIcon className="h-[17px] w-[17px] shrink-0" />
          Sign Up
        </button>
      </div>

      <div className="space-y-4">
        {configBanner}
        {oauthBanner}
        {info ? (
          <div className="space-y-3">
            <p className="rounded-xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm leading-relaxed text-emerald-950">
              {info}
            </p>
            {awaitingEmailConfirm ? (
              <button
                type="button"
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 shadow-sm shadow-slate-900/[0.04] transition hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-40"
                disabled={resendPending || !email.trim()}
                onClick={onResendConfirmation}
              >
                {resendPending ? "Sending…" : "Resend confirmation email"}
              </button>
            ) : null}
            {resendFeedback ? (
              <p className="text-sm leading-relaxed text-slate-600" role="status">
                {resendFeedback}
              </p>
            ) : null}
          </div>
        ) : resendFeedback ? (
          <p
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-center text-sm leading-relaxed text-slate-700"
            role="status"
          >
            {resendFeedback}
          </p>
        ) : null}
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {mode === "signup" ? (
            <motion.div
              key="signup"
              className="space-y-6"
              initial={fadeYInitial}
              animate={{ opacity: 1, y: 0 }}
              exit={fadeYExit}
              transition={mainTransition}
            >
              <button type="button" className={googleButtonClass} disabled={pending} onClick={oauthGoogle}>
                <GoogleIcon className="h-5 w-5 shrink-0" />
                Continue with Google
              </button>
              <OrDivider />
              <form onSubmit={onSignup} className="space-y-5">
                <div>
                  <label htmlFor="signup-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={inputFieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className={labelClass}>
                    Password
                  </label>
                  <div className={passwordShellClass}>
                    <input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      className={passwordInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className={passwordEyeClass}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <OpenEyeIcon className="h-[22px] w-[22px]" />
                      ) : (
                        <ClosedEyeIcon className="h-[22px] w-[22px]" />
                      )}
                    </button>
                  </div>
                </div>
                {error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">{error}</p>
                ) : null}
                <button type="submit" disabled={pending} className={primaryButtonClass}>
                  {pending ? "Creating account…" : "Create account"}
                </button>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-slate-50/80 px-3 py-3 text-xs leading-relaxed text-slate-600 ring-1 ring-slate-200/80 transition hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={marketingOptIn}
                    onChange={(ev) => setMarketingOptIn(ev.target.checked)}
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 focus:ring-2",
                      accentRingCheckbox
                    )}
                  />
                  <span>Email me product updates, offers, and news (optional).</span>
                </label>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              className="space-y-6"
              initial={fadeYInitial}
              animate={{ opacity: 1, y: 0 }}
              exit={fadeYExit}
              transition={mainTransition}
            >
              <form onSubmit={onLogin} className="space-y-5">
                <div>
                  <label htmlFor="auth-email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="auth-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(ev) => setEmail(ev.target.value)}
                    className={inputFieldClass}
                  />
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <label htmlFor="auth-password" className={cn(labelClass, "mb-0")}>
                      Password
                    </label>
                    <Link
                      href="/login/forgot"
                      className="text-xs font-semibold text-[#0071e3] transition hover:text-[#0077ed]"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className={passwordShellClass}>
                    <input
                      id="auth-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(ev) => setPassword(ev.target.value)}
                      className={passwordInputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className={passwordEyeClass}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <OpenEyeIcon className="h-[22px] w-[22px]" />
                      ) : (
                        <ClosedEyeIcon className="h-[22px] w-[22px]" />
                      )}
                    </button>
                  </div>
                </div>
                {error ? (
                  <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 ring-1 ring-red-100">{error}</p>
                ) : null}
                <button type="submit" disabled={pending} className={primaryButtonClass}>
                  {pending ? "Signing in…" : "Sign in"}
                </button>
                <p className="text-center text-xs leading-relaxed text-slate-500">
                  Waiting on a signup link?{" "}
                  <button
                    type="button"
                    className={footerModeButtonClass}
                    disabled={resendPending || !email.trim()}
                    onClick={onResendConfirmation}
                  >
                    Resend confirmation email
                  </button>
                </p>
              </form>
              <OrDivider />
              <button type="button" className={googleButtonClass} disabled={pending} onClick={oauthGoogle}>
                <GoogleIcon className="h-5 w-5 shrink-0" />
                Continue with Google
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-10 border-t border-slate-100 pt-8 text-center text-sm text-slate-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={fadeInitial}
            animate={{ opacity: 1 }}
            exit={fadeExit}
            transition={footerTransition}
            className="text-center text-sm text-slate-500"
          >
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setResendFeedback(null);
                  }}
                  className={footerModeButtonClass}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setResendFeedback(null);
                  }}
                  className={footerModeButtonClass}
                >
                  Sign in
                </button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
