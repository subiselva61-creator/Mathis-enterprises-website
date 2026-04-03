import type { Product } from "../product-types";
import { INDIAMART_BASE } from "./constants";
import { catalogImages as I } from "./images";

const NI = `${INDIAMART_BASE}/new-items.html`;
const cat = "New items";
const t = ["Chennai", "new", "Mathi Enterprises"];

export const newItemProducts: Product[] = [
  {
    id: "new-birla-aac",
    slug: "birla-aac-block",
    name: "Birla AAC BLOCK",
    description:
      "Birla Aerocon AAC blocks — lightweight autoclaved aerated concrete for multi-storey buildings and faster construction.",
    price: 49,
    currency: "INR",
    priceBasis: "Piece",
    images: [I.aac],
    category: cat,
    tags: [...t, "AAC", "Birla"],
    specs: [
      { label: "Size", value: "9x5x3 inch" },
      { label: "Color", value: "Grey" },
      { label: "Shape", value: "Cubical" },
      { label: "Design", value: "Solid" },
      { label: "Country of Origin", value: "Made in India" },
    ],
    indiaMartUrl: `${NI}#2857275687448`,
  },
  {
    id: "new-interlock-6in",
    slug: "interlock-wall-brick-6-inch-ash",
    name: "Interlock Wall Brick (6 inch, ash)",
    description:
      "Ash-colour 6 inch interlock bricks — alternate listing from New Items with quality grading per IndiaMART.",
    price: 55,
    currency: "INR",
    priceBasis: "Piece",
    images: [I.brickGray],
    category: cat,
    tags: [...t, "interlock"],
    specs: [
      { label: "Shape", value: "Rectangular" },
      { label: "Size", value: "6 inch" },
      { label: "Colour", value: "Ash colour" },
      { label: "Length", value: "6 Inch" },
      { label: "Quality", value: "No.1" },
    ],
    indiaMartUrl: `${NI}#2857706415862`,
  },
  {
    id: "new-viki-fe550d",
    slug: "viki-fe550d-tmt",
    name: "VIKI FE550D",
    description:
      "High-strength Viki FE550D TMT — 550 N/mm² yield with enhanced ductility for complex and high-rise structures.",
    price: 60,
    currency: "INR",
    priceBasis: "Piece",
    images: [I.tmt],
    category: cat,
    tags: [...t, "TMT", "Viki"],
    specs: [],
    indiaMartUrl: `${NI}#2857995855188`,
  },
  {
    id: "new-suryadev-fe550d",
    slug: "suryadev-fe550d-tmt-new",
    name: "SURYADEV FE550D",
    description:
      "Suryadev FE550D reinforcement as listed under New Items — confirm pricing unit (per kg vs per piece) when you enquire.",
    price: 67,
    currency: "INR",
    priceBasis: "Piece",
    images: [I.tmt],
    category: cat,
    tags: [...t, "TMT", "Suryadev"],
    specs: [],
    indiaMartUrl: `${NI}#2857995853755`,
  },
  {
    id: "new-tata-tiscon-crs",
    slug: "tata-tiscon-crs-550sd",
    name: "TATA TISCON CRS 550SD",
    description:
      "Tata Tiscon corrosion-resistant CRS 550SD bar for durable RCC in aggressive environments.",
    price: 49,
    currency: "INR",
    priceBasis: "Piece",
    images: [I.tmt],
    category: cat,
    tags: [...t, "Tata", "Tiscon"],
    specs: [],
    indiaMartUrl: `${NI}#2857995853330`,
  },
  {
    id: "new-tata-tiscon-550d",
    slug: "tata-tiscon-550d",
    name: "TATA TISCON 550D",
    description: "Tata Tiscon 550D ductile TMT for earthquake-resistant concrete frames.",
    price: 67,
    currency: "INR",
    priceBasis: "Piece",
    images: [I.tmt],
    category: cat,
    tags: [...t, "Tata", "Tiscon"],
    specs: [],
    indiaMartUrl: `${NI}#2857995853233`,
  },
  {
    id: "new-zig-zag-paver",
    slug: "zig-zag-paver-block",
    name: "Zig Zag Paver Block",
    description: "Red zig-zag interlocking paver blocks — Made in India.",
    price: 55,
    currency: "INR",
    priceBasis: "sq ft",
    images: [I.paver],
    category: cat,
    tags: [...t, "paver", "paving"],
    specs: [
      { label: "Color", value: "Red" },
      { label: "Country of Origin", value: "Made in India" },
    ],
    indiaMartUrl: `${NI}#2857706481573`,
  },
];
