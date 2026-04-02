import type { Metadata } from "next";
import ShopExplorer from "@/components/shop/ShopExplorer";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse the Mathis Enterprises catalog — search, filter by category, and sort by price or name.",
};

export default function ShopPage() {
  return (
    <>
      <h1 className="pageTitle">Shop</h1>
      <p className="pageLead">
        Explore the full collection. Use search and filters to narrow down — your selections stay in your cart on this
        device.
      </p>
      <ShopExplorer products={products} />
    </>
  );
}
