import Link from "next/link";
import LoginForm from "./LoginForm";

type Props = { searchParams?: Promise<{ error?: string }> };

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : {};
  const err = sp.error;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
      <h1 className="text-xl font-semibold tracking-tight text-neutral-900">Admin sign in</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Use the Supabase account for an email listed in <code className="rounded bg-neutral-200 px-1">ADMIN_EMAILS</code>.
      </p>
      {err === "config" ? (
        <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Supabase environment variables are missing. Set{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code className="rounded bg-amber-100 px-1">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in{" "}
          <code className="rounded bg-amber-100 px-1">.env.local</code>.
        </p>
      ) : null}
      {err === "forbidden" ? (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
          This account is not in the admin allowlist.
        </p>
      ) : null}
      <div className="mt-6">
        <LoginForm />
      </div>
      <p className="mt-8 text-center text-sm text-neutral-500">
        <Link href="/" className="text-[#0027eb] underline-offset-2 hover:underline">
          Back to site
        </Link>
      </p>
    </div>
  );
}
