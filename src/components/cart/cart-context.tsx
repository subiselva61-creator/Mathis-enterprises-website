"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/products";

const STORAGE_KEY = "mathis-cart-v1";

export type CartLine = {
  productId: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
};

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  subtotalCents: number;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
  isReady: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

function loadFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || !("lines" in parsed)) return [];
    const lines = (parsed as CartState).lines;
    if (!Array.isArray(lines)) return [];
    return lines.filter(
      (l): l is CartLine =>
        l &&
        typeof l === "object" &&
        typeof (l as CartLine).productId === "string" &&
        typeof (l as CartLine).quantity === "number" &&
        (l as CartLine).quantity > 0
    );
  } catch {
    return [];
  }
}

function persist(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ lines }));
  } catch {
    /* ignore quota */
  }
}

export function CartProvider({ children, products }: { children: ReactNode; products: Product[] }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const hydrated = useRef(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    /* eslint-disable react-hooks/set-state-in-effect -- one-time client hydration from localStorage (unavailable on server) */
    setLines(loadFromStorage());
    setIsReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!isReady) return;
    persist(lines);
  }, [lines, isReady]);

  const priceById = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.id, p.price));
    return m;
  }, [products]);

  const itemCount = useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines]);

  const subtotalCents = useMemo(() => {
    return Math.round(
      lines.reduce((sum, l) => {
        const price = priceById.get(l.productId) ?? 0;
        return sum + price * l.quantity;
      }, 0) * 100
    );
  }, [lines, priceById]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    const q = Math.max(1, Math.floor(quantity));
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === product.id);
      if (idx === -1) return [...prev, { productId: product.id, quantity: q }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: next[idx].quantity + q };
      return next;
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    const q = Math.floor(quantity);
    if (q < 1) {
      setLines((prev) => prev.filter((l) => l.productId !== productId));
      return;
    }
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.productId === productId);
      if (idx === -1) return [...prev, { productId, quantity: q }];
      const next = [...prev];
      next[idx] = { ...next[idx], quantity: q };
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      subtotalCents,
      addItem,
      setQuantity,
      removeItem,
      clear,
      isReady,
    }),
    [lines, itemCount, subtotalCents, addItem, setQuantity, removeItem, clear, isReady]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
