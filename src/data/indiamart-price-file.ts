/**
 * Shape of `src/data/generated/indiamart-prices.json` (written by scripts/sync-indiamart-prices.ts).
 */
export type IndiaMartPriceEntry = {
  price: number;
  priceBasis: string;
  indiaMartProductId: string;
};

export type IndiaMartPriceFile = {
  syncedAt: string | null;
  source: string;
  entries: Record<string, IndiaMartPriceEntry>;
  skipped: { productId: string; reason: string }[];
  errors: { productId: string; message: string }[];
};
