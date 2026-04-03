export function formatMoneyPdf(amount: number, currency: string): string {
  const maxFractionDigits = currency === "INR" ? 2 : 2;
  const locale = currency === "INR" ? "en-IN" : "en-US";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: maxFractionDigits,
    minimumFractionDigits: 0,
  }).format(amount);
}
