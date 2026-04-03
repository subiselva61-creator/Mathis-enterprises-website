import Link from "next/link";
import ForgotPasswordForm from "./ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div
      className="flex min-h-[calc(100dvh-var(--site-header-height))] flex-col items-center justify-center px-4 py-10"
      style={{
        backgroundColor: "#f4f4f5",
        backgroundImage: `
          linear-gradient(to right, rgb(229 229 229 / 0.9) 1px, transparent 1px),
          linear-gradient(to bottom, rgb(229 229 229 / 0.9) 1px, transparent 1px)
        `,
        backgroundSize: "28px 28px",
      }}
    >
      <div className="w-full max-w-[420px] rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm">
        <h1 className="text-lg font-semibold tracking-tight text-neutral-900">Reset password</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Enter your email and we&apos;ll send you a link to choose a new password.
        </p>
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>
        <p className="mt-8 text-center text-sm text-neutral-500">
          <Link href="/login" className="text-[#0027eb] underline-offset-2 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
