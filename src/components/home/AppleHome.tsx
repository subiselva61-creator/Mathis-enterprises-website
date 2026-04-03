"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Product } from "@/data/products";
import { brickProductsFrom, isBrickProduct } from "@/data/products";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { registerScrollTrigger, ScrollTrigger } from "@/lib/gsap/registerScrollTrigger";
import GradualBlur from "@/components/GradualBlur";
import ShinyText from "@/components/ShinyText";

const pillPrimary =
  "inline-flex min-h-11 items-center justify-center rounded-full bg-[#0027eb] px-6 text-[17px] font-normal leading-none text-white transition-[color,transform] duration-200 hover:bg-[#1e46f4] active:scale-[0.98] md:text-[19px]";

const BROWN_A1_M_SAND_SLUG = "brown-a1-grade-m-sand";

function taglineFromDescription(description: string, max = 90) {
  const t = description.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function sectionIdForHero(product: Product, index: number) {
  return index === 0 ? "home-hero" : `home-${product.slug}`;
}

function HeroModule({
  product,
  index,
  onImageLoad,
  reducedMotion,
}: {
  product: Product;
  index: number;
  onImageLoad?: () => void;
  reducedMotion?: boolean;
}) {
  const img = product.images[0];
  const isRedBricksHero = product.slug === "rectangular-red-partition-wall-bricks";
  const isRiverSandHero = product.slug === "a-grade-brown-river-sand";
  const isBrownA1MSandHero = product.slug === BROWN_A1_M_SAND_SLUG;
  const isFirstHero = index === 0;
  const sectionId = sectionIdForHero(product, index);

  const textBlock = (
    <div
      className={
        isRedBricksHero
          ? "relative z-10 mx-auto w-full max-w-[980px] px-4 pt-10 pb-3 text-center min-h-0 md:min-h-[345px] md:w-[343px] md:px-4 md:pt-[87px] md:pb-8 md:-ml-[18px] md:mr-[45px]"
          : isRiverSandHero
            ? "mx-auto max-w-[980px] -mt-[5px] -mb-[5px] -ml-[6px] -mr-[6px] px-4 pt-10 text-center pb-[15px] md:pb-8 md:pt-14 min-h-[332px]"
            : isBrownA1MSandHero
              ? "mx-auto max-w-[980px] px-4 pt-8 text-center pb-2 md:px-6 md:pb-5 md:pt-12"
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
        {isRedBricksHero && !reducedMotion ? (
          <ShinyText
            text={product.name}
            speed={2.5}
            once
            delay={0}
            color="#2a2a2a"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            pauseOnHover={false}
            disabled={false}
          />
        ) : (
          product.name
        )}
      </h2>
      <p
        className={
          isBrownA1MSandHero
            ? "mx-auto mb-3 max-w-xl text-[17px] leading-snug text-current opacity-90 md:mb-4 md:text-[21px] md:leading-[1.381]"
            : "mx-auto mb-6 max-w-xl text-[17px] leading-snug text-current opacity-90 md:text-[21px] md:leading-[1.381]"
        }
      >
        {taglineFromDescription(product.description, 120)}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
        <Link href={`/shop/${product.slug}`} className={pillPrimary}>
          {isRedBricksHero && !reducedMotion ? (
            <ShinyText
              text="Buy now"
              speed={2.5}
              once
              delay={0}
              color="#dbe4ff"
              shineColor="#ffffff"
              spread={120}
              direction="left"
              pauseOnHover={false}
              disabled={false}
            />
          ) : (
            "Buy now"
          )}
        </Link>
      </div>
    </div>
  );

  const imageBlock = (
    <div
      className={
        isRedBricksHero
          ? "relative z-0 mx-auto h-[min(50vh,420px)] w-full max-w-[1400px] md:h-[min(68vh,680px)]"
          : isRiverSandHero
            ? "relative mx-auto h-[min(56vh,480px)] w-full max-w-[1400px] md:h-[min(68vh,680px)] md:-mt-[119px] md:-mb-[119px]"
            : isBrownA1MSandHero
              ? "relative mx-auto h-[min(40vh,300px)] w-full max-w-[1400px] sm:h-[min(44vh,340px)] md:h-[min(52vh,480px)]"
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
              : isBrownA1MSandHero
                ? "Brown A1 grade M sand pile for construction"
                : ""
        }
        fill
        className={
          isRedBricksHero
            ? "object-contain object-center !inset-0 !h-full !w-full -my-3 px-4 py-5 md:-my-[34px] md:object-bottom md:!inset-auto md:!left-[3px] md:!top-[-32px] md:!h-[386px] md:!w-full md:px-8 md:pb-[25px] md:pt-5"
            : isRiverSandHero
              ? "object-contain object-center !inset-0 !h-full !w-full -my-3 px-4 pt-[85px] pb-5 md:object-bottom md:!inset-auto md:!left-[28px] md:!top-[43px] md:!h-[430px] md:!w-[408px] md:!max-w-none md:px-8 md:pt-6 md:pb-[110px]"
              : isBrownA1MSandHero
                ? "object-contain object-center px-2 pb-4 pt-0 md:px-6 md:pb-6"
                : "object-contain object-bottom -my-3 px-4 pb-6 md:px-8"
        }
        sizes="100vw"
        priority={index === 0}
        style={isBrownA1MSandHero ? { left: 3 } : undefined}
        onLoadingComplete={onImageLoad}
      />
    </div>
  );

  if (isFirstHero) {
    return (
      <section
        id={sectionId}
        data-scroll-section
        className="home-scroll-section bg-white px-4 pb-4 text-[#1d1d1f] md:px-6 md:pb-6"
        aria-labelledby={`hero-${product.slug}`}
      >
        <div className="mx-auto max-w-[1400px]">
          <div data-home-hero-text>{textBlock}</div>
          <div data-home-hero-image>{imageBlock}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={sectionId}
      data-scroll-section
      className={
        isRiverSandHero
          ? "home-scroll-section my-9 min-h-[431px] px-4 pb-4 md:px-6 md:pb-6"
          : "home-scroll-section px-4 pb-4 md:px-6 md:pb-6"
      }
      aria-labelledby={`hero-${product.slug}`}
    >
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-3xl bg-[#f5f5f7] text-[#1d1d1f]">
        <div data-home-reveal>
          {textBlock}
          {imageBlock}
        </div>
      </div>
    </section>
  );
}

function BricksSection({ brickProducts }: { brickProducts: Product[] }) {
  if (brickProducts.length === 0) return null;

  return (
    <section
      id="home-bricks"
      data-scroll-section
      className="home-scroll-section bg-white px-4 pb-4 md:px-6 md:pb-6"
      aria-labelledby="home-bricks-heading"
    >
      <div className="mx-auto max-w-[1400px] overflow-hidden rounded-3xl bg-[#f5f5f7] px-4 py-10 md:px-8 md:py-14">
        <div data-home-reveal>
          <h2
            id="home-bricks-heading"
            className="text-center text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]"
          >
            Bricks
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-[17px] leading-snug text-[#424245] md:text-[19px]">
            Explore all bricks
          </p>
          <ul className="mt-10 grid list-none grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {brickProducts.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/shop/${p.slug}`}
                  className="block rounded-2xl bg-white/80 px-4 py-3.5 text-center text-[15px] font-semibold text-[#1d1d1f] transition hover:opacity-90"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TileGrid({ items, onImageLoad }: { items: Product[]; onImageLoad?: () => void }) {
  return (
    <section
      id="home-explore"
      data-scroll-section
      className="home-scroll-section bg-white px-4 pb-8 md:px-6 md:pb-12"
    >
      <div className="mx-auto max-w-[980px]" data-home-reveal>
        <h2 className="mb-10 text-center text-[32px] font-semibold tracking-tight text-[#1d1d1f] md:text-[40px]">
          More to explore.
        </h2>
        <ul className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2">
          {items.map((p) => (
            <li key={p.id}>
              <Link
                href={`/shop/${p.slug}`}
                className="group block overflow-hidden rounded-3xl bg-[#f5f5f7] transition hover:opacity-95"
              >
                <div className="relative aspect-[16/10] w-full bg-[#f5f5f7]">
                  <Image
                    src={p.images[0]}
                    alt=""
                    fill
                    className="object-contain object-center transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, 50vw"
                    onLoadingComplete={onImageLoad}
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

const RED_PARTITION_BRICK_SLUG = "rectangular-red-partition-wall-bricks";

export default function AppleHome({ products: catalog }: { products: Product[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const brickProducts = brickProductsFrom(catalog);
  const nonBricks = catalog.filter((p) => !isBrickProduct(p));
  const redPartitionHero = catalog.find((p) => p.slug === RED_PARTITION_BRICK_SLUG);
  const heroProducts: Product[] = redPartitionHero
    ? [redPartitionHero, ...nonBricks.slice(0, 5)]
    : nonBricks.slice(0, 6);
  const tileProducts: Product[] = nonBricks.slice(5, 9);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      ScrollTrigger.refresh();
      refreshTimerRef.current = null;
    }, 140);
  }, []);

  useLayoutEffect(() => {
    registerScrollTrigger();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;

    const ctx = gsap.context(() => {
      const first = root.querySelector("#home-hero");
      if (first) {
        const text = first.querySelector("[data-home-hero-text]");
        const imgWrap = first.querySelector("[data-home-hero-image]");
        if (text && imgWrap) {
          gsap.fromTo(
            text,
            { opacity: 1, y: 0 },
            {
              opacity: 0.38,
              y: -26,
              ease: "none",
              scrollTrigger: {
                trigger: first,
                start: "top top",
                end: "bottom center",
                scrub: 0.45,
              },
            }
          );
          gsap.fromTo(
            imgWrap,
            { opacity: 1, y: 0, scale: 1 },
            {
              opacity: 0.88,
              y: 36,
              scale: 0.97,
              ease: "none",
              scrollTrigger: {
                trigger: first,
                start: "top top",
                end: "bottom center",
                scrub: 0.45,
              },
            }
          );
        }
      }

      root.querySelectorAll<HTMLElement>("[data-scroll-section]").forEach((section) => {
        if (section.id === "home-hero") return;
        const reveal = section.querySelector("[data-home-reveal]");
        if (!reveal) return;
        gsap.fromTo(
          reveal,
          { autoAlpha: 0, y: 40 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.85,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    }, root);

    return () => ctx.revert();
  }, [reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    const onResize = () => scheduleRefresh();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [reducedMotion, scheduleRefresh]);

  return (
    <>
      <div ref={rootRef} className="bg-white">
        {heroProducts.map((p, i) => (
          <HeroModule
            key={p.id}
            product={p}
            index={i}
            onImageLoad={reducedMotion ? undefined : scheduleRefresh}
            reducedMotion={reducedMotion}
          />
        ))}
        <BricksSection brickProducts={brickProducts} />
        <TileGrid items={tileProducts} onImageLoad={reducedMotion ? undefined : scheduleRefresh} />
      </div>
      <GradualBlur
        target="page"
        position="bottom"
        height="4rem"
        strength={2}
        divCount={5}
        curve="bezier"
        exponential
        opacity={1}
        style={{ zIndex: 40 }}
      />
    </>
  );
}
