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
};

export const categories = ["All", "Office", "Lifestyle", "Tech", "Wellness"] as const;

export const products: Product[] = [
  {
    id: "p-aurora-desk",
    slug: "aurora-standing-desk",
    name: "Aurora standing desk",
    description:
      "Motorized height memory, cable tray, and a warm oak top sized for dual monitors. Built for long creative sessions without the slump.",
    price: 849,
    currency: "USD",
    images: [
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=1200&q=80",
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200&q=80",
    ],
    category: "Office",
    tags: ["desk", "ergonomic", "furniture", "workspace"],
  },
  {
    id: "p-lumen-lamp",
    slug: "lumen-desk-lamp",
    name: "Lumen arc lamp",
    description:
      "Full-spectrum LED with smooth dimming and a weighted base that stays put. The matte finish disappears into any desk setup.",
    price: 129,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=1200&q=80"],
    category: "Office",
    tags: ["lighting", "desk", "minimal"],
  },
  {
    id: "p-nimbus-chair",
    slug: "nimbus-task-chair",
    name: "Nimbus task chair",
    description:
      "Breathable mesh, lumbar that actually adjusts, and arms you can tuck away. The kind of chair you forget you are sitting in.",
    price: 449,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=1200&q=80"],
    category: "Office",
    tags: ["chair", "ergonomic", "seating"],
  },
  {
    id: "p-echo-buds",
    slug: "echo-wireless-earbuds",
    name: "Echo wireless earbuds",
    description:
      "Hybrid ANC, multipoint pairing, and a case that charges wirelessly. Tuned for calls and playlists in equal measure.",
    price: 179,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&q=80"],
    category: "Tech",
    tags: ["audio", "wireless", "travel"],
  },
  {
    id: "p-pulse-watch",
    slug: "pulse-fitness-watch",
    name: "Pulse fitness watch",
    description:
      "AMOLED display, sleep staging, and a week of battery. Water resistant for swims and surprise rain on your commute.",
    price: 299,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=1200&q=80"],
    category: "Tech",
    tags: ["wearable", "health", "fitness"],
  },
  {
    id: "p-velvet-tote",
    slug: "velvet-everyday-tote",
    name: "Velvet everyday tote",
    description:
      "Structured silhouette with a magnetic closure and an interior zip pocket. Carries a laptop, lunch, and the extras.",
    price: 89,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1200&q=80"],
    category: "Lifestyle",
    tags: ["bag", "carry", "fashion"],
  },
  {
    id: "p-stone-carafe",
    slug: "stone-glaze-carafe",
    name: "Stone glaze carafe set",
    description:
      "Hand-finished ceramic with a pour spout that does not dribble. Includes two tumblers for slow mornings.",
    price: 64,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1570829505120-7b28b99d4e4c?w=1200&q=80"],
    category: "Lifestyle",
    tags: ["kitchen", "home", "gift"],
  },
  {
    id: "p-calm-diffuser",
    slug: "calm-essential-diffuser",
    name: "Calm essential diffuser",
    description:
      "Ultrasonic mist, timer presets, and a ceramic cover that doubles as decor. Whisper quiet for bedrooms and studios.",
    price: 72,
    currency: "USD",
    images: ["https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=1200&q=80"],
    category: "Wellness",
    tags: ["wellness", "home", "aroma"],
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return [products[0], products[3], products[5], products[7]];
}
