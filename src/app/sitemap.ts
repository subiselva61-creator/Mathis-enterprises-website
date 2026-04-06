import type { MetadataRoute } from "next";
import { staticProductSlugs } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";
import { siteUrl } from "@/lib/site";

const STATIC_PATHS = [
  "/",
  "/shop",
  "/contact",
  "/cement",
  "/bricks",
  "/sand",
  "/aggregates",
  "/service-areas",
] as const;

/**
 * Merged catalog can throw or time out in production (Supabase, cold start, etc.).
 * Google must always receive 200 + valid XML from /sitemap.xml, so we fall back
 * to static slugs from the repo catalog when merge fails.
 */
async function productSlugsForSitemap(): Promise<string[]> {
  try {
    const products = await getMergedProducts();
    return products.map((p) => p.slug);
  } catch (err) {
    console.error("[sitemap] getMergedProducts failed, using staticProductSlugs:", err);
    return staticProductSlugs;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const slugs = await productSlugsForSitemap();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "weekly",
    priority: path === "/" ? 1 : 0.85,
  }));

  const productEntries: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/shop/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
