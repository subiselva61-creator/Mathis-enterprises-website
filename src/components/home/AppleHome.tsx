"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import type { Product } from "@/data/products";
import { brickProductsFrom, isBrickProduct } from "@/data/products";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { registerScrollTrigger, ScrollTrigger } from "@/lib/gsap/registerScrollTrigger";
import GradualBlur from "@/components/GradualBlur";
import ShinyText from "@/components/ShinyText";
import MaterialsCarousel from "@/components/home/MaterialsCarousel";
import { storefrontPillApplePrimary, storefrontPillAppleSecondary } from "@/lib/storefront-styles";
import { BUSINESS_NAME, PRIMARY_CITY, productPhotoAlt } from "@/lib/site";

const RED_PARTITION_BRICK_SLUG = "rectangular-red-partition-wall-bricks";

function taglineFromDescription(description: string, max = 120) {
  const t = description.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function HeroModule({
  product,
  onImageLoad,
  reducedMotion,
}: {
  product: Product;
  onImageLoad?: () => void;
  reducedMotion?: boolean;
}) {
  const img = product.images[0];
  const isRedBricksHero = product.slug === RED_PARTITION_BRICK_SLUG;

  const textBlock = (
    <div className="relative z-10 mx-auto w-full max-w-[980px] px-4 pb-4 pt-12 text-center lg:mx-0 lg:max-w-none lg:text-left lg:px-6 lg:pt-16 lg:pb-8">
      <h1
        id="home-primary-heading"
        className="mx-auto mb-3 max-w-[min(100%,36rem)] text-[21px] font-semibold leading-tight tracking-tight text-[#1d1d1f] lg:mx-0 lg:mb-4 lg:text-[28px]"
      >
        {BUSINESS_NAME} — bulk building materials supplier, {PRIMARY_CITY}
      </h1>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6e6e73] lg:text-sm lg:font-medium lg:normal-case lg:tracking-normal">
        {product.category}
      </p>
      <h2
        id={`hero-${product.slug}`}
        className="mb-3 text-[34px] font-semibold leading-[1.05] tracking-tight text-[#1d1d1f] lg:mb-4 lg:text-[56px] xl:text-[64px]"
      >
        {isRedBricksHero && !reducedMotion ? (
          <>
            <span className="md:hidden">{product.name}</span>
            <span className="hidden md:inline">
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
            </span>
          </>
        ) : (
          product.name
        )}
      </h2>
      <p className="mx-auto mb-8 max-w-xl text-[17px] leading-relaxed text-[#424245] lg:mx-0 lg:mb-10 lg:text-[21px] lg:leading-[1.381]">
        {taglineFromDescription(product.description)}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start lg:gap-4">
        <Link href={`/shop/${product.slug}`} className={storefrontPillAppleSecondary}>
          View product
        </Link>
        <Link href={`/shop/${product.slug}`} className={storefrontPillApplePrimary}>
          {isRedBricksHero && !reducedMotion ? (
            <>
              <span className="md:hidden">Buy now</span>
              <span className="hidden md:inline">
                <ShinyText
                  text="Buy now"
                  speed={2.5}
                  once
                  delay={0}
                  color="#ffffff"
                  shineColor="#e8f0ff"
                  spread={120}
                  direction="left"
                  pauseOnHover={false}
                  disabled={false}
                />
              </span>
            </>
          ) : (
            "Buy now"
          )}
        </Link>
      </div>
    </div>
  );

  const imageBlock = (
    <div className="relative z-0 mx-auto h-[min(52vh,440px)] w-full lg:h-[480px]">
      <div className="relative h-full w-full">
        <Image
          src={img}
          alt={productPhotoAlt(product, "hero")}
          fill
          className="object-contain object-center !inset-0 !h-full !w-full -my-3 px-4 py-5 lg:my-0 lg:px-4 lg:py-4"
          sizes="(min-width: 1024px) 50vw, 100vw"
          priority
          onLoadingComplete={onImageLoad}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[38%] bg-gradient-to-t from-white from-25% to-transparent"
          aria-hidden
        />
      </div>
    </div>
  );

  return (
    <section
      id="home-hero"
      data-scroll-section
      className="home-scroll-section bg-white px-4 pb-6 text-[#1d1d1f] md:px-6 md:pb-6"
      aria-labelledby="home-primary-heading"
    >
      <div className="mx-auto max-w-[1400px] lg:flex lg:items-center lg:gap-8">
        <div data-home-hero-image className="lg:w-1/2 lg:flex-shrink-0">{imageBlock}</div>
        <div data-home-hero-text className="lg:w-1/2 lg:flex-shrink-0">{textBlock}</div>
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

function WholesaleValuePropsSection() {
  return (
    <section
      id="home-wholesale"
      data-scroll-section
      className="home-scroll-section bg-white px-4 pb-8 md:px-6 md:pb-10"
      aria-labelledby="home-wholesale-heading"
    >
      <div className="mx-auto max-w-[min(1120px,calc(100%-2rem))]" data-home-reveal>
        <h2
          id="home-wholesale-heading"
          className="text-center text-[28px] font-semibold tracking-tight text-[#1d1d1f] md:text-[36px]"
        >
          Wholesale distribution &amp; project supply
        </h2>
        <ul className="mx-auto mt-6 max-w-2xl list-disc space-y-2 pl-5 text-[17px] leading-relaxed text-[#424245] md:mt-8 md:text-[19px]">
          <li>
            <strong className="font-semibold text-[#1d1d1f]">Construction procurement</strong> — short-list SKUs on this
            site, then confirm freight, MOQ, and GST-ready quotes before dispatch.
          </li>
          <li>
            <strong className="font-semibold text-[#1d1d1f]">Industrial-grade materials</strong> — where a listing notes
            IS certification or grade, verify the same on your purchase order and delivery challan.
          </li>
          <li>
            <strong className="font-semibold text-[#1d1d1f]">Project supply chain</strong> — bulk cement, steel, bricks,
            sand, and aggregates routed through our IndiaMART-backed catalog and phone line.
          </li>
        </ul>
        <p className="mx-auto mt-6 max-w-2xl text-center text-[15px] text-[#6e6e73] md:mt-8">
          Serving contractors and builders across Chennai and Tamil Nadu — see{" "}
          <Link href="/service-areas" className="font-medium text-[#0027eb] underline-offset-2 hover:underline">
            service areas
          </Link>
          .
        </p>
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
      <div className="mx-auto max-w-[min(1120px,calc(100%-2rem))]" data-home-reveal>
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
                    alt={productPhotoAlt(p, "card")}
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

export default function AppleHome({ products: catalog }: { products: Product[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [blurPortalEl, setBlurPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setBlurPortalEl(document.body);
  }, []);

  const brickProducts = brickProductsFrom(catalog);
  const nonBricks = catalog.filter((p) => !isBrickProduct(p));
  const redPartitionHero = catalog.find((p) => p.slug === RED_PARTITION_BRICK_SLUG);

  const heroProduct: Product | undefined = redPartitionHero ?? nonBricks[0];
  const carouselProducts: Product[] = redPartitionHero
    ? nonBricks.slice(0, 5)
    : nonBricks.slice(1, 6);

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
        {heroProduct ? (
          <HeroModule
            key={heroProduct.id}
            product={heroProduct}
            onImageLoad={reducedMotion ? undefined : scheduleRefresh}
            reducedMotion={reducedMotion}
          />
        ) : null}
        <MaterialsCarousel
          products={carouselProducts}
          onImageLoad={reducedMotion ? undefined : scheduleRefresh}
          reducedMotion={reducedMotion}
        />
        <WholesaleValuePropsSection />
        <BricksSection brickProducts={brickProducts} />
        <TileGrid items={tileProducts} onImageLoad={reducedMotion ? undefined : scheduleRefresh} />
      </div>
      {blurPortalEl && !reducedMotion
        ? createPortal(
            <GradualBlur
              target="page"
              position="bottom"
              height="4rem"
              strength={2}
              divCount={5}
              curve="bezier"
              exponential
              opacity={1}
              style={{ zIndex: 55 }}
            />,
            blurPortalEl,
          )
        : null}
    </>
  );
}
