import type { Product } from "./product-types";
import { cementProducts } from "./catalog/cement";
import { constructionProducts } from "./catalog/construction";

function mergeCatalog(parts: Product[][]): Product[] {
  const out: Product[] = [];
  const slugs = new Set<string>();
  for (const part of parts) {
    for (const p of part) {
      if (slugs.has(p.slug)) {
        throw new Error(`Duplicate product slug: ${p.slug}`);
      }
      slugs.add(p.slug);
      out.push(p);
    }
  }
  return out;
}

/** Catalog before IndiaMART price overrides (used by sync script and merge layer). */
export const rawProducts: Product[] = mergeCatalog([constructionProducts, cementProducts]);

export { constructionProducts };
