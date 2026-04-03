"use client";

import { usePathname } from "next/navigation";
import { useCallback, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { registerScrollTrigger, ScrollTrigger } from "@/lib/gsap/registerScrollTrigger";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function isInsideHomeHero(el: Element): boolean {
  return Boolean(el.closest("#home-hero"));
}

function isAppleHomeControlled(el: Element): boolean {
  return (
    el.closest("[data-home-reveal]") !== null ||
    el.closest("[data-home-hero-text]") !== null ||
    el.closest("[data-home-hero-image]") !== null
  );
}

export default function SiteScrollExperience({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    refreshTimerRef.current = setTimeout(() => {
      refreshTimerRef.current = null;
      ScrollTrigger.refresh();
    }, 120);
  }, []);

  useLayoutEffect(() => {
    registerScrollTrigger();
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion || !rootRef.current) return;

    const root = rootRef.current;
    const isAdmin = pathname.startsWith("/admin");
    const blobY = isAdmin ? 0.45 : 1;
    const titleMul = isAdmin ? 0.35 : 1;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("[data-parallax-blob]").forEach((blob, i) => {
        const depth = (0.14 + i * 0.08) * blobY;
        const xEnd = (i % 2 === 0 ? 1 : -1) * (isAdmin ? 14 : 32);
        const rotEnd = (i % 2 === 0 ? 1 : -1) * (isAdmin ? 2 : 5);
        gsap.fromTo(
          blob,
          { y: 0, x: 0, rotation: 0 },
          {
            y: () => -(ScrollTrigger.maxScroll(window) || 0) * depth,
            x: xEnd,
            rotation: rotEnd,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: isAdmin ? 1.6 : 1.05,
              invalidateOnRefresh: true,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>(".page-container .pageTitle").forEach((el) => {
        if (isInsideHomeHero(el) || isAppleHomeControlled(el)) return;
        gsap.fromTo(
          el,
          { y: 0, opacity: 1 },
          {
            y: -20 * titleMul,
            opacity: 0.9,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 110px",
              end: "bottom 15%",
              scrub: 0.55,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>(".page-container .pageLead").forEach((el) => {
        if (isAppleHomeControlled(el)) return;
        gsap.fromTo(
          el,
          { y: 0, opacity: 1 },
          {
            y: -12 * titleMul,
            opacity: 0.94,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 120px",
              end: "bottom 18%",
              scrub: 0.6,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>(".page-container section h2").forEach((el) => {
        if (isAppleHomeControlled(el)) return;
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: isAdmin ? 16 : 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: isAdmin ? 0.5 : 0.72,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true,
            },
          },
        );
      });

      const cards = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-scroll-card]"),
      ).filter((el) => !isInsideHomeHero(el) && !isAppleHomeControlled(el));

      ScrollTrigger.batch(cards, {
        interval: 0.12,
        batchMax: 8,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: isAdmin ? 20 : 40, x: (i) => (i % 2 === 0 ? -10 : 10) * titleMul },
            {
              autoAlpha: 1,
              y: 0,
              x: 0,
              duration: isAdmin ? 0.42 : 0.62,
              stagger: isAdmin ? 0.05 : 0.09,
              ease: "power2.out",
              overwrite: true,
            },
          );
        },
        start: "top 90%",
        once: true,
      });

      root.querySelectorAll<HTMLElement>("[data-scroll-pdp-hero]").forEach((el) => {
        if (isInsideHomeHero(el)) return;
        const mul = isAdmin ? 0.4 : 1;
        gsap.fromTo(
          el,
          { y: 0, scale: 1 },
          {
            y: 52 * mul,
            scale: 1 - 0.05 * mul,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 90px",
              end: "bottom -15%",
              scrub: 0.65,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-scroll-pdp-detail]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: isAdmin ? 14 : 22 },
          {
            autoAlpha: 1,
            y: 0,
            duration: isAdmin ? 0.5 : 0.7,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      const footerCols = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll("[data-scroll-footer-col]"),
      );
      ScrollTrigger.batch(footerCols, {
        interval: 0.1,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { autoAlpha: 0, y: isAdmin ? 12 : 22 },
            {
              autoAlpha: 1,
              y: 0,
              duration: isAdmin ? 0.4 : 0.55,
              stagger: 0.08,
              ease: "power2.out",
              overwrite: true,
            },
          );
        },
        start: "top 93%",
        once: true,
      });

      root.querySelectorAll<HTMLElement>("[data-scroll-cart-summary]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-scroll-shop-toolbar]").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 16 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 94%",
              once: true,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-admin-root] h1").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.45,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
          },
        );
      });

      root.querySelectorAll<HTMLElement>("[data-admin-product-rows] > li").forEach((el) => {
        gsap.fromTo(
          el,
          { autoAlpha: 0, x: -6 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.32,
            ease: "power2.out",
            immediateRender: false,
            scrollTrigger: {
              trigger: el,
              start: "top 97%",
              once: true,
            },
          },
        );
      });
    }, root);

    scheduleRefresh();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => ScrollTrigger.refresh());
    });

    return () => {
      ctx.revert();
    };
  }, [pathname, reducedMotion, scheduleRefresh]);

  useLayoutEffect(() => {
    if (reducedMotion) return;
    window.addEventListener("resize", scheduleRefresh, { passive: true });
    return () => window.removeEventListener("resize", scheduleRefresh);
  }, [reducedMotion, scheduleRefresh]);

  return (
    <div
      ref={rootRef}
      className="site-scroll-experience relative flex min-h-0 flex-1 flex-col"
    >
      <div className="relative z-[1] flex min-h-0 flex-1 flex-col">{children}</div>
      {!reducedMotion ? (
        <div
          className="site-parallax-atmosphere pointer-events-none fixed inset-0 z-[40] overflow-hidden mix-blend-soft-light"
          aria-hidden
        >
          <div
            data-parallax-blob
            className="site-parallax-blob site-parallax-blob--a absolute rounded-full bg-[#7b8cff] opacity-[0.55] blur-[88px]"
          />
          <div
            data-parallax-blob
            className="site-parallax-blob site-parallax-blob--b absolute rounded-full bg-[#ff8cc8] opacity-[0.5] blur-[80px]"
          />
          <div
            data-parallax-blob
            className="site-parallax-blob site-parallax-blob--c absolute rounded-full bg-[#5fd4b8] opacity-[0.45] blur-[72px]"
          />
        </div>
      ) : null}
    </div>
  );
}
