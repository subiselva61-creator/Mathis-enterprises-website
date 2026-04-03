import type { Product } from "./product-types";
import { applyIndiaMartPriceOverrides } from "./apply-indiamart-price-sync";
import { constructionProducts, rawProducts } from "./raw-products";

export type { Product, ProductSpec } from "./product-types";

export const products: Product[] = applyIndiaMartPriceOverrides(rawProducts);

export const categories = [
  "All",
  "Construction Materials",
  "Cement",
  "TMT Bars",
  "Building Materials",
  "Plots & land",
  "Real estate services",
  "New items",
] as const;

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  const slugs = constructionProducts.slice(0, 4).map((p) => p.slug);
  return slugs.map((slug) => products.find((p) => p.slug === slug)!);
}
