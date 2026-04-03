import type { Product } from "@/data/products";
import ProductLineup from "@/components/catalog/ProductLineup";

type Props = { products: Product[] };

export default function BricksLineup({ products }: Props) {
  return (
    <ProductLineup
      products={products}
      headingId="bricks-lineup-heading"
      scrollListAriaLabel="Brick product cards, scroll horizontally"
    />
  );
}
