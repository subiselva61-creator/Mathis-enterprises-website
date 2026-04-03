import AppleHome from "@/components/home/AppleHome";
import { getMergedProducts } from "@/lib/catalog";

export default async function HomePage() {
  const products = await getMergedProducts();
  return <AppleHome products={products} />;
}
