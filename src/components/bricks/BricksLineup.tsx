import type { Product } from "@/data/products";
import ProductLineup from "@/components/catalog/ProductLineup";

type Props = { products: Product[]; lineupHeadingLevel?: "h2" | "h3" };

export default function BricksLineup({ products, lineupHeadingLevel = "h2" }: Props) {
  return (
    <ProductLineup
      products={products}
      headingId="bricks-lineup-heading"
      scrollListAriaLabel="Brick product cards, scroll horizontally"
      lineupHeadingLevel={lineupHeadingLevel}
    />
  );
}
