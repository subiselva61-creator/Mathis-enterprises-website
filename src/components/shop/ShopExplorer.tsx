"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { categories } from "@/data/products";
import ProductCard from "./ProductCard";
import styles from "./ShopExplorer.module.css";

type SortKey = "featured" | "price-asc" | "price-desc" | "name";

type Props = {
  products: Product[];
  /** From `/shop?cat=…` (URL-encoded category label) */
  initialCategory?: string | null;
  /** From `/shop?q=…` (header search overlay) */
  initialQuery?: string | null;
};

function normalizeInitialCategory(raw: string | null | undefined): (typeof categories)[number] {
  if (!raw) return "All";
  const decoded = decodeURIComponent(raw.trim());
  const match = categories.find((c) => c === decoded);
  return (match ?? "All") as (typeof categories)[number];
}

function normalizeInitialQuery(raw: string | null | undefined): string {
  if (!raw) return "";
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return raw.trim();
  }
}

export default function ShopExplorer({ products, initialCategory, initialQuery }: Props) {
  const [query, setQuery] = useState(() => normalizeInitialQuery(initialQuery ?? null));
  const [category, setCategory] = useState<(typeof categories)[number]>(() =>
    normalizeInitialCategory(initialCategory ?? null),
  );
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
