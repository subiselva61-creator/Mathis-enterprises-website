import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/products";
import { formatProductPrice } from "@/lib/format";

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

const pillCta =
  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#0027eb] px-6 text-[17px] font-normal leading-none text-white transition-[color,transform] duration-200 hover:bg-[#1e46f4] active:scale-[0.98] md:text-[19px]";

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

      <div className="-mx-5 mt-8 md:mx-0">
        <ul
          className="flex w-full max-w-full list-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth pb-2 pl-0 pr-[12%] [-ms-overflow-style:none] [scrollbar-width:none] md:pb-4 [&::-webkit-scrollbar]:hidden"
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
                className="w-[88%] min-w-[88%] shrink-0 snap-start snap-always box-border px-5 md:px-0"
              >
                <article className="flex flex-col" data-scroll-card>
                  <Link
                    href={href}
                    className="relative isolate block aspect-square w-full max-w-full overflow-hidden rounded-[2rem] bg-[#f5f5f7] transition-opacity hover:opacity-95"
                  >
                    {img ? (
                      <div className="absolute inset-0 p-3 sm:p-4">
                        <Image
                          src={img}
                          alt={`${product.name} — product photo`}
                          fill
                          className="object-contain object-center"
                          sizes="(max-width: 768px) 88vw, min(1120px, 90vw)"
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
                      <Link href={href} className={pillCta}>
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
