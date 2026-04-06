import type { Metadata } from "next";
import Link from "next/link";
import ProductLineup from "@/components/catalog/ProductLineup";
import CategoryBulkBenefits from "@/components/seo/CategoryBulkBenefits";
import { aggregateProductsFrom } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { BUSINESS_NAME, PRIMARY_CITY } from "@/lib/site";

const title = `Bulk aggregates supplier in ${PRIMARY_CITY} | ${BUSINESS_NAME}`;
const description = `Wholesale coarse aggregates and crushed stone from ${BUSINESS_NAME} in ${PRIMARY_CITY} — 6 mm to 40 mm and gravel for concrete and civil works. Industrial-grade bulk supply; verify specifications on your order.`;

export const metadata: Metadata = marketingPageMetadata({
  title,
  description,
  path: "/aggregates",
  keywords: ["bulk aggregates Chennai", "crushed stone wholesale", "coarse aggregate supplier"],
});

export default async function AggregatesPage() {
  const merged = await getMergedProducts();
  const items = aggregateProductsFrom(merged);

  return (
    <div className="page-container">
      <h1 className="pageTitle">Aggregates</h1>
      <p className="pageLead mb-8 md:mb-10">
        Coarse aggregates and crushed stone — swipe or scroll to compare sizes and grades.
      </p>
      <CategoryBulkBenefits materialLabel="aggregates" />
      <ProductLineup
        products={items}
        headingId="aggregates-lineup-heading"
        scrollListAriaLabel="Aggregate product cards, scroll horizontally"
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
