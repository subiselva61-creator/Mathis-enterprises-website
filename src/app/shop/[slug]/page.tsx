import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartSection from "@/components/shop/AddToCartSection";
import { getProductBySlug, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import styles from "./product.module.css";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Product" };
  return {
    title: product.name,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images[0] ? [{ url: product.images[0] }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const [primary, ...rest] = product.images;

  return (
    <>
      <article className={styles.article}>
        <div className={styles.media}>
          <div className={styles.heroImage}>
            <Image
              src={primary}
              alt={`${product.name} — main product photo`}
              fill
              className={styles.image}
              sizes="(max-width: 900px) 100vw, 50vw"
              priority
            />
          </div>
          {rest.length > 0 ? (
            <ul className={styles.thumbs} aria-label="More product images">
              {rest.map((src, i) => (
                <li key={src} className={styles.thumbItem}>
                  <div className={styles.thumb}>
                    <Image
                      src={src}
                      alt={`${product.name} — detail ${i + 2}`}
                      fill
                      className={styles.image}
                      sizes="120px"
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className={styles.detail}>
          <p className={styles.category}>{product.category}</p>
          <h1 className={styles.title}>{product.name}</h1>
          <p className={styles.price}>{formatPrice(product.price, product.currency)}</p>
          <p className={styles.desc}>{product.description}</p>
          <p className={styles.tags}>
            <span className={styles.tagsLabel}>Tags: </span>
            {product.tags.join(", ")}
          </p>
          <AddToCartSection product={product} />
        </div>
      </article>
    </>
  );
}
