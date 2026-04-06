"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatProductPrice } from "@/lib/format";
import { productPhotoAlt } from "@/lib/site";
import styles from "./ProductCard.module.css";

const M20_READY_MIX_SLUG = "m-20-construction-ready-mix-concrete";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const img = product.images[0];
  const isM20ReadyMix = product.slug === M20_READY_MIX_SLUG;

  const image = (
    <Image
      src={img}
      alt={productPhotoAlt(product, "card")}
      fill
      className={styles.image}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  );

  return (
    <article className={styles.card}>
      <Link href={`/shop/${product.slug}`} className={styles.link}>
        <div className={styles.imageWrap}>
          <div className={styles.imagePad}>
            {isM20ReadyMix ? (
              <div className={styles.imageClipM20}>{image}</div>
            ) : (
              image
            )}
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
