/* Next.js remounts `template` on each navigation to this segment — runs the entrance animation. */
export default function ShopProductTemplate({ children }: { children: React.ReactNode }) {
  return <div className="shop-product-route-enter">{children}</div>;
}
