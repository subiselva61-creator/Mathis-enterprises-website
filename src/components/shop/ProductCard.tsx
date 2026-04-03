"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatProductPrice } from "@/lib/format";
import styles from "./ProductCard.module.css";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const img = product.images[0];
  return (
    <article className={styles.card}>
      <Link href={`/shop/${product.slug}`} className={styles.link}>
        <div className={styles.imageWrap}>
          <div className={styles.imagePad}>
            <Image
              src={img}
              alt={`${product.name} — product photo`}
              fill
              className={styles.image}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          </div>
        </div>
        <div className={styles.body}>
          <p className={styles.category}>{product.category}</p>
          <h2 className={styles.title}>{product.name}</h2>
          <p className={styles.price}>
            {formatProductPrice(product)}
            {product.priceOnRequest || !product.priceBasis
              ? ""
              : ` / ${product.priceBasis.toLowerCase()}`}
          </p>
        </div>
      </Link>
    </article>
  );
}
