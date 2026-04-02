"use client";

import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/cart/cart-context";
import { RippleButton, RippleButtonRipples } from "@/components/ui";
import styles from "./AddToCartSection.module.css";

type Props = { product: Product };

export default function AddToCartSection({ product }: Props) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 1400);
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.qtyRow}>
        <label htmlFor={`qty-${product.id}`} className={styles.qtyLabel}>
          Quantity
        </label>
        <div className={styles.stepper}>
          <button
            type="button"
            className={styles.stepBtn}
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
          >
            −
          </button>
          <input
            id={`qty-${product.id}`}
            className={styles.qtyInput}
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10);
              if (Number.isNaN(n)) return;
              setQty(Math.min(99, Math.max(1, n)));
            }}
          />
          <button
            type="button"
            className={styles.stepBtn}
            aria-label="Increase quantity"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
          >
            +
          </button>
        </div>
      </div>
      <RippleButton type="button" variant="primary" className={styles.addBtn} onClick={handleAdd}>
        Add to cart
        <RippleButtonRipples />
      </RippleButton>
      <p className={flash ? styles.toastVisible : styles.toast} role="status" aria-live="polite">
        Added to cart
      </p>
    </div>
  );
}
