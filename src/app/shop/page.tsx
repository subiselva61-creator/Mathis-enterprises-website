import type { Metadata } from "next";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { getMergedProducts } from "@/lib/catalog";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { BUSINESS_NAME, PRIMARY_CITY } from "@/lib/site";

const title = `Bulk construction materials supplier in ${PRIMARY_CITY} | ${BUSINESS_NAME}`;
const description = `Browse wholesale cement, steel, bricks, sand, aggregates, and more from ${BUSINESS_NAME} in ${PRIMARY_CITY}. Filter by category or search — indicative IndiaMART-linked rates; confirm construction procurement details before you order.`;

export const metadata: Metadata = marketingPageMetadata({
  title,
  description,
  path: "/shop",
  keywords: ["construction materials catalog", "bulk supplier Chennai", "wholesale building materials shop"],
});

type Props = {
  searchParams?: Promise<{ cat?: string; q?: string }>;
};

export default async function ShopPage({ searchParams }: Props) {
  const sp = searchParams ? await searchParams : {};
  const cat = sp.cat;
  const q = sp.q;
  const products = await getMergedProducts();
  return (
    <div className="page-container">
      <h1 className="pageTitle">Shop</h1>
      <p className="pageLead">
        Construction materials, steel, cement, and land offerings from our IndiaMART-listed catalog. Prices are
        indicative — confirm MOQ and latest rates before you order. Your cart stays on this device only.
      </p>
      <ShopExplorer
        key={`${cat ?? "all"}-${q ?? ""}`}
        products={products}
        initialCategory={cat}
        initialQuery={q}
      />
    </div>
  );
}
