"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ComponentProps } from "react";
import type { Product } from "@/data/products";
import ShinyText from "@/components/ShinyText";
import { useCart } from "@/components/cart/cart-context";
import Counter from "@/components/Counter";
import { RippleButton, RippleButtonRipples } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import "@/components/ui/RippleButton.css";
import styles from "./AddToCartSection.module.css";

type FreeSampleLinkProps = Pick<ComponentProps<typeof Link>, "href" | "className">;

/** How much of the control must be in the viewport before the one-shot shine runs. */
const FREE_SAMPLE_REVEAL_RATIO = 0.08;

function fractionVisibleInViewport(el: HTMLElement): number {
  const rect = el.getBoundingClientRect();
  if (rect.height <= 0) return 0;
  const vh = window.innerHeight;
  const visibleHeight = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
  return Math.max(0, visibleHeight) / rect.height;
}

function FreeSampleLink({ href, className }: FreeSampleLinkProps) {
  const reducedMotion = usePrefersReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  const reveal = () => setHasBeenVisible(true);

  useLayoutEffect(() => {
    if (reducedMotion || hasBeenVisible) return;
    const el = ref.current;
    if (!el) return;
    if (fractionVisibleInViewport(el) >= FREE_SAMPLE_REVEAL_RATIO) {
      reveal();
    }
  }, [reducedMotion, hasBeenVisible]);

  useEffect(() => {
    if (reducedMotion || hasBeenVisible) return;
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        const manual = fractionVisibleInViewport(el);
        const ratio = Math.max(entry.intersectionRatio, manual);
        if (ratio >= FREE_SAMPLE_REVEAL_RATIO) {
          reveal();
          obs.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.15, 0.2, 0.35, 0.5, 0.75, 1],
      }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [reducedMotion, hasBeenVisible]);

  const label =
    reducedMotion || !hasBeenVisible ? (
      "Free sample"
    ) : (
      <ShinyText
        text="Free sample"
        speed={1.35}
        once
        delay={0}
        color="#c8d6ff"
        shineColor="#ffffff"
        spread={95}
        direction="left"
        pauseOnHover={false}
        disabled={false}
        className={styles.freeSampleShiny}
      />
    );

  return (
    <Link ref={ref} href={href} className={className}>
      {label}
    </Link>
  );
}

type Props = { product: Product };

export default function AddToCartSection({ product }: Props) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [flash, setFlash] = useState(false);
  const [showGoToCart, setShowGoToCart] = useState(false);

  const handleAdd = () => {
    addItem(product, qty);
    setShowGoToCart(true);
    setFlash(true);
    window.setTimeout(() => setFlash(false), 1400);
  };

  const handleIncrementQty = () => {
    setShowGoToCart(false);
    setQty((q) => Math.min(99, q + 1));
  };

  const freeSampleHref = `/contact?product=${encodeURIComponent(product.slug)}&intent=free-sample`;

  if (product.priceOnRequest) {
    return (
      <div className={styles.wrap}>
        <p className={styles.quoteNote}>
          For pricing and availability, contact us on IndiaMART or call — this item is not sold through the demo cart.
        </p>
        {product.indiaMartUrl ? (
          <a href={product.indiaMartUrl} className={styles.quoteLink} target="_blank" rel="noopener noreferrer">
            Open on IndiaMART
          </a>
        ) : null}
        <FreeSampleLink
          href={freeSampleHref}
          className={`ripple-button ripple-button--variant-primary ${styles.freeSampleBtn}`}
        />
      </div>
    );
  }

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
          <div className={styles.counterSlot}>
            <span aria-hidden="true">
              <Counter
                value={qty}
                places={[10, 1]}
                fontSize={22}
                padding={4}
                gap={4}
                textColor="#171717"
                fontWeight={600}
                borderRadius={0}
                horizontalPadding={2}
                gradientFrom="#ffffff"
                gradientTo="transparent"
                gradientHeight={6}
                counterStyle={{ overflow: "hidden" }}
              />
            </span>
            <input
              id={`qty-${product.id}`}
              className={styles.srOnlyInput}
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
          </div>
          <button
            type="button"
            className={styles.stepBtn}
            aria-label="Increase quantity"
            onClick={handleIncrementQty}
          >
            +
          </button>
        </div>
      </div>
      {showGoToCart ? (
        <RippleButton
          type="button"
          variant="outline"
          className={styles.addBtn}
          aria-label="Go to shopping cart"
          onClick={() => router.push("/cart")}
        >
          Go to cart
          <RippleButtonRipples />
        </RippleButton>
      ) : (
        <RippleButton type="button" variant="outline" className={styles.addBtn} onClick={handleAdd}>
          Add to cart
          <RippleButtonRipples />
        </RippleButton>
      )}
      <FreeSampleLink
        href={freeSampleHref}
        className={`ripple-button ripple-button--variant-primary ${styles.freeSampleBtn}`}
      />
      <p className={flash ? styles.toastVisible : styles.toast} role="status" aria-live="polite">
        Added to cart
      </p>
    </div>
  );
}
