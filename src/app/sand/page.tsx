import type { Metadata } from "next";
import Link from "next/link";
import ProductLineup from "@/components/catalog/ProductLineup";
import { sandProductsFrom } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sand",
  description:
    "Explore river sand, M-sand, P-sand, and filling sand from Mathi Enterprises for construction and plastering in Chennai.",
};

export default async function SandPage() {
  const merged = await getMergedProducts();
  const items = sandProductsFrom(merged);

  return (
    <div className="page-container">
      <h1 className="pageTitle">Sand</h1>
      <p className="pageLead mb-8 md:mb-10">
        River sand, M-sand, P-sand, and filling sand — swipe or scroll to compare products.
      </p>
      <ProductLineup
        products={items}
        headingId="sand-lineup-heading"
        scrollListAriaLabel="Sand product cards, scroll horizontally"
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
