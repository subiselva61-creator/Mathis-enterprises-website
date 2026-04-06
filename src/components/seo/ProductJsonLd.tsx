import type { Product } from "@/data/product-types";
import { absoluteUrl, BUSINESS_NAME, PRIMARY_CITY } from "@/lib/site";

function productCanonicalPath(slug: string): string {
  return `/shop/${slug}`;
}

function offerBlock(product: Product, pageUrl: string) {
  if (!product.priceOnRequest) {
    return {
      "@type": "AggregateOffer" as const,
      priceCurrency: product.currency,
      lowPrice: String(product.price),
      highPrice: String(product.price),
      offerCount: 1,
      availability: "https://schema.org/InStock",
      url: pageUrl,
      seller: { "@type": "Organization" as const, name: BUSINESS_NAME },
    };
  }
  return {
    "@type": "Offer" as const,
    availability: "https://schema.org/InStock",
    url: pageUrl,
    name: `Bulk quote — ${PRIMARY_CITY}`,
    description: "Contact Mathi Enterprises or IndiaMART for MOQ, freight, and current bulk pricing.",
    seller: { "@type": "Organization" as const, name: BUSINESS_NAME },
  };
}

export default function ProductJsonLd({ product }: { product: Product }) {
  const pageUrl = absoluteUrl(productCanonicalPath(product.slug));
  const images = product.images.map((src) => absoluteUrl(src));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    category: product.category,
    image: images.length ? images : undefined,
    brand: { "@type": "Brand", name: BUSINESS_NAME },
    offers: offerBlock(product, pageUrl),
    url: pageUrl,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
