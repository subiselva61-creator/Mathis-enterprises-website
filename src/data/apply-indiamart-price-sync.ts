import type { Product } from "./product-types";
import type { IndiaMartPriceFile } from "./indiamart-price-file";
import overridesFile from "./generated/indiamart-prices.json";

const overrides = overridesFile as IndiaMartPriceFile;

function normUnit(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Apply synced IndiaMART prices when `syncedAt` is set and an entry exists for the product. */
export function applyIndiaMartPriceOverrides(source: Product[]): Product[] {
  const entries = overrides.entries ?? {};
  if (overrides.syncedAt == null || Object.keys(entries).length === 0) {
    return source;
  }

  return source.map((p) => {
    if (p.priceOnRequest) return p;
    const o = entries[p.id];
    if (!o) return p;
    const imBasis = o.priceBasis?.trim();
    const catalogBasis = p.priceBasis?.trim();
    const basisMismatch =
      Boolean(catalogBasis && imBasis && normUnit(catalogBasis) !== normUnit(imBasis));
    return {
      ...p,
      price: o.price,
      // Keep catalog unit when it disagrees with IndiaMART (listing metadata can be wrong).
      priceBasis: basisMismatch ? p.priceBasis : imBasis || p.priceBasis,
    };
  });
}
