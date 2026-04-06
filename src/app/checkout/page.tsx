import type { Metadata } from "next";
import { getMergedProducts } from "@/lib/catalog";
import { noindexMetadata } from "@/lib/seo-metadata";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = noindexMetadata({
  title: "Checkout",
  description: "Complete your order with cash on delivery — contact and delivery details.",
});

export default async function CheckoutPage() {
  const products = await getMergedProducts();
  return (
    <div className="page-container">
      <h1 className="pageTitle">Checkout</h1>
      <p className="pageLead mb-8">
        Payment is cash on delivery only. We will contact you to confirm availability, freight, and the final amount before
        dispatch.
      </p>
      <CheckoutClient products={products} />
    </div>
  );
}
