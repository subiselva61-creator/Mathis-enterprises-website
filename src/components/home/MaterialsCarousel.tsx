"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/data/products";
import { storefrontPillApplePrimary } from "@/lib/storefront-styles";
import { cn } from "@/lib/utils";

const AUTOPLAY_MS = 6000;

function taglineFromDescription(description: string, max = 120) {
  const t = description.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trim()}…`;
}

function CarouselPlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={14} height={14} viewBox="0 0 14 14" aria-hidden>
      <path fill="currentColor" d="M4 2.5 L11.5 7 4 11.5Z" />
    </svg>
  );
}

function CarouselPauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width={14} height={14} viewBox="0 0 14 14" aria-hidden>
      <rect x={3} y={2.5} width={2.75} height={9} rx={0.5} fill="currentColor" />
      <rect x={8.25} y={2.5} width={2.75} height={9} rx={0.5} fill="currentColor" />
    </svg>
  );
}

function computeCenteredCardIndex(scroller: HTMLDivElement): number {
  const cards = [...scroller.querySelectorAll<HTMLElement>("[data-carousel-card]")];
  if (cards.length === 0) return 0;
  const viewportCenter = scroller.scrollLeft + scroller.clientWidth / 2;
  let best = 0;
  let bestDist = Infinity;
  cards.forEach((card, i) => {
    const left = card.offsetLeft;
    const w = card.offsetWidth;
    const c = left + w / 2;
    const d = Math.abs(c - viewportCenter);
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  });
  return best;
}

type MaterialsCarouselProps = {
  products: Product[];
  onImageLoad?: () => void;
  reducedMotion?: boolean;
};

export default function MaterialsCarousel({
  products,
  onImageLoad,
  reducedMotion,
}: MaterialsCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);
  const [progress, setProgress] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState(() => new Set<number>());

  const scrollToIndex = useCallback(
    (index: number, instant = false) => {
      const el = scrollerRef.current;
      if (!el) return;
      const cards = el.querySelectorAll<HTMLElement>("[data-carousel-card]");
      const card = cards[Math.max(0, Math.min(index, cards.length - 1))];
      if (!card) return;
      const cardLeft = card.offsetLeft;
      const cardWidth = card.offsetWidth;
      const targetLeft = cardLeft - (el.clientWidth - cardWidth) / 2;
      const maxLeft = Math.max(0, el.scrollWidth - el.clientWidth);
      const nextLeft = Math.max(0, Math.min(targetLeft, maxLeft));
      el.scrollTo({
        left: nextLeft,
        behavior: reducedMotion || instant ? "auto" : "smooth",
      });
    },
    [reducedMotion]
  );

  const handleSlideImageLoad = useCallback(
    (slideIndex: number) => {
      setLoadedSlides((prev) => {
        if (prev.has(slideIndex)) return prev;
        const next = new Set(prev);
        next.add(slideIndex);
        return next;
      });
      onImageLoad?.();
    },
    [onImageLoad]
  );

  const syncActiveFromScroll = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setActiveIndex(computeCenteredCardIndex(el));
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    syncActiveFromScroll();
    el.addEventListener("scroll", syncActiveFromScroll, { passive: true });
    const ro = new ResizeObserver(() => syncActiveFromScroll());
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", syncActiveFromScroll);
      ro.disconnect();
    };
  }, [products, syncActiveFromScroll]);

  /** Reset bar when the centered slide changes (swipe, autoplay advance, or dot click). */
  useEffect(() => {
    setProgress(0);
  }, [activeIndex]);

  /** Fill the active pill over AUTOPLAY_MS; advance when full. Waits until the slide image has loaded. */
  const activeSlideImageReady = loadedSlides.has(activeIndex);
  useEffect(() => {
    if (reducedMotion || !isPlaying || products.length < 2) return;
    if (!activeSlideImageReady) return;

    let cancelled = false;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const elapsed = now - start;
      const p = Math.min(1, elapsed / AUTOPLAY_MS);
      setProgress(p);
      if (p >= 1) {
        const el = scrollerRef.current;
        const i = el ? computeCenteredCardIndex(el) : activeIndex;
        scrollToIndex((i + 1) % products.length);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [reducedMotion, isPlaying, products.length, activeIndex, activeSlideImageReady, scrollToIndex]);

  useEffect(() => {
    if (reducedMotion) setIsPlaying(false);
  }, [reducedMotion]);

  const prevPlayingRef = useRef(isPlaying);
  useEffect(() => {
    const wasPlaying = prevPlayingRef.current;
    prevPlayingRef.current = isPlaying;
    if (isPlaying && !wasPlaying) setProgress(0);
  }, [isPlaying]);

  if (products.length === 0) return null;

  const showPlayback = !reducedMotion && products.length > 1;

  return (
    <section
      id="home-materials-carousel"
      data-scroll-section
      className="home-scroll-section bg-white px-0 pb-6 pt-2 md:px-6 md:pb-8"
      aria-labelledby="home-materials-heading"
    >
      <div
        className="mx-auto max-w-[1400px] rounded-none bg-[#f5f5f7] px-4 py-10 text-[#1d1d1f] md:rounded-3xl md:px-8 md:py-14"
        data-home-reveal
      >
        <h2
          id="home-materials-heading"
          className="text-[28px] font-semibold leading-tight tracking-tight text-[#1d1d1f] md:text-[40px]"
        >
          Take a closer look.
        </h2>
        <p className="mt-2 max-w-xl text-[17px] leading-snug text-[#424245] md:mt-3 md:text-[19px]">
          Swipe through featured construction materials — sand, blocks, and ready-mix.
        </p>

        <div
          ref={scrollerRef}
          className="materials-carousel-scroller -mx-4 mt-8 flex snap-x snap-mandatory gap-3 overflow-x-auto overflow-y-hidden px-[7.5vw] pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:px-[max(1.5rem,calc((100%-min(85vw,24rem))/2))]"
        >
          {products.map((product, slideIndex) => {
            const img = product.images[0];
            return (
              <article
                key={product.id}
                id={`home-${product.slug}`}
                data-carousel-card
                className="w-[85vw] max-w-sm shrink-0 snap-center"
                aria-labelledby={`carousel-${product.slug}-title`}
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-white">
                  <Image
                    src={img}
                    alt={product.name}
                    fill
                    className="object-contain object-center p-3"
                    sizes="85vw"
                    priority={slideIndex === 0}
                    onLoadingComplete={() => handleSlideImageLoad(slideIndex)}
                  />
                </div>
                <div className="px-1 pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6e6e73]">
                    {product.category}
                  </p>
                  <h3
                    id={`carousel-${product.slug}-title`}
                    className="mt-1 text-[22px] font-semibold leading-tight tracking-tight text-[#1d1d1f]"
                  >
                    {product.name}
                  </h3>
                  <p className="mt-2 text-[17px] leading-snug text-[#424245]">
                    {taglineFromDescription(product.description)}
                  </p>
                  <div className="mt-4">
                    <Link href={`/shop/${product.slug}`} className={storefrontPillApplePrimary}>
                      Buy now
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex w-full flex-nowrap items-center justify-center gap-4">
          <div
            className="flex min-w-0 shrink items-center gap-2.5"
            role="tablist"
            aria-label="Carousel slides"
          >
            {products.map((_, i) => {
              const isActive = i === activeIndex;
              const distance = Math.abs(i - activeIndex);

              if (isActive) {
                const fillRatio = reducedMotion ? 1 : progress;
                const showIndeterminate = !reducedMotion && isPlaying && !loadedSlides.has(i);

                return (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected
                    aria-label={`Slide ${i + 1}, current${isPlaying && loadedSlides.has(i) ? `, ${Math.round(progress * 100)}% until next` : ""}`}
                    className="relative h-[5px] w-9 shrink-0 appearance-none overflow-hidden rounded-full border-0 bg-[#d2d2d7] shadow-none outline-none transition-[width] duration-300 focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f5f7]"
                    onClick={() => scrollToIndex(i, true)}
                  >
                    <span
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full bg-[#0071e3] shadow-none",
                        showIndeterminate && "w-[32%] animate-pulse"
                      )}
                      style={showIndeterminate ? undefined : { width: `${fillRatio * 100}%` }}
                      aria-hidden
                    />
                  </button>
                );
              }

              const opacityClass =
                distance === 1 ? "opacity-70" : distance === 2 ? "opacity-50" : "opacity-35";

              return (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  aria-selected={false}
                  aria-label={`Go to slide ${i + 1}`}
                  className={cn(
                    "h-[5px] w-[5px] shrink-0 appearance-none rounded-full border-0 bg-[#86868b] shadow-none outline-none transition-[opacity,transform] duration-200 hover:scale-125 hover:opacity-100",
                    opacityClass,
                    "focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f5f7]"
                  )}
                  onClick={() => scrollToIndex(i, true)}
                />
              );
            })}
          </div>

          {showPlayback ? (
            <button
              type="button"
              className="flex h-9 w-9 shrink-0 appearance-none items-center justify-center rounded-full border-0 bg-[#e8e8ed] text-[#1d1d1f] shadow-none outline-none transition-[color,background-color,transform] duration-200 hover:bg-[#dedee2] active:scale-[0.96] focus-visible:ring-2 focus-visible:ring-[#0071e3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f5f7]"
              aria-label={isPlaying ? "Pause automatic slideshow" : "Play automatic slideshow"}
              aria-pressed={isPlaying}
              onClick={() => setIsPlaying((p) => !p)}
            >
              {isPlaying ? (
                <CarouselPauseIcon className="shrink-0" />
              ) : (
                <CarouselPlayIcon className="ml-px shrink-0" />
              )}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
