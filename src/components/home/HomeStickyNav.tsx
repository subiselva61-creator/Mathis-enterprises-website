"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

export type HomeNavItem = { id: string; label: string };

type HomeStickyNavProps = {
  items: HomeNavItem[];
};

function getScrollSpyOffset(): number {
  const root = document.documentElement;
  const cs = getComputedStyle(root);
  const h = Number.parseFloat(cs.getPropertyValue("--site-header-height")) || 44;
  const n = Number.parseFloat(cs.getPropertyValue("--home-sticky-nav-height")) || 44;
  return h + n + 6;
}

export default function HomeStickyNav({ items }: HomeStickyNavProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [activeId, setActiveId] = useState<string | null>(() => items[0]?.id ?? null);
  const rafRef = useRef<number | null>(null);

  const updateActive = useCallback(() => {
    if (items.length === 0) return;
    const y = window.scrollY + getScrollSpyOffset();
    let current = items[0].id;
    for (const { id } of items) {
      const el = document.getElementById(id);
      if (!el) continue;
      const top = el.getBoundingClientRect().top + window.scrollY;
      if (top <= y) current = id;
    }
    setActiveId((prev) => (prev === current ? prev : current));
  }, [items]);

  useEffect(() => {
    const onScrollOrResize = () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        updateActive();
      });
    };
    const mountRaf = requestAnimationFrame(() => {
      updateActive();
    });
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      cancelAnimationFrame(mountRaf);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [updateActive]);

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
  };

  if (items.length === 0) return null;

  return (
    <nav
      className="home-sticky-nav sticky z-[90] border-b border-black/[0.06] bg-[rgba(251,251,253,0.92)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(251,251,253,0.82)]"
      aria-label="On this page"
    >
      <div className="home-sticky-nav-scroll flex items-stretch gap-1 overflow-x-auto px-3 py-2 md:justify-center md:gap-0 md:px-4 lg:mx-auto lg:max-w-[1120px] lg:px-6 xl:px-8">
        {items.map(({ id, label }) => {
          const isActive = activeId === id;
          return (
            <a
              key={id}
              href={`#${id}`}
              onClick={(e) => onNavClick(e, id)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-normal tracking-tight transition-colors md:px-4",
                isActive
                  ? "bg-[#1d1d1f] text-white"
                  : "text-[#1d1d1f] opacity-75 hover:opacity-100"
              )}
            >
              {label}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
