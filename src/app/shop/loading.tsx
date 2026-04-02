import styles from "@/components/shop/Skeletons.module.css";

export default function ShopLoading() {
  return (
    <>
      <div className={`pageTitle ${styles.pulse}`} style={{ height: "2rem", width: "40%", borderRadius: 8, background: "rgba(255,255,255,0.08)" }} />
      <div
        className={`pageLead ${styles.pulse}`}
        style={{ height: "3rem", maxWidth: "36rem", borderRadius: 8, background: "rgba(255,255,255,0.06)", marginBottom: "2rem" }}
      />
      <ul className={styles.shopGrid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className={`${styles.card} ${styles.pulse}`}>
            <div className={styles.cardImage} />
            <div className={styles.cardBody}>
              <div className={`${styles.line} ${styles.lineShort}`} />
              <div className={`${styles.line} ${styles.lineTitle}`} />
              <div className={`${styles.line} ${styles.linePrice}`} />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
