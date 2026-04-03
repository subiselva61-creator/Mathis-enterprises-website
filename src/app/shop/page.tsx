import type { Metadata } from "next";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { getMergedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Browse construction materials, cement, TMT bars, and plots from Mathi Enterprises, Chennai — filter by category or search by name.",
};

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
