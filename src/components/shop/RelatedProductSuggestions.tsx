import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatProductPrice } from "@/lib/format";
import { productPhotoAlt } from "@/lib/site";
import styles from "./RelatedProductSuggestions.module.css";

const M20_READY_MIX_SLUG = "m-20-construction-ready-mix-concrete";

type Props = { products: Product[] };

export default function RelatedProductSuggestions({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <section className={styles.section} aria-labelledby="pdp-related-heading">
      <h2 id="pdp-related-heading" className={styles.title}>
        You might like these
      </h2>
      <ul className={styles.list}>
        {products.map((p) => {
          const img = p.images[0];
          const isM20ReadyMix = p.slug === M20_READY_MIX_SLUG;
          const price =
            p.priceOnRequest || !p.priceBasis
              ? formatProductPrice(p)
              : `${formatProductPrice(p)} / ${p.priceBasis.toLowerCase()}`;

          const image = img ? (
            <Image
              src={img}
              alt={productPhotoAlt(p, "related")}
              fill
              className={styles.image}
              sizes="64px"
            />
          ) : null;

          return (
            <li key={p.id}>
              <Link href={`/shop/${p.slug}`} className={styles.itemLink}>
                <div className={styles.thumb}>
                  {img ? (
                    <div className={styles.thumbPad}>
                      {isM20ReadyMix ? (
                        <div className={styles.imageClipM20}>{image}</div>
                      ) : (
                        image
                      )}
                    </div>
                  ) : null}
                </div>
                <div className={styles.meta}>
                  <span className={styles.name}>{p.name}</span>
                  <p className={styles.price}>{price}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
