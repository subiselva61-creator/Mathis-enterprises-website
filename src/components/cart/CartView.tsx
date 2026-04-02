"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/components/cart/cart-context";
import { RippleButton, RippleButtonRipples } from "@/components/ui";
import styles from "./CartView.module.css";

type Props = { products: Product[] };

export default function CartView({ products }: Props) {
  const { lines, setQuantity, removeItem, subtotalCents, isReady } = useCart();
  const byId = new Map(products.map((p) => [p.id, p]));

  if (!isReady) {
    return <p className={styles.loading}>Loading cart…</p>;
  }

  if (lines.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>Your cart is empty</p>
        <p className={styles.emptyText}>Browse the shop and add items — they will stay here on this device.</p>
        <Link href="/shop" className={styles.shopLink}>
          Continue shopping
        </Link>
      </div>
    );
  }

  const subtotal = subtotalCents / 100;
  const currency = products[0]?.currency ?? "USD";

  return (
    <div className={styles.layout}>
      <ul className={styles.list}>
        {lines.map((line) => {
          const product = byId.get(line.productId);
          if (!product) return null;
          const img = product.images[0];
          return (
            <li key={line.productId} className={styles.row}>
              <Link href={`/shop/${product.slug}`} className={styles.thumbLink}>
                <div className={styles.thumb}>
                  <Image
                    src={img}
                    alt={`${product.name} — product photo`}
                    fill
                    className={styles.thumbImg}
                    sizes="96px"
                  />
                </div>
              </Link>
              <div className={styles.info}>
                <Link href={`/shop/${product.slug}`} className={styles.name}>
                  {product.name}
                </Link>
                <p className={styles.unit}>{formatPrice(product.price, product.currency)} each</p>
                <label className={styles.qtyLabel}>
                  <span className={styles.visuallyHidden}>Quantity for {product.name}</span>
                  <div className={styles.stepper}>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      aria-label={`Decrease ${product.name} quantity`}
                      onClick={() => setQuantity(line.productId, line.quantity - 1)}
                    >
                      −
                    </button>
                    <span className={styles.qtyValue} aria-hidden>
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      className={styles.stepBtn}
                      aria-label={`Increase ${product.name} quantity`}
                      onClick={() => setQuantity(line.productId, line.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </label>
              </div>
              <div className={styles.lineTotal}>
                <p className={styles.linePrice}>{formatPrice(product.price * line.quantity, product.currency)}</p>
                <button type="button" className={styles.remove} onClick={() => removeItem(line.productId)}>
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <aside className={styles.summary} aria-labelledby="summary-heading">
        <h2 id="summary-heading" className={styles.summaryTitle}>
          Order summary
        </h2>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <p className={styles.checkoutNote}>
          Checkout and payments are not connected yet. When you are ready, this button can open Stripe Checkout or your
          preferred gateway.
        </p>
        <RippleButton type="button" variant="primary" className={styles.checkoutBtn} disabled>
          Proceed to checkout
          <RippleButtonRipples />
        </RippleButton>
        <Link href="/shop" className={styles.continue}>
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
