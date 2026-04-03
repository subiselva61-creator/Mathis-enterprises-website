import type { Product } from "../product-types";
import { INDIAMART_BASE } from "./constants";
import { catalogImages as I } from "./images";

const CE = `${INDIAMART_BASE}/construction-cement.html`;
const DC = `${INDIAMART_BASE}/dalmia-cement.html`;
const cat = "Cement";
const t = ["Chennai", "cement", "Mathi Enterprises"];

export const cementProducts: Product[] = [
  {
    id: "cem-construction-river-sand",
    slug: "construction-river-sand",
    name: "Construction River Sand",
    description:
      "Medium brown river sand for concreting — 25 kg packaging option, sourced in India.",
    price: 100,
    currency: "INR",
    priceBasis: "Cubic Feet",
    images: [I.sand],
    category: cat,
    tags: [...t, "river sand"],
    specs: [
      { label: "Type", value: "Medium" },
      { label: "Color", value: "Brown" },
      { label: "Usage/Application", value: "Construction" },
      { label: "Packaging Size", value: "25 kg" },
      { label: "Country of Origin", value: "Made in India" },
    ],
    indiaMartUrl: `${CE}#2856794357533`,
  },
  {
    id: "cem-coromandel-opc",
    slug: "coromandel-opc-cement",
    name: "Coromandel OPC Cement",
    description:
      "33 Grade ordinary Portland cement in 50 kg HDPE bags — branded quality for structural concrete.",
    price: 380,
    currency: "INR",
    priceBasis: "Bag",
    images: [I.cement],
    category: cat,
    tags: [...t, "OPC", "Coromandel"],
    specs: [
      { label: "Grade", value: "33 Grade" },
      { label: "Cement Type", value: "OPC (Ordinary Portland Cement)" },
      { label: "Packaging Type", value: "HDPE Sack Bag" },
      { label: "Country of Origin", value: "Made in India" },
      { label: "Packaging size", value: "50 kg" },
      { label: "Brand of the Cement", value: "Coromandel" },
    ],
    indiaMartUrl: `${CE}#2854059623497`,
  },
  {
    id: "cem-ramco-ppc",
    slug: "ramco-ppc-cement",
    name: "Ramco PPC Cement",
    description:
      "Ramco pozzolana Portland cement — 50 kg HDPE sacks for durable masonry and concrete.",
    price: 320,
    currency: "INR",
    priceBasis: "Bag",
    images: [I.cement],
    category: cat,
    tags: [...t, "PPC", "Ramco"],
    specs: [
      { label: "Cement Type", value: "PPC (Pozzolana Portland Cement)" },
      { label: "Packaging Type", value: "HDPE Sack Bag" },
      { label: "Country of Origin", value: "Made in India" },
      { label: "Packaging size", value: "50 Kg" },
      { label: "Brand Name", value: "Ramco" },
    ],
    indiaMartUrl: `${CE}#2854059695448`,
  },
  {
    id: "cem-coromandel-csk",
    slug: "coromandel-cement-csk",
    name: "Coromandel Cement CSK",
    description:
      "Coromandel CSK cement in 50 kg HDPE bags — consistent quality for general construction.",
    price: 355,
    currency: "INR",
    priceBasis: "Bag",
    images: [I.cement],
    category: cat,
    tags: [...t, "Coromandel", "CSK"],
    specs: [
      { label: "Packaging Type", value: "HDPE Sack Bag" },
      { label: "Country of Origin", value: "Made in India" },
      { label: "Packaging size", value: "50 kg" },
      { label: "Cement name", value: "Coromandel" },
      { label: "Cement Type name", value: "CSK cement" },
    ],
    indiaMartUrl: `${CE}#2854059801262`,
  },
  {
    id: "cem-coromandel-bop",
    slug: "coromandel-bop-cement",
    name: "Coromandel BOP Cement",
    description:
      "Coromandel BOP cement — 50 kg HDPE packaging, suitable for a range of site applications.",
    price: 335,
    currency: "INR",
    priceBasis: "Bag",
    images: [I.cement],
    category: cat,
    tags: [...t, "Coromandel", "BOP"],
    specs: [
      { label: "Packaging Type", value: "HDPE Sack Bag" },
      { label: "Country of Origin", value: "Made in India" },
      { label: "Brand name", value: "Coromandel" },
      { label: "Type Name", value: "BOP cement" },
      { label: "Packaging size", value: "50 Kg" },
    ],
    indiaMartUrl: `${CE}#2854059660348`,
  },
  {
    id: "cem-dalmia-dsp",
    slug: "dalmia-dsp-cement",
    name: "Dalmia DSP Cement",
    description:
      "Dalmia DSP cement in standard 50 kg bags — confirm grade and availability for your pour schedule.",
    price: 385,
    currency: "INR",
    priceBasis: "Bag",
    images: [I.cement],
    category: cat,
    tags: [...t, "Dalmia", "DSP"],
    specs: [
      { label: "Packaging", value: "50 kg bag (typical)" },
      { label: "Brand", value: "Dalmia" },
    ],
    indiaMartUrl: `${DC}#2854059750130`,
  },
];
