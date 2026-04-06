import type { Metadata } from "next";
import Link from "next/link";
import ProductLineup from "@/components/catalog/ProductLineup";
import CategoryBulkBenefits from "@/components/seo/CategoryBulkBenefits";
import { cementProductsFrom } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { BUSINESS_NAME, PRIMARY_CITY } from "@/lib/site";

const title = `Bulk cement supplier in ${PRIMARY_CITY} | ${BUSINESS_NAME}`;
const description = `Wholesale OPC, PPC, and bagged cement brands from ${BUSINESS_NAME} in ${PRIMARY_CITY} — Coromandel, Ramco, Dalmia, and more. Industrial-grade bulk distribution; confirm MOQ and latest rates before dispatch.`;

export const metadata: Metadata = marketingPageMetadata({
  title,
  description,
  path: "/cement",
  keywords: ["bulk cement Chennai", "OPC PPC wholesale", "cement bags supplier"],
});

export default async function CementPage() {
  const merged = await getMergedProducts();
  const items = cementProductsFrom(merged);

  return (
    <div className="page-container">
      <h1 className="pageTitle">Cement</h1>
      <p className="pageLead mb-8 md:mb-10">
        Bagged OPC, PPC, and specialty cement — swipe or scroll to compare brands and types.
      </p>
      <CategoryBulkBenefits materialLabel="cement" />
      <ProductLineup
        products={items}
        headingId="cement-lineup-heading"
        scrollListAriaLabel="Cement product cards, scroll horizontally"
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
