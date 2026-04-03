import type { Metadata } from "next";
import Link from "next/link";
import ProductLineup from "@/components/catalog/ProductLineup";
import { cementProductsFrom } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Cement",
  description:
    "Explore bagged cement brands from Mathi Enterprises — OPC, PPC, Coromandel, Ramco, and Dalmia in Chennai.",
};

export default async function CementPage() {
  const merged = await getMergedProducts();
  const items = cementProductsFrom(merged);

  return (
    <div className="page-container">
      <h1 className="pageTitle">Cement</h1>
      <p className="pageLead mb-8 md:mb-10">
        Bagged OPC, PPC, and specialty cement — swipe or scroll to compare brands and types.
      </p>
      <ProductLineup
        products={items}
        headingId="cement-lineup-heading"
        scrollListAriaLabel="Cement product cards, scroll horizontally"
      />
      <p className="mt-10 text-sm text-neutral-600 md:mt-14">
        Prefer the full catalog?{" "}
        <Link href="/shop" className="font-medium text-[#0027eb] underline-offset-2 hover:underline">
          Browse the shop
        </Link>
        .
      </p>
    </div>
  );
}
