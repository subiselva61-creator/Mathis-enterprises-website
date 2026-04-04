import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatProductPrice } from "@/lib/format";
import { storefrontPillBrand } from "@/lib/storefront-styles";
import { cn } from "@/lib/utils";

function taglineFromDescription(description: string, max = 90) {
  const t = description.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function priceLine(product: Product) {
  const base = formatProductPrice(product);
  if (product.priceOnRequest || !product.priceBasis) return base;
  return `${base} / ${product.priceBasis.toLowerCase()}`;
}

type Props = {
  products: Product[];
  headingId: string;
  scrollListAriaLabel: string;
};

export default function ProductLineup({ products, headingId, scrollListAriaLabel }: Props) {
  if (products.length === 0) return null;

  return (
    <section className="mt-1" aria-labelledby={headingId}>
      <h2
        id={headingId}
        className="text-[28px] font-semibold tracking-tight text-[#1d1d1f] md:text-[32px]"
      >
        Explore the line up
      </h2>

      <div className="-mx-5 mt-8 md:mx-0 lg:mx-0">
        <ul
          className={cn(
            "mt-0 w-full max-w-full list-none pl-0",
            "flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth pb-2 pr-[12%] [-ms-overflow-style:none] [scrollbar-width:none] md:pb-4 [&::-webkit-scrollbar]:hidden",
            "lg:grid lg:snap-none lg:grid-cols-2 lg:gap-x-10 lg:gap-y-14 lg:overflow-visible lg:pb-0 lg:pr-0 xl:grid-cols-3 xl:gap-x-12",
          )}
          aria-label={scrollListAriaLabel}
        >
          {products.map((product) => {
            const href = `/shop/${product.slug}`;
            const img = product.images[0];
            const tagline = taglineFromDescription(product.description);
            const price = priceLine(product);

            return (
              <li
                key={product.id}
                className="box-border w-[88%] min-w-[88%] shrink-0 snap-start snap-always px-5 md:px-0 lg:w-auto lg:min-w-0 lg:snap-none lg:px-0"
              >
                <article
                  className="flex flex-col transition-[transform] duration-300 lg:hover:-translate-y-0.5"
                  data-scroll-card
                >
                  <Link
                    href={href}
                    className="relative isolate block aspect-square w-full max-w-full overflow-hidden rounded-[2rem] bg-[#f5f5f7] transition-[opacity,transform,box-shadow] duration-300 hover:opacity-95 lg:hover:shadow-lg lg:hover:shadow-black/[0.06]"
                  >
                    {img ? (
                      <div className="absolute inset-0 p-3 sm:p-4">
                        <Image
                          src={img}
                          alt={`${product.name} — product photo`}
                          fill
                          className="object-contain object-center"
                          sizes="(max-width: 1023px) 88vw, (max-width: 1279px) 42vw, 28vw"
                        />
                      </div>
                    ) : null}
                  </Link>

                  <div className="px-4 pt-5 sm:px-5">
                    <h3 className="text-[21px] font-semibold leading-tight tracking-tight text-[#1d1d1f] md:text-[24px]">
                      <Link href={href} className="hover:underline">
                        {product.name}
                      </Link>
                    </h3>

                    <p className="mt-2 text-[15px] leading-snug text-[#1d1d1f] md:text-[17px]">
                      {tagline}
                    </p>

                    <p className="mt-3 text-[15px] font-semibold text-[#1d1d1f] md:text-[17px]">
                      {price}
                    </p>

                    <div className="mt-5">
                      <Link href={href} className={storefrontPillBrand}>
                        Buy now
                      </Link>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
