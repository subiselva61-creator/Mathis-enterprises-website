import type { MetadataRoute } from "next";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const products = await getMergedProducts();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "weekly",
    priority: path === "/" ? 1 : 0.85,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/shop/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...productEntries];
}
