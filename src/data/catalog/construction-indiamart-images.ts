/**
 * displayImage URLs from IndiaMART listing pages (construction-materials.html
 * and solid-block.html for Solid Concrete Block). Keys match Product.name in construction.ts.
 */
const INDIA_MART_CONSTRUCTION_IMAGES: Record<string, string> = {
  "Rectangular Red Partition Wall Bricks":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370519120/RA/XK/OO/200175737/red-brick-500x500.jpg",
  "Partition Wall Fly Ash Bricks":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370539142/ZD/IS/VX/200175737/fly-ash-bricks-1000x1000.jpg",
  "Fly Ash Bricks":
    "https://5.imimg.com/data5/SELLER/Default/2024/10/457251373/SJ/RX/OT/200175737/solid-blocks-1000x1000.jpg",
  "Cellocon AAC Blocks":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370545699/DB/VE/DT/200175737/cellocon-aac-blocks-500x500.jpg",
  "Gray A Grade M Sand":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370798568/HA/DU/BN/200175737/black-a-grade-m-sand-1000x1000.jpg",
  "M 20 Construction Ready Mix Concrete":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370596388/TO/ET/OF/200175737/ready-mix-concrete-1000x1000.jpg",
  "Gray Construction M Sand":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370547143/YB/HJ/AD/200175737/m-sand-1000x1000.jpg",
  "Construction Red Brick":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370518452/ZC/VD/HN/200175737/red-brick-1000x1000.jpg",
  "40 mm Construction Aggregate":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370531999/WJ/EV/EY/200175737/40-mm-aggregate-1000x1000.jpg",
  "20mm Construction Aggregate":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370529640/CK/PA/NI/200175737/20mm-aggregate-1000x1000.jpg",
  "12mm Construction Aggregate":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370527751/IL/OY/NN/200175737/12mm-aggregate-500x500.jpg",
  "Construction Grey P Sand":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370513724/XK/XX/KY/200175737/p-sand-500x500.jpg",
  "Brown Construction Filling Sand":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370619970/DB/RV/SX/200175737/f1-1-500x500.jpg",
  "6mm Construction Aggregate":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370087408/NL/EU/II/200175737/6mm-aggregate-500x500.jpg",
  "Brown Filling Sand":
    "https://5.imimg.com/data5/SELLER/Default/2023/12/370621581/UY/WB/MA/200175737/sa2-1-500x500.jpg",
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
