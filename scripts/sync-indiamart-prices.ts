/**
 * Fetches Mathi Enterprises IndiaMART listing pages and writes
 * src/data/generated/indiamart-prices.json with live prices keyed by catalog product id.
 *
 * Run: npm run sync:indiamart-prices
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { INDIAMART_BASE } from "../src/data/catalog/constants";
import type { IndiaMartPriceFile } from "../src/data/indiamart-price-file";
import { rawProducts } from "../src/data/raw-products";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "../src/data/generated/indiamart-prices.json");

const UA =
  "Mozilla/5.0 (compatible; MathiEnterprisesPriceSync/1.0; +https://www.indiamart.com/mathi-enterprises-tamilnadu)";

const FETCH_DELAY_MS = 1800;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function normUnit(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** Numeric listing id from `...html#2853093480162`. */
export function extractIndiaMartListingId(indiaMartUrl: string | undefined): string | null {
  if (!indiaMartUrl) return null;
  const m = indiaMartUrl.match(/#(\d+)\s*$/);
  return m ? m[1] : null;
}

function listingPageUrl(fullUrl: string): string | null {
  const hash = fullUrl.indexOf("#");
  const base = hash >= 0 ? fullUrl.slice(0, hash) : fullUrl;
  if (!base.startsWith(INDIAMART_BASE)) {
    return null;
  }
  return base;
}

function parsePriceFromHtml(html: string, listingId: string): { price: number; priceBasis: string } | null {
  const esc = listingId.replace(/\D/g, "");
  if (esc !== listingId) return null;

  const attrRe = new RegExp(
    `pDispId="${esc}"[\\s\\S]{0,800}?price="₹\\s*([\\d,]+(?:\\.\\d+)?)/([^"]+)"`,
    "i",
  );
  const am = attrRe.exec(html);
  if (am) {
    const price = Number.parseFloat(am[1].replace(/,/g, ""));
    if (!Number.isFinite(price)) return null;
    return { price, priceBasis: am[2].trim() };
  }

  const detailRe = new RegExp(
    `proddetail/[^"\\s]*-${esc}\\.html[\\s\\S]{0,8000}?` +
      `<span>₹\\s*([\\d,]+(?:\\.\\d+)?)<span[^>]*><span[^>]*>/</span>([^<]+)</span>`,
    "i",
  );
  const dm = detailRe.exec(html);
  if (dm) {
    const price = Number.parseFloat(dm[1].replace(/,/g, ""));
    if (!Number.isFinite(price)) return null;
    return { price, priceBasis: dm[2].trim() };
  }

  return null;
}

async function fetchListingHtml(pageUrl: string): Promise<string> {
  const res = await fetch(pageUrl, {
    headers: {
      "User-Agent": UA,
      Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-IN,en;q=0.9",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${pageUrl}`);
  }
  return res.text();
}

async function main(): Promise<void> {
  const skipped: IndiaMartPriceFile["skipped"] = [];
  const errors: IndiaMartPriceFile["errors"] = [];
  const unitMismatches: { productId: string; catalogBasis: string; indiaMartBasis: string }[] = [];
  const entries: IndiaMartPriceFile["entries"] = {};

  const pageToListingIds = new Map<string, Map<string, string>>();

  for (const p of rawProducts) {
    if (p.priceOnRequest) {
      skipped.push({ productId: p.id, reason: "priceOnRequest" });
      continue;
    }
    const listingId = extractIndiaMartListingId(p.indiaMartUrl);
    if (!listingId) {
      skipped.push({ productId: p.id, reason: "missing_or_invalid_indiamart_fragment" });
      continue;
    }
    const page = p.indiaMartUrl ? listingPageUrl(p.indiaMartUrl) : null;
    if (!page) {
      skipped.push({ productId: p.id, reason: "url_not_under_storefront_base" });
      continue;
    }
    if (!pageToListingIds.has(page)) {
      pageToListingIds.set(page, new Map());
    }
    pageToListingIds.get(page)!.set(listingId, p.id);
  }

  const pages = [...pageToListingIds.keys()].sort();

  for (let i = 0; i < pages.length; i++) {
    const pageUrl = pages[i]!;
    const idToProductId = pageToListingIds.get(pageUrl)!;
    let html: string;
    try {
      html = await fetchListingHtml(pageUrl);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      for (const listingId of idToProductId.keys()) {
        const productId = idToProductId.get(listingId)!;
        errors.push({ productId, message: `fetch_failed: ${msg}` });
      }
      if (i < pages.length - 1) await sleep(FETCH_DELAY_MS);
      continue;
    }

    for (const listingId of idToProductId.keys()) {
      const productId = idToProductId.get(listingId)!;
      const parsed = parsePriceFromHtml(html, listingId);
      if (!parsed) {
        errors.push({
          productId,
          message: `could_not_parse_price_for_listing_id_${listingId}`,
        });
        continue;
      }
      const catalogProduct = rawProducts.find((x) => x.id === productId);
      const cb = catalogProduct?.priceBasis?.trim();
      const ib = parsed.priceBasis.trim();
      if (cb && ib && normUnit(cb) !== normUnit(ib)) {
        unitMismatches.push({
          productId,
          catalogBasis: cb,
          indiaMartBasis: ib,
        });
      }
      entries[productId] = {
        price: parsed.price,
        priceBasis: parsed.priceBasis,
        indiaMartProductId: listingId,
      };
    }

    if (i < pages.length - 1) await sleep(FETCH_DELAY_MS);
  }

  const out: IndiaMartPriceFile = {
    syncedAt: new Date().toISOString(),
    source: INDIAMART_BASE,
    entries,
    skipped,
    errors,
  };

  writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`, "utf8");

  const ok = Object.keys(entries).length;
  const fail = errors.length;
  console.log(
    `IndiaMART sync: wrote ${OUT} — ${ok} prices updated, ${skipped.length} skipped, ${fail} errors`,
  );
  if (unitMismatches.length > 0) {
    console.warn(
      "Unit mismatches (site keeps catalog unit, IndiaMART price still applied):",
      JSON.stringify(unitMismatches, null, 2),
    );
  }
  if (fail > 0) {
    console.error("Errors:", JSON.stringify(errors, null, 2));
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
