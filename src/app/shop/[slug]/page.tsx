import type { Metadata } from "next";
import Image from "next/image";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import AddToCartSection from "@/components/shop/AddToCartSection";
import RelatedProductSuggestions from "@/components/shop/RelatedProductSuggestions";
import { staticProductSlugs } from "@/data/products";
import { getMergedProductBySlug, getRelatedProductsInCategory } from "@/lib/catalog";
import { formatProductPrice } from "@/lib/format";
import styles from "./product.module.css";

const RED_PARTITION_BRICK_SLUG = "rectangular-red-partition-wall-bricks";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return staticProductSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getMergedProductBySlug(slug);
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
  const product = await getMergedProductBySlug(slug);
  if (!product) notFound();

  const relatedInCategory = await getRelatedProductsInCategory(slug, product.category, 3);

  const [primary, ...rest] = product.images;
  const isRedPartitionBrickHero = slug === RED_PARTITION_BRICK_SLUG;

  return (
    <div className={isRedPartitionBrickHero ? styles.pageBrick : styles.page}>
      {isRedPartitionBrickHero ? (
        <section className={styles.appleHeroBrick} aria-labelledby="red-brick-hero-title">
          <h1 id="red-brick-hero-title" className={styles.appleHeroTitle}>
            Rectangular Red Partition Wall Bricks
          </h1>
          <p className={styles.appleHeroSubtitle}>Build with strength. Design with style.</p>
          <div className={styles.appleHeroFigure} data-scroll-pdp-hero>
            <Image
              src="/red-bricks-2.png"
              alt="Rectangular red partition wall bricks presented for construction use"
              width={1400}
              height={900}
              priority
              className={styles.appleHeroImg}
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </section>
      ) : null}

      <article
        className={`${styles.article} ${isRedPartitionBrickHero ? styles.articleBrickSolo : ""}`}
      >
        {!isRedPartitionBrickHero ? (
          <div className={styles.media}>
            <div className={styles.heroImage} data-scroll-pdp-hero>
              <div className={styles.heroImagePad}>
                <Image
                  src={primary}
                  alt={`${product.name} — main product photo`}
                  fill
                  className={styles.image}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            {rest.length > 0 ? (
              <ul className={styles.thumbs} aria-label="More product images">
                {rest.map((src, i) => (
                  <li key={src} className={styles.thumbItem}>
                    <div className={styles.thumb}>
                      <div className={styles.thumbPad}>
                        <Image
                          src={src}
                          alt={`${product.name} — detail ${i + 2}`}
                          fill
                          className={styles.image}
                          sizes="120px"
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
        <div
          className={styles.detail}
          data-scroll-pdp-detail
          id={isRedPartitionBrickHero ? "red-brick-details" : undefined}
        >
          <p className={styles.category}>{product.category}</p>
          {isRedPartitionBrickHero ? (
            <h2 className="sr-only">{product.name}</h2>
          ) : (
            <h1 className={styles.title}>{product.name}</h1>
          )}
          <p className={styles.price}>
            <span className={styles.priceValue}>{formatProductPrice(product)}</span>
            {!product.priceOnRequest && product.priceBasis ? (
              <span className={styles.priceValue}> / {product.priceBasis.toLowerCase()}</span>
            ) : null}
          </p>
          {product.priceOnRequest ? (
            <p className={styles.priceNote}>Contact us on IndiaMART for the latest availability and a formal quote.</p>
          ) : (
            <p className={styles.priceNote}>
              Indicative price from our IndiaMART listing; confirm MOQ, freight, and latest rate before you order.
            </p>
          )}
          {product.moq ? <p className={styles.moq}>Minimum order: {product.moq}</p> : null}
          <p className={styles.desc}>{product.description}</p>
          {product.specs && product.specs.length > 0 ? (
            <div className={styles.specs}>
              <h2 className={styles.specsTitle}>Specifications</h2>
              <dl className={styles.specsGrid}>
                {product.specs.map((s, i) => (
                  <Fragment key={`${s.label}-${i}`}>
                    <dt>{s.label}</dt>
                    <dd>{s.value}</dd>
                  </Fragment>
                ))}
              </dl>
            </div>
          ) : null}
          <p className={styles.imCta}>
            For bulk order and price negotiation call
            <a href="tel:+917845583158" className={styles.imLink}>
              +91 78455 83158
            </a>
          </p>
          <p className={styles.tags}>
            <span className={styles.tagsLabel}>Tags </span>
            {product.tags.join(", ")}
          </p>
          {isRedPartitionBrickHero ? (
            <div id="red-brick-purchase" className={styles.purchaseBrickAnchor}>
              <AddToCartSection product={product} />
              <RelatedProductSuggestions products={relatedInCategory} />
            </div>
          ) : (
            <>
              <AddToCartSection product={product} />
              <RelatedProductSuggestions products={relatedInCategory} />
            </>
          )}
        </div>
      </article>
    </div>
  );
}
