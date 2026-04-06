import type { Metadata } from "next";
import ServiceAreasContent from "@/components/seo/ServiceAreasContent";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { BUSINESS_NAME, PRIMARY_CITY, PRIMARY_REGION } from "@/lib/site";

const title = `Construction material supply areas — ${PRIMARY_CITY} & ${PRIMARY_REGION} | ${BUSINESS_NAME}`;
const description = `Service areas for bulk cement, steel, bricks, sand, and aggregates near ${PRIMARY_CITY}. Wholesale building materials supplier covering Chennai metro, OMR–ECR, Tambaram, and Chengalpattur–Sriperumbudur corridors.`;

export const metadata: Metadata = marketingPageMetadata({
  title,
  description,
  path: "/service-areas",
  keywords: [
    "building materials near me Chennai",
    "bulk cement supplier Chennai",
    "construction materials wholesale Tamil Nadu",
    "sand supplier Chennai",
  ],
});

export default function ServiceAreasPage() {
  return (
    <div className="page-container">
      <h1 className="pageTitle">Service areas</h1>
      <p className="pageLead mb-2 [text-wrap:pretty]">
        Bulk building materials and wholesale construction supply focused on {PRIMARY_CITY}, with haulage aligned to your
        site location across {PRIMARY_REGION}.
      </p>
      <ServiceAreasContent />
    </div>
  );
}
