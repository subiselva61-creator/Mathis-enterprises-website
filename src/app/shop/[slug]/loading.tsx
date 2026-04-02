import styles from "@/components/shop/Skeletons.module.css";

export default function ProductLoading() {
  return (
    <div className={`${styles.productLayout} ${styles.pulse}`}>
      <div className={styles.productImage} />
      <div className={styles.productLines}>
        <div className={styles.productLineMd} />
        <div className={styles.productLineLg} />
        <div className={styles.productLineMd} />
        <div className={styles.productPara} />
        <div className={styles.productPara} style={{ height: "3rem", width: "60%" }} />
      </div>
    </div>
  );
}
