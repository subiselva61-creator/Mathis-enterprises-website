import Link from "next/link";
import { BUSINESS_NAME, PRIMARY_CITY, PRIMARY_REGION } from "@/lib/site";

export default function ServiceAreasContent() {
  return (
    <div className="prose prose-neutral max-w-none">
      <p className="pageLead not-prose mb-8 text-[17px] leading-relaxed text-[#424245] md:mb-10 [text-wrap:pretty]">
        {BUSINESS_NAME} supports construction procurement and wholesale distribution for sites across {PRIMARY_CITY} and
        nearby industrial belts. When teams search for bulk building materials &ldquo;near me,&rdquo; we route project
        supply chain enquiries through IndiaMART and phone so MOQ, freight, and timelines stay accurate.
      </p>

      <h2 className="not-prose mt-10 text-[22px] font-semibold tracking-tight text-[#1d1d1f] md:text-[26px]">
        {PRIMARY_CITY} city &amp; core corridors
      </h2>
      <p className="text-[15px] leading-relaxed text-neutral-700 md:text-base">
        We regularly supply industrial-grade aggregates, river and M-sand, bagged cement, wire-cut and fly ash bricks, and
        related SKUs to builders working in Ambattur, Avadi, Porur, Guindy, Velachery, Tambaram, Chromepet, Pallavaram,
        and the OMR–ECR construction corridor. IS-certified products are supplied where the listing explicitly states
        certification — always confirm grade on your purchase order.
      </p>

      <h2 className="not-prose mt-10 text-[22px] font-semibold tracking-tight text-[#1d1d1f] md:text-[26px]">
        Chengalpattu &amp; Kanchipuram districts
      </h2>
      <p className="text-[15px] leading-relaxed text-neutral-700 md:text-base">
        Project sites from Maraimalai Nagar to Sriperumbudur and Oragadam often need consistent coarse aggregate and bulk
        cement drops. Share your site pin and required tonnage so we can align haulage with your construction schedule.
      </p>

      <h2 className="not-prose mt-10 text-[22px] font-semibold tracking-tight text-[#1d1d1f] md:text-[26px]">
        {PRIMARY_REGION} &amp; beyond
      </h2>
      <p className="text-[15px] leading-relaxed text-neutral-700 md:text-base">
        For larger wholesale orders, we coordinate through our usual channels — IndiaMART quotes, phone confirmation, and
        catalog SKUs listed on this site. Freight economics may favour {PRIMARY_CITY}-metro deliveries; ask about
        destination-specific pricing.
      </p>

      <p className="not-prose mt-10 text-sm text-neutral-600">
        <Link href="/contact" className="font-medium text-[#0027eb] underline-offset-2 hover:underline">
          Contact {BUSINESS_NAME}
        </Link>{" "}
        or{" "}
        <Link href="/shop" className="font-medium text-[#0027eb] underline-offset-2 hover:underline">
          browse the catalog
        </Link>{" "}
        to short-list materials before you call.
      </p>
    </div>
  );
}
