import type { Metadata } from "next";
import AppleHome from "@/components/home/AppleHome";
import { getMergedProducts } from "@/lib/catalog";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { BUSINESS_NAME, PRIMARY_CITY } from "@/lib/site";

const title = `Bulk building materials supplier in ${PRIMARY_CITY} | ${BUSINESS_NAME}`;
const description = `Wholesale cement, TMT steel, bricks, sand, aggregates, and AAC blocks in ${PRIMARY_CITY}. Industrial-grade construction materials, IS-certified products where listed, and bulk pricing via ${BUSINESS_NAME} — confirm MOQ and freight on IndiaMART or by phone.`;

export const metadata: Metadata = marketingPageMetadata({
  title,
  description,
  path: "/",
  keywords: [
    "bulk cement Chennai",
    "wholesale construction materials Chennai",
    "TMT steel supplier Chennai",
    "building materials wholesale",
    "construction procurement",
    "project supply chain Chennai",
  ],
});

export default async function HomePage() {
  const products = await getMergedProducts();
  return <AppleHome products={products} />;
}
