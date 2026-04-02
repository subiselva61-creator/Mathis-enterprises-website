"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { GlassCard } from "@/components/ui";
import StarBorder from "@/components/ui/StarBorder";
import styles from "./ProductCard.module.css";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const img = product.images[0];
  return (
    <StarBorder as="div" className={styles.starWrap} color="#a78bfa" speed="5s" thickness={1}>
      <GlassCard
        className={styles.card}
        borderRadius={22}
        blur={18}
        borderSize={1}
        borderOpacity={0.25}
        backgroundOpacity={0.06}
        color="#f0eefc"
        onHoverScale={1.02}
        saturation={160}
        brightness={118}
      >
        <Link href={`/shop/${product.slug}`} className={styles.link}>
          <div className={styles.imageWrap}>
            <Image
              src={img}
              alt={`${product.name} — product photo`}
              fill
              className={styles.image}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
          <div className={styles.body}>
            <p className={styles.category}>{product.category}</p>
            <h2 className={styles.title}>{product.name}</h2>
            <p className={styles.price}>{formatPrice(product.price, product.currency)}</p>
          </div>
        </Link>
      </GlassCard>
    </StarBorder>
  );
}
