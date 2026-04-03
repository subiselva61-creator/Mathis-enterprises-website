import type { Metadata } from "next";
import Link from "next/link";
import ProductLineup from "@/components/catalog/ProductLineup";
import { aggregateProductsFrom } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Aggregates",
  description:
    "Explore coarse aggregates and crushed stone from Mathi Enterprises — 6 mm to 40 mm and gravel for concrete and civil works in Chennai.",
};

export default async function AggregatesPage() {
  const merged = await getMergedProducts();
  const items = aggregateProductsFrom(merged);

  return (
    <div className="page-container">
      <h1 className="pageTitle">Aggregates</h1>
      <p className="pageLead mb-8 md:mb-10">
        Coarse aggregates and crushed stone — swipe or scroll to compare sizes and grades.
      </p>
      <ProductLineup
        products={items}
        headingId="aggregates-lineup-heading"
        scrollListAriaLabel="Aggregate product cards, scroll horizontally"
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
