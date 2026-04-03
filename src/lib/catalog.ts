import { unstable_cache } from "next/cache";
import { loadMergedProductsUncached } from "@/lib/catalog-merge";
import type { Product } from "@/data/product-types";

export const getMergedProducts = unstable_cache(
  async () => loadMergedProductsUncached(),
  ["merged-catalog-v1"],
  { tags: ["catalog"] },
);

export async function getMergedProductBySlug(slug: string): Promise<Product | undefined> {
  const list = await getMergedProducts();
  return list.find((p) => p.slug === slug);
}
