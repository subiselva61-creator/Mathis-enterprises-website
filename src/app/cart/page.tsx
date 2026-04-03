import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { getMergedProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your bag and proceed to cash-on-delivery checkout.",
};

export default async function CartPage() {
  const products = await getMergedProducts();
  return (
    <div className="page-container">
      <h1 className="pageTitle">Cart</h1>
      <p className="pageLead">Update quantities or remove items. Subtotals are indicative; confirm the final quote at checkout and with our team.</p>
      <CartView products={products} />
    </div>
  );
}
