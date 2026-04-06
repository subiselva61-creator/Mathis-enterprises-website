import { ADDRESS_LINES, GST_NUMBER, IM_URL, PHONE_TEL } from "@/app/contact/contact-constants";
import { BUSINESS_NAME, siteUrl } from "@/lib/site";

const IM_PROFILE = "https://www.indiamart.com/mathi-enterprises-tamilnadu/";

export default function LocalBusinessJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: BUSINESS_NAME,
    url: siteUrl(),
    telephone: PHONE_TEL,
    taxID: GST_NUMBER,
    address: {
      "@type": "PostalAddress",
      addressLocality: ADDRESS_LINES[0],
      addressRegion: ADDRESS_LINES[1],
      addressCountry: ADDRESS_LINES[2] === "India" ? "IN" : ADDRESS_LINES[2],
    },
    sameAs: [IM_PROFILE, IM_URL],
    priceRange: "$$",
    description:
      "Wholesale and bulk supplier of cement, steel, bricks, sand, and aggregates in Chennai and surrounding Tamil Nadu.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
