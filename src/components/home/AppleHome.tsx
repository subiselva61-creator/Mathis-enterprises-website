import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { products } from "@/data/products";

const pillPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[#0066cc] px-6 text-[17px] font-normal leading-none text-white transition-colors hover:bg-[#0077ed] md:text-[19px]";

function taglineFromDescription(description: string, max = 90) {
  const t = description.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function HeroModule({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  /* First hero is white; below alternates dark → gray so the stripe rhythm stays zig-zag. */
  const dark = index > 0 && index % 2 === 1;
  const bg =
    index === 0
      ? "bg-white text-[#1d1d1f]"
      : dark
        ? "bg-[#000000] text-[#f5f5f7]"
        : "bg-[#f5f5f7] text-[#1d1d1f]";
  const img = product.images[0];
  const isRedBricksHero = product.slug === "rectangular-red-partition-wall-bricks";
  const isRiverSandHero = product.slug === "a-grade-brown-river-sand";

  return (
    <section
      className={`${bg}${isRedBricksHero ? " -my-[34px]" : ""}`}
      aria-labelledby={`hero-${product.slug}`}
    >
      <div
        className={
          isRedBricksHero
            ? "relative z-10 mx-auto min-h-[345px] w-[343px] max-w-[980px] px-4 pt-[87px] pb-3 text-center md:pb-8"
            : "mx-auto max-w-[980px] -mt-[5px] -mb-[5px] -ml-[6px] -mr-[6px] px-4 pt-10 text-center pb-[15px] md:pb-8 md:pt-14"
        }
      >
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-current opacity-80 md:text-sm md:font-medium md:normal-case md:tracking-normal">
          {product.category}
        </p>
        <h2
          id={`hero-${product.slug}`}
          className="mb-2 text-[32px] font-semibold leading-[1.05] tracking-tight md:text-[56px] lg:text-[64px]"
        >
          {product.name}
        </h2>
        <p className="mx-auto mb-6 max-w-xl text-[17px] leading-snug text-current opacity-90 md:text-[21px] md:leading-[1.381]">
          {taglineFromDescription(product.description, 120)}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <Link href={`/shop/${product.slug}`} className={pillPrimary}>
            Buy now
          </Link>
        </div>
      </div>
      <div
        className={
          isRedBricksHero
            ? "relative z-0 mx-auto h-[min(50vh,420px)] w-full max-w-[1400px] md:h-[min(68vh,680px)]"
            : "relative mx-auto h-[min(62vh,560px)] w-full max-w-[1400px] md:h-[min(68vh,680px)]"
        }
      >
        <Image
          src={img}
          alt={
            isRedBricksHero
              ? "Rectangular red partition wall brick for construction"
              : isRiverSandHero
                ? "A grade brown river sand for construction"
                : ""
          }
          fill
          className={
            isRedBricksHero
              ? "object-contain object-bottom !left-[3px] !top-[-32px] !h-[386px] !w-full -my-[34px] px-4 pb-[25px] pt-5 md:px-8"
              : isRiverSandHero
                ? "object-contain object-bottom !inset-auto !left-[72px] !top-[44px] !h-[430px] !w-[408px] !max-w-none -my-3 px-4 pt-6 pb-6 md:px-8"
                : "object-contain object-bottom -my-3 px-4 pb-6 md:px-8"
          }
          sizes="100vw"
          priority={index === 0}
        />
      </div>
    </section>
  );
}

function TileGrid({ items }: { items: Product[] }) {
  return (
    <section className="bg-white py-14 md:py-20">
      <div className="mx-auto max-w-[980px] px-4">
        <h2 className="mb-10 text-center text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]">
          More to explore.
        </h2>
        <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                href={`/shop/${p.slug}`}
                className="group block overflow-hidden rounded-2xl bg-[#f5f5f7] transition hover:opacity-95"
              >
                <div className="relative aspect-[16/10] w-full">
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                  />
                </div>
                <div className="px-4 py-4 text-center">
                  <p className="text-[14px] font-semibold text-[#1d1d1f]">{p.name}</p>
                  <p className="mt-1 text-[12px] text-[#6e6e73]">{p.category}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function AppleHome() {
  const heroProducts: Product[] = products.slice(0, 6);
  const tileProducts: Product[] = products.slice(2, 6);

  return (
    <>
      {heroProducts.map((p, i) => (
        <HeroModule key={p.id} product={p} index={i} />
      ))}
      <TileGrid items={tileProducts} />
    </>
  );
}
