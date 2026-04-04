import Link from "next/link";
import AuthCard from "./AuthCard";

type Props = {
  searchParams?: Promise<{
    mode?: string;
    error?: string;
    reason?: string;
    registered?: string;
    next?: string;
  }>;
};

function safePostAuthPath(next: string | undefined): string | undefined {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
    return undefined;
  }
  return next;
}

export default async function LoginPage({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : {};
  const initialMode = sp.mode === "signup" ? "signup" : "login";
  const postAuthPath = safePostAuthPath(sp.next);

  return (
    <div className="relative flex min-h-[calc(100dvh-var(--site-header-height))] flex-col items-center justify-center overflow-hidden px-4 py-12 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-50 via-zinc-50/90 to-slate-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(0,113,227,0.14),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(99,102,241,0.06),transparent_45%)]"
        aria-hidden
      />

      <div className="relative z-[1] w-full max-w-[440px]">
        <AuthCard
          initialMode={initialMode}
          urlError={sp.error}
          oauthErrorDetail={sp.reason}
          registered={sp.registered === "1"}
          postAuthPath={postAuthPath}
        />
        <p className="mt-10 text-center text-sm text-slate-500">
          <Link
            href="/"
            className="font-medium text-[#0071e3] transition hover:text-[#0077ed] hover:underline hover:underline-offset-4"
          >
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
