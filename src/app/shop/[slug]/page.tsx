import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import AddToCartSection from "@/components/shop/AddToCartSection";
import RelatedProductSuggestions from "@/components/shop/RelatedProductSuggestions";
import ProductJsonLd from "@/components/seo/ProductJsonLd";
import { staticProductSlugs } from "@/data/products";
import { getMergedProductBySlug, getRelatedProductsInCategory } from "@/lib/catalog";
import { formatProductPrice } from "@/lib/format";
import { marketingPageMetadata } from "@/lib/seo-metadata";
import { absoluteUrl, BUSINESS_NAME, PRIMARY_CITY, productPhotoAlt } from "@/lib/site";
import styles from "./product.module.css";

const RED_PARTITION_BRICK_SLUG = "rectangular-red-partition-wall-bricks";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return staticProductSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getMergedProductBySlug(slug);
  if (!product) return { title: { absolute: "Product · Mathi Enterprises" } };
  const title = `Bulk ${product.name} supplier in ${PRIMARY_CITY} | ${BUSINESS_NAME}`;
  const description =
    product.description.length > 155 ? `${product.description.slice(0, 152).trim()}…` : product.description;
  const ogImage = product.images[0] ? absoluteUrl(product.images[0]) : undefined;
  return marketingPageMetadata({
    title,
    description,
    path: `/shop/${slug}`,
    ...(ogImage ? { ogImage } : {}),
  });
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
      <ProductJsonLd product={product} />
      {isRedPartitionBrickHero ? (
        <section className={styles.appleHeroBrick} aria-labelledby="red-brick-hero-title">
          <h1 id="red-brick-hero-title" className={styles.appleHeroTitle}>
            Rectangular Red Partition Wall Bricks
          </h1>
          <p className={styles.appleHeroSubtitle}>Build with strength. Design with style.</p>
          <div className={styles.appleHeroFigure} data-scroll-pdp-hero>
            <Image
              src="/red-bricks-2.png"
              alt={productPhotoAlt({ name: "Rectangular red partition wall bricks" }, "main")}
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
                  alt={productPhotoAlt(product, "main")}
                  fill
                  className={styles.image}
                  sizes="(max-width: 900px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
            {rest.length > 0 ? (
              <ul className={styles.thumbs} aria-label="More product images">
                {rest.map((src, thumbIdx) => (
                  <li key={src} className={styles.thumbItem}>
                    <div className={styles.thumb}>
                      <div className={styles.thumbPad}>
                        <Image
                          src={src}
                          alt={`${productPhotoAlt(product, "detail")} — view ${thumbIdx + 2}`}
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
            <p className={styles.title}>{product.name}</p>
          ) : (
            <h1 className={styles.title}>{product.name}</h1>
          )}
          <p className={styles.price}>
            <span className={styles.priceValue}>{formatProductPrice(product)}</span>
            {!product.priceOnRequest && product.priceBasis ? (
              <span className={styles.priceValue}> / {product.priceBasis.toLowerCase()}</span>
            ) : null}
          </p>
          <h2 className={styles.procurementHeading}>Bulk procurement &amp; pricing</h2>
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
              <h2 className={styles.specsTitle}>Technical specifications</h2>
              <table className={styles.specsTable}>
                <caption className="sr-only">Technical specifications for {product.name}</caption>
                <thead>
                  <tr>
                    <th scope="col">Specification</th>
                    <th scope="col">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {product.specs.map((s, i) => (
                    <tr key={`${s.label}-${i}`}>
                      <th scope="row">{s.label}</th>
                      <td>{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
