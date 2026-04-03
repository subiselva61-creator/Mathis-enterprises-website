export type ProductSpec = { label: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  images: string[];
  category: string;
  tags: string[];
  /** Unit shown after price, e.g. "Piece", "Cubic Feet", "Kg" */
  priceBasis?: string;
  moq?: string;
  specs?: ProductSpec[];
  indiaMartUrl?: string;
  /** When true, PDP/card show “Price on request” and cart add is disabled */
  priceOnRequest?: boolean;
};
