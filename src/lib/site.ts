const DEFAULT_PRODUCTION_ORIGIN = "https://mathienterprises.com";

/** Trimmed public site URL — no trailing slash. */
export function siteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") return DEFAULT_PRODUCTION_ORIGIN;
  return "http://localhost:3000";
}

export const BUSINESS_NAME = "Mathi Enterprises";
export const PRIMARY_CITY = "Chennai";
export const PRIMARY_REGION = "Tamil Nadu";

export const DEFAULT_OG_DESCRIPTION =
  "Wholesale and bulk supplier of cement, TMT steel, bricks, sand, and aggregates in Chennai. Industrial-grade construction materials, IS-certified products where applicable, and project-scale procurement via Mathi Enterprises.";

/** Exists in /public — used as default Open Graph image. */
export const DEFAULT_OG_IMAGE_PATH = "/logo.png";

export function absoluteUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = siteUrl();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

type ProductNamed = { name: string };

export function productPhotoAlt(
  product: ProductNamed,
  variant: "hero" | "main" | "detail" | "card" | "thumb" | "related" = "main",
): string {
  const base = `Bulk ${product.name} — ${BUSINESS_NAME}, ${PRIMARY_CITY}`;
  switch (variant) {
    case "detail":
      return `${base} (detail)`;
    case "thumb":
      return `${base} (thumbnail)`;
    case "related":
      return `${base} (related)`;
    case "hero":
      return `${product.name} — wholesale ${PRIMARY_CITY} — ${BUSINESS_NAME}`;
    case "card":
    case "main":
    default:
      return base;
  }
}
