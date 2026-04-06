import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";
import { GST_NUMBER, PHONE_DISPLAY } from "@/app/contact/contact-constants";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { BUSINESS_NAME, PRIMARY_CITY } from "@/lib/site";

const title = `Contact ${BUSINESS_NAME} — bulk quotes in ${PRIMARY_CITY}`;
const description = `Call ${PHONE_DISPLAY} for wholesale construction materials, bulk cement, steel, and aggregates in ${PRIMARY_CITY}. GST ${GST_NUMBER}. IndiaMART quotes and project supply chain support.`;

export const metadata: Metadata = marketingPageMetadata({
  title,
  description,
  path: "/contact",
  keywords: ["Mathi Enterprises contact", "bulk cement quote Chennai", "construction materials phone"],
});

export default function ContactPage() {
  return (
    <div className="page-container">
      <h1 className="pageTitle">Contact</h1>
      <p className="pageLead mb-8 [text-wrap:pretty] md:mb-10">
        For pricing, freight, and availability, reach us through our IndiaMART storefront or browse the catalog first and
        note the products you need.
      </p>

      <ContactPageClient />
    </div>
  );
}
