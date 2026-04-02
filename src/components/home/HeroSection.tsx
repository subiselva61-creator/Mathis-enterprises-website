"use client";

import Link from "next/link";
import { GlassSurface, GradientText } from "@/components/ui";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className={styles.section} aria-labelledby="hero-heading">
      <div className={styles.grid}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Mathis Enterprises</p>
          <h1 id="hero-heading" className={styles.heading}>
            <GradientText
              colors={["#a78bfa", "#818cf8", "#c084fc", "#e879f9"]}
              animationSpeed={10}
              showBorder
              reducedMotion={reducedMotion}
            >
              Modern essentials for work and life
            </GradientText>
          </h1>
          <p className={styles.sub}>
            Curated furniture, tech, and lifestyle pieces with a calm, premium feel. Browse the shop — your cart saves
            locally until checkout goes live.
          </p>
          <div className={styles.actions}>
            <Link href="/shop" className={styles.primaryCta}>
              Shop the collection
            </Link>
            <Link href="/cart" className={styles.secondaryCta}>
              View cart
            </Link>
          </div>
        </div>
        <GlassSurface
          className={`glass-surface--block ${styles.glass}`}
          width="100%"
          height={320}
          borderRadius={28}
          backgroundOpacity={0.12}
          brightness={52}
        >
          <div className={styles.glassInner}>
            <p className={styles.glassTitle}>New this season</p>
            <p className={styles.glassText}>
              Standing desks, quiet tech, and pieces that make your space feel intentional — without the clutter.
            </p>
            <ul className={styles.glassList}>
              <li>Free shipping on demo orders (coming soon)</li>
              <li>30-day returns when payments launch</li>
              <li>Designed for clarity, not noise</li>
            </ul>
          </div>
        </GlassSurface>
      </div>
    </section>
  );
}
