import type { Product } from "./product-types";
import { applyIndiaMartPriceOverrides } from "./apply-indiamart-price-sync";
import { constructionProducts, rawProducts } from "./raw-products";

export type { Product, ProductSpec } from "./product-types";

export const products: Product[] = applyIndiaMartPriceOverrides(rawProducts);

/** Slugs from the static catalog (for SSG paths); same slugs as merged catalog. */
export const staticProductSlugs: string[] = rawProducts.map((p) => p.slug);

/** Clay / fly ash / concrete / interlock brick SKUs (not aggregates). */
export function isBrickProduct(p: Product): boolean {
  if (p.slug.toLowerCase().includes("brick")) return true;
  return p.tags.some((tag) => /\bbricks?\b/i.test(tag));
}

export function brickProductsFrom(list: Product[]): Product[] {
  return list.filter(isBrickProduct).sort((a, b) => a.name.localeCompare(b.name));
}

export function getBrickProducts(): Product[] {
  return brickProductsFrom(products);
}

/** River, M, P, filling, and packaged river sand SKUs (excludes bricks). */
export function isSandProduct(p: Product): boolean {
  if (isBrickProduct(p)) return false;
  const slug = p.slug.toLowerCase();
  if (slug.includes("sand")) return true;
  return p.tags.some((tag) => {
    const t = tag.toLowerCase();
    return (
      /\briver sand\b/.test(t) ||
      /\bm sand\b/.test(t) ||
      /\bmanufactured sand\b/.test(t) ||
      /\bfilling sand\b/.test(t) ||
      /\bp sand\b/.test(t)
    );
  });
}

export function sandProductsFrom(list: Product[]): Product[] {
  return list.filter(isSandProduct).sort((a, b) => a.name.localeCompare(b.name));
}

export function getSandProducts(): Product[] {
  return sandProductsFrom(products);
}

/** Coarse / crushed stone listings (sand tagged as “aggregate” is excluded via isSandProduct first). */
export function isAggregateProduct(p: Product): boolean {
  if (isBrickProduct(p) || isSandProduct(p)) return false;
  return p.tags.some((tag) => {
    const t = tag.toLowerCase();
    return /\baggregate\b/.test(t) || /\bgravel\b/.test(t) || /crushed stone/i.test(tag);
  });
}

export function aggregateProductsFrom(list: Product[]): Product[] {
  return list.filter(isAggregateProduct).sort((a, b) => a.name.localeCompare(b.name));
}

export function getAggregateProducts(): Product[] {
  return aggregateProductsFrom(products);
}

/** Bagged cement brands (not sand, not coarse aggregate). */
export function isCementBagProduct(p: Product): boolean {
  if (isBrickProduct(p) || isSandProduct(p) || isAggregateProduct(p)) return false;
  if (p.slug.toLowerCase().includes("cement")) return true;
  return p.category === "Cement";
}

export function cementProductsFrom(list: Product[]): Product[] {
  return list.filter(isCementBagProduct).sort((a, b) => a.name.localeCompare(b.name));
}

export function getCementProducts(): Product[] {
  return cementProductsFrom(products);
}

export const categories = ["All", "Construction Materials", "Cement"] as const;

export function getProductBySlugFrom(list: Product[], slug: string): Product | undefined {
  return list.find((p) => p.slug === slug);
}

export function getProductBySlug(slug: string): Product | undefined {
  return getProductBySlugFrom(products, slug);
}

export function getFeaturedProductsFrom(list: Product[]): Product[] {
  const slugs = constructionProducts.slice(0, 4).map((p) => p.slug);
  return slugs.map((slug) => getProductBySlugFrom(list, slug)).filter((p): p is Product => p != null);
}

export function getFeaturedProducts(): Product[] {
  return getFeaturedProductsFrom(products);
}
