"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { categories } from "@/data/products";
import ProductCard from "./ProductCard";
import styles from "./ShopExplorer.module.css";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

type Props = {
  products: Product[];
};

export default function ShopExplorer({ products }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = products.filter((p) => {
      if (category !== "All" && p.category !== category) return false;
      if (!q) return true;
      const hay = `${p.name} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      return hay.includes(q);
    });

    const next = [...list];
    if (sort === "price-asc") next.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") next.sort((a, b) => b.price - a.price);
    else if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));

    return next;
  }, [products, query, category, sort]);

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar} role="search">
        <label className={styles.field}>
          <span className={styles.label}>Search</span>
          <input
            type="search"
            className={styles.input}
            placeholder="Search products, tags…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Category</span>
          <select
            className={styles.select}
            value={category}
            onChange={(e) => setCategory(e.target.value as (typeof categories)[number])}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Sort</span>
          <select className={styles.select} value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="featured">Featured order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="name">Name A–Z</option>
          </select>
        </label>
      </div>

      <p className={styles.count} aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "product" : "products"}
      </p>

      {filtered.length === 0 ? (
        <p className={styles.empty}>No products match your filters. Try another search or category.</p>
      ) : (
        <ul className={styles.grid}>
          {filtered.map((p) => (
            <li key={p.id} className={styles.item}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
