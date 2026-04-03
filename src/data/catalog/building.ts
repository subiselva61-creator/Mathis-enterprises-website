import type { Product } from "../product-types";
import { INDIAMART_BASE } from "./constants";
import { catalogImages as I } from "./images";

const BM = `${INDIAMART_BASE}/building-materials.html`;
const cat = "Building Materials";
const t = ["Chennai", "building materials", "Mathi Enterprises"];

export const buildingProducts: Product[] = [
  {
    id: "bld-river-sand-25kg",
    slug: "river-sand-25-per-kg-bag",
    name: "River Sand 25 Per Kg Bag",
    description:
      "Single-washed river sand from local riverbed — Zone I as per IS 383, supplied loose and in 25 kg bags.",
    price: 85,
    currency: "INR",
    priceBasis: "Cubic Feet",
    images: [I.sand],
    category: cat,
    tags: [...t, "river sand", "bagged"],
    specs: [
      { label: "Application", value: "Concreting" },
      { label: "Sand Zone (IS 383)", value: "Zone I" },
      { label: "Source", value: "Local Riverbed" },
      { label: "Purity / Washed Status", value: "Single Washed" },
      { label: "Form", value: "Loose (Bulk)" },
      { label: "Packaging Size", value: "25 kg Bag" },
    ],
    indiaMartUrl: `${BM}#2857706343533`,
  },
  {
    id: "bld-interlock-brick",
    slug: "interlock-wall-brick",
    name: "Interlock Wall Brick",
    description:
      "Rectangular interlocking bricks that lock without mortar — shear key design for stability.",
    price: 50,
    currency: "INR",
    priceBasis: "Piece",
    images: [I.brickGray],
    category: cat,
    tags: [...t, "interlock", "brick"],
    specs: [
      { label: "Shape", value: "Rectangular" },
      { label: "Size", value: "9 x 4 x 3 Inch" },
    ],
    indiaMartUrl: `${BM}#2857275678533`,
  },
];
