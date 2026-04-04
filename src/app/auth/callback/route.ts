import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/public-env";

/** Prefer proxy headers so redirects use the public host (e.g. Vercel). */
function getRequestOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const host =
    forwardedHost?.split(",")[0]?.trim() ||
    request.headers.get("host")?.split(",")[0]?.trim() ||
    request.nextUrl.host;
  const protoHeader = request.headers.get("x-forwarded-proto");
  let proto = protoHeader?.split(",")[0]?.trim();
  if (!proto) {
    proto = forwardedHost ? "https" : request.nextUrl.protocol.replace(":", "") || "https";
  }
  return `${proto}://${host}`;
}

/** Avoid open redirects: only allow same-origin paths. */
function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("://")) {
    return "/shop";
  }
  return raw;
}

function loginOauthFailRedirect(origin: string, detail?: string | null) {
  const u = new URL("/login", origin);
  u.searchParams.set("error", "oauth");
  if (detail?.trim()) {
    u.searchParams.set("reason", detail.trim().slice(0, 400));
  }
  return NextResponse.redirect(u);
}

export async function GET(request: NextRequest) {
  const url = getSupabaseUrl();
  const anon = getSupabasePublishableKey();
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"));
  const origin = getRequestOrigin(request);

  if (!url || !anon) {
    return NextResponse.redirect(new URL("/login?error=config", origin));
  }

  /** OAuth provider or Supabase returned an error instead of a code. */
  if (!code) {
    const providerErr =
      searchParams.get("error_description")?.trim() || searchParams.get("error")?.trim() || null;
    if (providerErr) {
      return loginOauthFailRedirect(origin, providerErr);
    }
    return loginOauthFailRedirect(origin);
  }

  const redirectUrl = new URL(next, origin);
  const response = NextResponse.redirect(redirectUrl);

  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (!error) {
    return response;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn("[auth/callback] exchangeCodeForSession failed:", error.message);
  }

  return loginOauthFailRedirect(origin, error.message);
}
