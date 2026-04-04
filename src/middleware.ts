import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

/**
 * Refresh the Supabase session on navigations (not only /admin).
 * Storefront auth (PKCE / cookies) is unreliable if middleware never runs outside admin.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
