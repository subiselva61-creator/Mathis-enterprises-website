"use client";

import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useMemo, useRef } from "react";
import type { Product } from "@/data/products";
import { formatPrice, formatProductPrice } from "@/lib/format";
import { useCart } from "@/components/cart/cart-context";
import "@/components/ui/RippleButton.css";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { registerScrollTrigger, ScrollTrigger } from "@/lib/gsap/registerScrollTrigger";
import styles from "./CartView.module.css";

type Props = { products: Product[] };

export default function CartView({ products }: Props) {
  const reducedMotion = usePrefersReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const { lines, setQuantity, removeItem, subtotalCents, isReady } = useCart();
  const byId = new Map(products.map((p) => [p.id, p]));

  const linesKey = useMemo(
    () =>
      [...lines]
        .sort((a, b) => a.productId.localeCompare(b.productId))
        .map((l) => l.productId)
        .join(","),
    [lines],
  );

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const ul = listRef.current;
    if (!ul || lines.length === 0) return;
    registerScrollTrigger();
    const ctx = gsap.context(() => {
      ul.querySelectorAll<HTMLElement>("[data-scroll-cart-row]").forEach((el, i) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 24, x: -10 },
          {
            autoAlpha: 1,
            y: 0,
            x: 0,
            duration: 0.52,
            delay: i * 0.05,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
          },
        );
      });
    }, ul);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [linesKey, lines.length, reducedMotion]);

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
  const currency = products.find((p) => !p.priceOnRequest)?.currency ?? "INR";

  return (
    <div className={styles.layout}>
      <ul ref={listRef} className={styles.list}>
        {lines.map((line) => {
          const product = byId.get(line.productId);
          if (!product) return null;
          const img = product.images[0];
          return (
            <li key={line.productId} className={styles.row} data-scroll-cart-row>
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
                <p className={styles.unit}>
                  {formatProductPrice(product)}
                  {product.priceBasis ? ` / ${product.priceBasis.toLowerCase()}` : ""}
                </p>
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

      <aside className={styles.summary} aria-labelledby="summary-heading" data-scroll-cart-summary>
        <h2 id="summary-heading" className={styles.summaryTitle}>
          Order summary
        </h2>
        <div className={styles.summaryRow}>
          <span>Subtotal</span>
          <span>{formatPrice(subtotal, currency)}</span>
        </div>
        <p className={styles.checkoutNote}>
          Payment is cash on delivery. Confirm contact and delivery details on the next screens. Indicative subtotal only —
          final amount confirmed before dispatch.
        </p>
        <Link
          href="/checkout"
          className={`ripple-button ripple-button--variant-primary ${styles.checkoutBtn}`}
        >
          Proceed to checkout
        </Link>
        <Link href="/shop" className={styles.continue}>
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
