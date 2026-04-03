import type { Product } from "./product-types";
import { buildingProducts } from "./catalog/building";
import { cementProducts } from "./catalog/cement";
import { constructionProducts } from "./catalog/construction";
import { newItemProducts } from "./catalog/new-items";
import { plotProducts } from "./catalog/plots";
import { realEstateServiceProducts } from "./catalog/real-estate-services";
import { tmtProducts } from "./catalog/tmt";

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
export const rawProducts: Product[] = mergeCatalog([
  constructionProducts,
  cementProducts,
  tmtProducts,
  buildingProducts,
  plotProducts,
  realEstateServiceProducts,
  newItemProducts,
]);

export { constructionProducts };
