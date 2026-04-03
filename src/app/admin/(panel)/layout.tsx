import Link from "next/link";
import { signOutAdmin } from "../actions";

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="text-sm font-semibold tracking-tight text-neutral-900">
            Catalog admin
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-[#0027eb] underline-offset-2 hover:underline">
              View site
            </Link>
            <form action={signOutAdmin}>
              <button type="submit" className="text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </>
  );
}
