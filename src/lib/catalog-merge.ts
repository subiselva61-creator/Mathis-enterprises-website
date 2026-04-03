import type { Product } from "@/data/product-types";
import { applyIndiaMartPriceOverrides } from "@/data/apply-indiamart-price-sync";
import { rawProducts } from "@/data/raw-products";
import type { ProductOverrideRow } from "@/lib/supabase/types";
import { fetchProductOverrideRows } from "@/lib/supabase/service";

function overrideMap(rows: ProductOverrideRow[]): Map<string, ProductOverrideRow> {
  const m = new Map<string, ProductOverrideRow>();
  for (const r of rows) m.set(r.product_id, r);
  return m;
}

/**
 * Merge DB overrides on top of IndiaMART-adjusted catalog.
 * Precedence: skip_indiamart_price restores TS catalog price/basis; then explicit DB price; then description/images/priceOnRequest.
 */
export function applyDbOverrides(
  afterIndiaMart: Product[],
  rawList: Product[],
  rows: ProductOverrideRow[],
): Product[] {
  const rawById = new Map(rawList.map((p) => [p.id, p]));
  const oMap = overrideMap(rows);

  return afterIndiaMart.map((p) => {
    const o = oMap.get(p.id);
    if (!o) return p;

    let next: Product = { ...p };

    if (o.skip_indiamart_price) {
      const r = rawById.get(p.id);
      if (r) {
        next = { ...next, price: r.price, priceBasis: r.priceBasis };
      }
    }

    if (o.price != null && !Number.isNaN(Number(o.price))) {
      next = { ...next, price: Number(o.price) };
    }

    if (o.description != null && o.description.trim() !== "") {
      next = { ...next, description: o.description };
    }

    if (o.images != null && Array.isArray(o.images) && o.images.length > 0) {
      const urls = o.images.filter((u): u is string => typeof u === "string" && u.trim().length > 0);
      if (urls.length > 0) next = { ...next, images: urls };
    }

    if (o.price_on_request != null) {
      next = { ...next, priceOnRequest: o.price_on_request };
    }

    return next;
  });
}

export async function loadMergedProductsUncached(): Promise<Product[]> {
  const afterIm = applyIndiaMartPriceOverrides(rawProducts);
  const rows = await fetchProductOverrideRows();
  return applyDbOverrides(afterIm, rawProducts, rows);
}
