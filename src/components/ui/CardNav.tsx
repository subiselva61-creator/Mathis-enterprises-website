"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CardNavLink = {
  label: string;
  href: string;
  ariaLabel: string;
  external?: boolean;
};

export type CardNavItem = {
  label: string;
  bgColor: string;
  textColor: string;
  links: CardNavLink[];
};

export interface CardNavProps {
  logo: string;
  logoAlt?: string;
  brandName?: string;
  items: CardNavItem[];
  className?: string;
  ease?: string;
  baseColor?: string;
  menuColor?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  endSlot?: React.ReactNode;
}

const CardNav: React.FC<CardNavProps> = ({
  logo,
  logoAlt = "Logo",
  brandName,
  items,
  className = "",
  ease = "power3.out",
  baseColor = "#fff",
  menuColor,
  endSlot,
}) => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const calculateHeight = () => {
    const navEl = navRef.current;
    if (!navEl) return 260;
    return 260;
  };

  const createTimeline = () => {
    const navEl = navRef.current;
    if (!navEl) return null;

    gsap.set(navEl, { height: 60, overflow: "hidden" });
    gsap.set(cardsRef.current, { y: 50, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    tl.to(navEl, {
      height: calculateHeight,
      duration: 0.4,
      ease,
    });

    tl.to(
      cardsRef.current,
      { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 },
      "-=0.1",
    );

    return tl;
  };

  useLayoutEffect(() => {
    const tl = createTimeline();
    tlRef.current = tl;

    return () => {
      tl?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ease, items]);

  useLayoutEffect(() => {
    const handleResize = () => {
      if (!tlRef.current) return;

      if (isExpanded) {
        const newHeight = calculateHeight();
        gsap.set(navRef.current, { height: newHeight });

        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          newTl.progress(1);
          tlRef.current = newTl;
        }
      } else {
        tlRef.current.kill();
        const newTl = createTimeline();
        if (newTl) {
          tlRef.current = newTl;
        }
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExpanded]);

  const toggleMenu = () => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!isExpanded) {
      setIsHamburgerOpen(true);
      setIsExpanded(true);
      tl.play(0);
    } else {
      setIsHamburgerOpen(false);
      tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
      tl.reverse();
    }
  };

  const closeMenu = () => {
    const tl = tlRef.current;
    if (!tl || !isExpanded) return;
    setIsHamburgerOpen(false);
    tl.eventCallback("onReverseComplete", () => setIsExpanded(false));
    tl.reverse();
  };

  const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
    if (el) cardsRef.current[i] = el;
  };

  return (
    <div
      className={cn(
        "fixed left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] z-[100] top-[1.2em]",
        className,
      )}
    >
      <nav
        ref={navRef}
        className={cn(
          "block h-[60px] p-0 rounded-xl shadow-md relative overflow-hidden will-change-[height]",
          isExpanded && "open",
        )}
        style={{ backgroundColor: baseColor }}
      >
        <div className="absolute inset-x-0 top-0 h-[60px] flex items-center justify-between p-2 pl-[1.1rem] z-[2]">
          <div
            className={cn(
              "group h-full flex flex-col items-center justify-center cursor-pointer gap-[6px]",
            )}
            onClick={toggleMenu}
            role="button"
            aria-label={isExpanded ? "Close menu" : "Open menu"}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleMenu();
              }
            }}
            style={{ color: menuColor || "#000" }}
          >
            <div
              className={cn(
                "w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%]",
                isHamburgerOpen
                  ? "translate-y-[4px] rotate-45"
                  : "",
                "group-hover:opacity-75",
              )}
            />
            <div
              className={cn(
                "w-[30px] h-[2px] bg-current transition-[transform,opacity,margin] duration-300 ease-linear [transform-origin:50%_50%]",
                isHamburgerOpen
                  ? "-translate-y-[4px] -rotate-45"
                  : "",
                "group-hover:opacity-75",
              )}
            />
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            aria-label="Home"
            onClick={closeMenu}
          >
            <Image
              src={logo}
              alt={logoAlt}
              width={28}
              height={28}
              className="h-[28px] w-[28px] rounded-sm object-cover"
              priority
            />
            {brandName && (
              <span
                className="whitespace-nowrap text-[14px] font-semibold tracking-tight"
                style={{ color: menuColor || "#000" }}
              >
                {brandName}
              </span>
            )}
          </Link>

          {endSlot && (
            <div className="flex items-center gap-1">{endSlot}</div>
          )}
        </div>

        <div
          className={cn(
            "absolute left-0 right-0 top-[60px] bottom-0 p-2 flex items-end gap-[12px] justify-start z-[1]",
            isExpanded
              ? "visible pointer-events-auto"
              : "invisible pointer-events-none",
          )}
          aria-hidden={!isExpanded}
        >
          {(items || []).slice(0, 3).map((item, idx) => (
            <div
              key={`${item.label}-${idx}`}
              className="select-none relative flex flex-col gap-2 p-[12px_16px] rounded-[calc(0.75rem-0.2rem)] min-w-0 flex-[1_1_0%] h-full"
              ref={setCardRef(idx)}
              style={{ backgroundColor: item.bgColor, color: item.textColor }}
            >
              <div className="font-normal tracking-[-0.5px] text-[22px]">
                {item.label}
              </div>
              <div className="mt-auto flex flex-col gap-[2px]">
                {item.links?.map((lnk, i) =>
                  lnk.external ? (
                    <a
                      key={`${lnk.label}-${i}`}
                      className="inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[16px]"
                      href={lnk.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={lnk.ariaLabel}
                      style={{ color: item.textColor }}
                    >
                      <ArrowUpRight
                        className="shrink-0 h-4 w-4"
                        aria-hidden="true"
                      />
                      {lnk.label}
                    </a>
                  ) : (
                    <Link
                      key={`${lnk.label}-${i}`}
                      className="inline-flex items-center gap-[6px] no-underline cursor-pointer transition-opacity duration-300 hover:opacity-75 text-[16px]"
                      href={lnk.href}
                      aria-label={lnk.ariaLabel}
                      style={{ color: item.textColor }}
                      onClick={closeMenu}
                    >
                      <ArrowUpRight
                        className="shrink-0 h-4 w-4"
                        aria-hidden="true"
                      />
                      {lnk.label}
                    </Link>
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default CardNav;
