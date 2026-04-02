import Link from "next/link";
import HeroSection from "@/components/home/HeroSection";
import ProductCard from "@/components/shop/ProductCard";
import { getFeaturedProducts } from "@/data/products";
import styles from "./home.module.css";

export default function HomePage() {
  const featured = getFeaturedProducts();

  return (
    <>
      <HeroSection />
      <section className={styles.section} aria-labelledby="featured-heading">
        <div className={styles.sectionHead}>
          <h2 id="featured-heading" className={styles.sectionTitle}>
            Featured picks
          </h2>
          <Link href="/shop" className={styles.sectionLink}>
            View all products
          </Link>
        </div>
        <ul className={styles.grid}>
          {featured.map((p) => (
            <li key={p.id} className={styles.item}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
