import type { Product } from "../product-types";
import { INDIAMART_BASE } from "./constants";
import { catalogImages as I } from "./images";

const RS = `${INDIAMART_BASE}/real-estate-services.html`;
const cat = "Real estate services";
const t = ["Chennai", "real estate", "Mathi Enterprises"];

export const realEstateServiceProducts: Product[] = [
  {
    id: "res-services-general",
    slug: "real-estate-services",
    name: "Real Estate Services",
    description:
      "End-to-end assistance for buying and selling residential land and related transactions — scope and fees on enquiry.",
    price: 0,
    currency: "INR",
    priceOnRequest: true,
    images: [I.estate],
    category: cat,
    tags: [...t, "consulting"],
    specs: [],
    indiaMartUrl: `${RS}#2853865611273`,
  },
  {
    id: "res-residential-land-plot",
    slug: "residential-land-plot",
    name: "Residential Land Plot",
    description:
      "Support for identifying and closing residential land parcels — connect via IndiaMART for current inventory.",
    price: 0,
    currency: "INR",
    priceOnRequest: true,
    images: [I.estate],
    category: cat,
    tags: [...t, "land"],
    specs: [],
    indiaMartUrl: `${RS}#2853870772755`,
  },
  {
    id: "res-house-land-plot",
    slug: "house-land-plot",
    name: "House Land Plot",
    description:
      "House-and-land solutions and plot shortlisting — detailed offerings shared on direct enquiry.",
    price: 0,
    currency: "INR",
    priceOnRequest: true,
    images: [I.estate],
    category: cat,
    tags: [...t, "house", "land"],
    specs: [],
    indiaMartUrl: `${RS}#2853870866448`,
  },
];
