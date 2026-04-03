/**
 * displayImage URLs from IndiaMART listing pages (construction-materials.html
 * and solid-block.html for Solid Concrete Block). Keys match Product.name in construction.ts.
 */
const INDIA_MART_CONSTRUCTION_IMAGES: Record<string, string> = {
  "Rectangular Red Partition Wall Bricks":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370519120/RA/XK/OO/200175737/red-brick-500x500.jpg",
  "Renacon AAC Block":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370537067/IM/TJ/GO/200175737/renocan-aac-block-1000x1000.jpg",
  "Brown Crushed Stone":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370616053/JR/DJ/PL/200175737/g2-1-500x500.jpg",
  "Gray Rectangular Concrete Bricks":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370848480/YD/PW/BQ/200175737/gray-rectangular-concrete-bricks-1000x1000.jpg",
  "Crushed Red Brick Stone":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370628945/VH/CU/TG/200175737/bj1-1-500x500.jpg",
  "Brown Rubbish Sand":
    "https://5.imimg.com/data5/SELLER/Default/2025/4/503523151/PG/SS/LN/200175737/brown-rubbish-sand-1000x1000.png",
  "Gravel Crushed Stone":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370524103/FG/SY/BF/200175737/6mm-aggregate-1000x1000.jpg",
  "Coromandel Cement PPC":
    "https://5.imimg.com/data5/SELLER/Default/2024/5/418080573/DE/FW/IR/200175737/whatsapp-image-2024-05-11-at-15-15-59-1000x1000.jpeg",
  "Solid Concrete Block":
    "https://5.imimg.com/data5/SELLER/Default/2024/10/457255779/KI/AV/ZN/200175737/solid-blocks-1000x1000.jpg",
};

export function constructionIndiaMartImage(productName: string): string[] {
  const url = INDIA_MART_CONSTRUCTION_IMAGES[productName];
  if (!url) {
    throw new Error(`Missing IndiaMART construction image for: ${productName}`);
  }
  return [url];
}
