import Image from "next/image";
import styles from "./SiteFooter.module.css";

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Image
            src="/logo.png"
            alt=""
            width={48}
            height={46}
            className={styles.brandMark}
          />
          <span className={styles.brandName}>Mathis Enterprises</span>
        </div>
        <p className={styles.note}>
          Demo storefront — checkout and payments are not connected yet. Replace product data when you are ready to go
          live.
        </p>
        <p className={styles.copy}>© {new Date().getFullYear()} Mathis Enterprises. All rights reserved.</p>
      </div>
    </footer>
  );
}
