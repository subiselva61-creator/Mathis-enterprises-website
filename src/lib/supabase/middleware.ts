import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "./public-env";

function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
}

export async function updateSession(request: NextRequest) {
  const url = getSupabaseUrl();
  const anon = getSupabasePublishableKey();

  if (!url || !anon) {
    if (isAdminPath(request.nextUrl.pathname)) {
      return NextResponse.redirect(new URL("/admin/login?error=config", request.url));
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (isAdminPath(request.nextUrl.pathname)) {
    if (!user?.email) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    const allowed = parseAdminEmails().includes(user.email.toLowerCase());
    if (!allowed) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/admin/login?error=forbidden", request.url));
    }
  }

  return supabaseResponse;
}
