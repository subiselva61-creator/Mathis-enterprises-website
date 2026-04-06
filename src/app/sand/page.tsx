import type { Metadata } from "next";
import Link from "next/link";
import ProductLineup from "@/components/catalog/ProductLineup";
import CategoryBulkBenefits from "@/components/seo/CategoryBulkBenefits";
import { sandProductsFrom } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { BUSINESS_NAME, PRIMARY_CITY } from "@/lib/site";

const title = `Bulk sand supplier in ${PRIMARY_CITY} | ${BUSINESS_NAME}`;
const description = `Wholesale river sand, M-sand, P-sand, and filling sand from ${BUSINESS_NAME} in ${PRIMARY_CITY} for construction and plastering. Project-scale bulk distribution — confirm freight and grade before delivery.`;

export const metadata: Metadata = marketingPageMetadata({
  title,
  description,
  path: "/sand",
  keywords: ["river sand bulk Chennai", "M sand wholesale", "construction sand supplier"],
});

export default async function SandPage() {
  const merged = await getMergedProducts();
  const items = sandProductsFrom(merged);

  return (
    <div className="page-container">
      <h1 className="pageTitle">Sand</h1>
      <p className="pageLead mb-8 md:mb-10">
        River sand, M-sand, P-sand, and filling sand — swipe or scroll to compare products.
      </p>
      <CategoryBulkBenefits materialLabel="sand" />
      <ProductLineup
        products={items}
        headingId="sand-lineup-heading"
        scrollListAriaLabel="Sand product cards, scroll horizontally"
        lineupHeadingLevel="h3"
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
