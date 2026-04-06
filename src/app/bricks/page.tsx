import type { Metadata } from "next";
import Link from "next/link";
import BricksLineup from "@/components/bricks/BricksLineup";
import CategoryBulkBenefits from "@/components/seo/CategoryBulkBenefits";
import { brickProductsFrom } from "@/data/products";
import { getMergedProducts } from "@/lib/catalog";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { BUSINESS_NAME, PRIMARY_CITY } from "@/lib/site";

const title = `Bulk bricks supplier in ${PRIMARY_CITY} | ${BUSINESS_NAME}`;
const description = `Wholesale clay, fly ash, wire cut, concrete, and interlock bricks from ${BUSINESS_NAME} in ${PRIMARY_CITY}. Bulk construction procurement — confirm grades and MOQ on IndiaMART or by phone.`;

export const metadata: Metadata = marketingPageMetadata({
  title,
  description,
  path: "/bricks",
  keywords: ["bulk bricks Chennai", "fly ash bricks wholesale", "wire cut bricks supplier"],
});

export default async function BricksPage() {
  const merged = await getMergedProducts();
  const bricks = brickProductsFrom(merged);

  return (
    <div className="page-container">
      <h1 className="pageTitle">Bricks</h1>
      <p className="pageLead mb-8 md:mb-10">
        Clay, fly ash, wire cut, concrete, and interlock bricks — swipe or scroll to compare models.
      </p>
      <CategoryBulkBenefits materialLabel="bricks" />
      <BricksLineup products={bricks} lineupHeadingLevel="h3" />
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
