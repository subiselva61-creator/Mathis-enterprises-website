import type { Metadata } from "next";
import { ContactPageClient } from "./ContactPageClient";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call +91 7845583158 or reach Mathi Enterprises for construction material quotes — Chennai, Tamil Nadu. GST 33ACPPV8797A2ZX.",
};

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
