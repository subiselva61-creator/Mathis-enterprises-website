import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const base = siteUrl();
  const host = new URL(base).host;

  const publicAllow = { allow: "/" as const, disallow: ["/admin", "/auth/", "/cart", "/checkout", "/login", "/account"] };

  return {
    host,
    sitemap: `${base}/sitemap.xml`,
    rules: [
      { userAgent: "*", ...publicAllow },
      { userAgent: "GPTBot", ...publicAllow },
      { userAgent: "ChatGPT-User", ...publicAllow },
      { userAgent: "Google-Extended", ...publicAllow },
      { userAgent: "PerplexityBot", ...publicAllow },
      { userAgent: "ClaudeBot", ...publicAllow },
      { userAgent: "anthropic-ai", ...publicAllow },
    ],
  };
}
