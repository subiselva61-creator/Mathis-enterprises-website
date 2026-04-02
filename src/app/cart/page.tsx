import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review your cart — quantities sync on this device until checkout is enabled.",
};

export default function CartPage() {
  return (
    <>
      <h1 className="pageTitle">Cart</h1>
      <p className="pageLead">Update quantities or remove items. Subtotals reflect demo prices in USD.</p>
      <CartView products={products} />
    </>
  );
}
