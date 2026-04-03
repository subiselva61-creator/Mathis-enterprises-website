import type { Product } from "../product-types";
import { INDIAMART_BASE } from "./constants";
import { catalogImages as I } from "./images";

const RP = `${INDIAMART_BASE}/residential-plots.html`;
const PL = `${INDIAMART_BASE}/plot.html`;
const cat = "Plots & land";
const t = ["Chennai", "plots", "real estate", "Mathi Enterprises"];

const amenityBlurb =
  "DTCP / RERA references and layout IDs as per IndiaMART listing; verify documents before purchase. Amenities such as roads, water, and security described on the source listing.";

export const plotProducts: Product[] = [
  {
    id: "plot-real-estate-plots-lands",
    slug: "real-estate-plots-and-lands",
    name: "Real Estate Plots And Lands",
    description: `Residential plotted development near Thozhupedu and connected locations. ${amenityBlurb}`,
    price: 399,
    currency: "INR",
    priceBasis: "sq ft",
    images: [I.plot],
    category: cat,
    tags: [...t, "CMDA", "residential"],
    specs: [
      { label: "Service Location", value: "Thozhupedu" },
      { label: "Location", value: "Chennai" },
      { label: "Location", value: "Melmaruvathoor" },
      { label: "Location", value: "Chengalpattu" },
      { label: "Location", value: "Achirupakkam" },
    ],
    indiaMartUrl: `${RP}#2853883320673`,
  },
  {
    id: "plot-farm-house-plots",
    slug: "farm-house-plots",
    name: "Farm House Plots",
    description:
      "The Country Village farm land near Maduranthagam ECR — larger plot sizes with gated community features per listing.",
    price: 299,
    currency: "INR",
    priceBasis: "sq ft",
    images: [I.plot],
    category: cat,
    tags: [...t, "farm house", "ECR"],
    specs: [
      { label: "Service Location", value: "Vizhuthamangalam" },
      { label: "Location", value: "Maduranthagam" },
      { label: "Location", value: "Chennai" },
      { label: "Location", value: "Chengalpattu" },
      { label: "Location", value: "Kancheepuram" },
      { label: "Plot size (per listing)", value: "10000 to 13000 sq.ft." },
    ],
    indiaMartUrl: `${RP}#2853883443562`,
  },
  {
    id: "plot-residential-plot",
    slug: "residential-plot",
    name: "Residential Plot",
    description: `Plotted residential land near Madhuranthagam with utilities and connectivity highlighted on IndiaMART. ${amenityBlurb}`,
    price: 399,
    currency: "INR",
    priceBasis: "sq ft",
    images: [I.plot],
    category: cat,
    tags: [...t, "residential"],
    specs: [
      { label: "Service Location", value: "Madhuranthagam" },
      { label: "Location", value: "Chengalpattu" },
      { label: "Location 2", value: "Melmaruvathur" },
      { label: "Location 3", value: "Chennai" },
      { label: "Location 4", value: "Vivekananthar nagar" },
    ],
    indiaMartUrl: `${RP}#2853871002488`,
  },
  {
    id: "plot-villa-plots-sale",
    slug: "villa-plots-for-sale",
    name: "Villa Plots For Sale",
    description:
      "Villa-format plots near Madhuranthagam with infrastructure and lifestyle amenities per IndiaMART copy.",
    price: 399,
    currency: "INR",
    priceBasis: "sq ft",
    images: [I.plot],
    category: cat,
    tags: [...t, "villa", "CMDA"],
    specs: [
      { label: "Service Location", value: "Madhuranthagam" },
      { label: "Location 1", value: "Chennai" },
      { label: "Location 2", value: "Chengal pattu" },
      { label: "Location 3", value: "Melmaruvathur" },
      { label: "Location 4", value: "Chithamoor" },
    ],
    indiaMartUrl: `${PL}#2853871057348`,
  },
  {
    id: "plot-farm-house-sale",
    slug: "farm-house-sale",
    name: "Farm House Sale",
    description:
      "Farm land parcels on Maduranthagam ECR — gated community, CCTV, pool, solar lighting per listing.",
    price: 299,
    currency: "INR",
    priceBasis: "sq ft",
    images: [I.plot],
    category: cat,
    tags: [...t, "farm", "ECR"],
    specs: [
      { label: "Service Location", value: "Maduranthagam ECR road" },
      { label: "Location", value: "Vizhuthamangalam" },
      { label: "Location", value: "Chennai" },
      { label: "Location", value: "Melmaruvathur" },
      { label: "Location", value: "Chengalpattu" },
    ],
    indiaMartUrl: `${PL}#2853883407088`,
  },
];
