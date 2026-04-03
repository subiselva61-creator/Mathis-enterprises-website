import type { Product } from "@/data/product-types";

type FormatOptions = {
  maximumFractionDigits?: number;
};

export function formatProductPrice(
  product: Pick<Product, "price" | "currency" | "priceOnRequest">,
): string {
  if (product.priceOnRequest) return "Price on request";
  return formatPrice(product.price, product.currency);
}

export function formatPrice(amount: number, currency: string, options?: FormatOptions): string {
  const maxFractionDigits =
    options?.maximumFractionDigits ?? (currency === "INR" ? 2 : 0);
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  }).format(amount);
}
