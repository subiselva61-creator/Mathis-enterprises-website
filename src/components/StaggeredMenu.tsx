"use client";

import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";

function isInternalPath(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

function smNumOpacityVars(opacity: number): gsap.TweenVars {
  return { "--sm-num-opacity": opacity } as gsap.TweenVars;
}

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  /** Used for items without `children`, or as a fallback URL. */
  link: string;
  /** When set, tapping this row opens a full in-panel drill-down (Apple-style) instead of navigating. */
  children?: StaggeredMenuItem[];
}
export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}
export interface StaggeredMenuProps {
  position?: 'left' | 'right';
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  /** Extra controls (e.g. search, cart) between logo and menu toggle */
  endSlot?: React.ReactNode;
  /** Applied to the outer scope wrapper (e.g. z-index) */
  scopeClassName?: string;
  /** Extra classes on the top bar (e.g. frosted background) */
  headerClassName?: string;
  logoUrl?: string;
  /** Shown to the right of the logo (e.g. company name) */
  brandName?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  isFixed?: boolean;
  changeMenuColorOnOpen?: boolean;
  closeOnClickAway?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  position = 'right',
  colors = ['#B19EEF', '#5227FF'],
  items = [],
  socialItems = [],
  displaySocials = true,
  displayItemNumbering = false,
  className,
  endSlot,
  scopeClassName,
  headerClassName,
  logoUrl = '/src/assets/logos/reactbits-gh-white.svg',
  brandName,
  menuButtonColor = '#fff',
  openMenuButtonColor = '#fff',
  changeMenuColorOnOpen = true,
  accentColor = '#5227FF',
  isFixed = false,
  closeOnClickAway = true,
  onMenuOpen,
  onMenuClose
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  /** Top-level index whose `children` are shown in the drill-down layer. */
  const [drilledIndex, setDrilledIndex] = useState<number | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const preLayersRef = useRef<HTMLDivElement | null>(null);
  const preLayerElsRef = useRef<HTMLElement[]>([]);

  const plusHRef = useRef<HTMLSpanElement | null>(null);
  const plusVRef = useRef<HTMLSpanElement | null>(null);
  const iconRef = useRef<HTMLSpanElement | null>(null);

  const textInnerRef = useRef<HTMLSpanElement | null>(null);
  const textWrapRef = useRef<HTMLSpanElement | null>(null);
  const [textLines, setTextLines] = useState<string[]>(['Menu', 'Close']);

  const openTlRef = useRef<gsap.core.Timeline | null>(null);
  const closeTweenRef = useRef<gsap.core.Tween | null>(null);
  const spinTweenRef = useRef<gsap.core.Timeline | null>(null);
  const textCycleAnimRef = useRef<gsap.core.Tween | null>(null);
  const colorTweenRef = useRef<gsap.core.Tween | null>(null);

  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);
  const drillBackRef = useRef<HTMLButtonElement | null>(null);
  const busyRef = useRef(false);

  const itemEntranceTweenRef = useRef<gsap.core.Tween | null>(null);

  const resetPanelClosedState = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const itemEls = Array.from(panel.querySelectorAll(".sm-panel-itemLabel")) as HTMLElement[];
    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });

    const numberEls = Array.from(
      panel.querySelectorAll(".sm-panel-list[data-numbering] .sm-panel-item")
    ) as HTMLElement[];
    if (numberEls.length) gsap.set(numberEls, smNumOpacityVars(0));

    const socialTitle = panel.querySelector(".sm-socials-title") as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll(".sm-socials-link")) as HTMLElement[];
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    busyRef.current = false;
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const panel = panelRef.current;
      const preContainer = preLayersRef.current;

      const plusH = plusHRef.current;
      const plusV = plusVRef.current;
      const icon = iconRef.current;
      const textInner = textInnerRef.current;

      if (!panel || !plusH || !plusV || !icon || !textInner) return;

      let preLayers: HTMLElement[] = [];
      if (preContainer) {
        preLayers = Array.from(preContainer.querySelectorAll('.sm-prelayer')) as HTMLElement[];
      }
      preLayerElsRef.current = preLayers;

      const offscreen = position === 'left' ? -100 : 100;
      gsap.set([panel, ...preLayers], { xPercent: offscreen });

      gsap.set(plusH, { transformOrigin: '50% 50%', rotate: 0 });
      gsap.set(plusV, { transformOrigin: '50% 50%', rotate: 90 });
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });

      gsap.set(textInner, { yPercent: 0 });

      if (toggleBtnRef.current) gsap.set(toggleBtnRef.current, { color: menuButtonColor });
    });
    return () => ctx.revert();
  }, [menuButtonColor, position]);

  const buildOpenTimeline = useCallback(() => {
    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return null;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    openTlRef.current?.kill();
    if (closeTweenRef.current) {
      closeTweenRef.current.kill();
      closeTweenRef.current = null;
    }
    itemEntranceTweenRef.current?.kill();

    const itemEls = Array.from(panel.querySelectorAll('.sm-panel-itemLabel')) as HTMLElement[];
    const numberEls = Array.from(
      panel.querySelectorAll('.sm-panel-list[data-numbering] .sm-panel-item')
    ) as HTMLElement[];
    const socialTitle = panel.querySelector('.sm-socials-title') as HTMLElement | null;
    const socialLinks = Array.from(panel.querySelectorAll('.sm-socials-link')) as HTMLElement[];

    const layerStates = layers.map(el => ({ el, start: Number(gsap.getProperty(el, 'xPercent')) }));
    const panelStart = Number(gsap.getProperty(panel, 'xPercent'));

    if (itemEls.length) gsap.set(itemEls, { yPercent: 140, rotate: 10 });
    if (numberEls.length) gsap.set(numberEls, smNumOpacityVars(0));
    if (socialTitle) gsap.set(socialTitle, { opacity: 0 });
    if (socialLinks.length) gsap.set(socialLinks, { y: 25, opacity: 0 });

    const tl = gsap.timeline({ paused: true });

    const layerDur = reduceMotion ? 0.04 : 0.07;
    const layerStagger = reduceMotion ? 0 : 0.012;

    layerStates.forEach((ls, i) => {
      tl.fromTo(
        ls.el,
        { xPercent: ls.start },
        { xPercent: 0, duration: layerDur, ease: "power2.out" },
        i * layerStagger
      );
    });

    const lastTime = layerStates.length ? (layerStates.length - 1) * layerStagger : 0;
    const panelInsertTime = lastTime + (layerStates.length ? 0.01 : 0);
    const panelDuration = reduceMotion ? 0.04 : 0.09;

    tl.fromTo(
      panel,
      { xPercent: panelStart },
      { xPercent: 0, duration: panelDuration, ease: "power2.out" },
      panelInsertTime
    );

    if (itemEls.length) {
      const itemsStartRatio = 0.08;
      const itemsStart = panelInsertTime + panelDuration * itemsStartRatio;
      const itemDuration = reduceMotion ? 0.03 : 0.09;
      const staggerEach = reduceMotion ? 0 : Math.min(0.012, 0.06 / Math.max(1, itemEls.length));

      tl.to(
        itemEls,
        {
          yPercent: 0,
          rotate: 0,
          duration: itemDuration,
          ease: reduceMotion ? "none" : "power2.out",
          stagger: { each: staggerEach, from: "start" },
          onComplete: () => {
            if (!reduceMotion) gsap.set(itemEls, { clearProps: "willChange" });
          },
        },
        itemsStart
      );

      if (numberEls.length) {
        tl.to(
          numberEls,
          {
            duration: reduceMotion ? 0.03 : 0.07,
            ease: reduceMotion ? "none" : "power2.out",
            ...smNumOpacityVars(1),
            stagger: { each: reduceMotion ? 0 : 0.01, from: "start" },
          },
          itemsStart + (reduceMotion ? 0 : 0.02)
        );
      }
    }

    if (socialTitle || socialLinks.length) {
      const socialsStart = panelInsertTime + panelDuration * 0.12;

      if (socialTitle)
        tl.to(
          socialTitle,
          { opacity: 1, duration: reduceMotion ? 0.03 : 0.07, ease: reduceMotion ? "none" : "power2.out" },
          socialsStart
        );
      if (socialLinks.length) {
        tl.to(
          socialLinks,
          {
            y: 0,
            opacity: 1,
            duration: reduceMotion ? 0.03 : 0.08,
            ease: reduceMotion ? "none" : "power2.out",
            stagger: { each: reduceMotion ? 0 : 0.01, from: "start" },
            onComplete: () => {
              gsap.set(socialLinks, { clearProps: "opacity" });
            },
          },
          socialsStart + (reduceMotion ? 0 : 0.01)
        );
      }
    }

    openTlRef.current = tl;
    return tl;
  }, []);

  const playOpen = useCallback(() => {
    if (busyRef.current) return;
    busyRef.current = true;
    const tl = buildOpenTimeline();
    if (tl) {
      tl.eventCallback('onComplete', () => {
        busyRef.current = false;
      });
      tl.play(0);
    } else {
      busyRef.current = false;
    }
  }, [buildOpenTimeline]);

  const playClose = useCallback(() => {
    openTlRef.current?.kill();
    openTlRef.current = null;
    itemEntranceTweenRef.current?.kill();

    const panel = panelRef.current;
    const layers = preLayerElsRef.current;
    if (!panel) return;

    const all: HTMLElement[] = [...layers, panel];
    closeTweenRef.current?.kill();

    const offscreen = position === 'left' ? -100 : 100;

    closeTweenRef.current = gsap.to(all, {
      xPercent: offscreen,
      duration: 0.09,
      ease: "power2.in",
      overwrite: "auto",
      onComplete: () => {
        resetPanelClosedState();
      },
    });
  }, [position, resetPanelClosedState]);

  const animateIcon = useCallback((opening: boolean) => {
    const icon = iconRef.current;
    const h = plusHRef.current;
    const v = plusVRef.current;
    if (!icon || !h || !v) return;

    spinTweenRef.current?.kill();

    if (opening) {
      // ensure container never rotates
      gsap.set(icon, { rotate: 0, transformOrigin: '50% 50%' });
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power2.out" } })
        .to(h, { rotate: 45, duration: 0.1 }, 0)
        .to(v, { rotate: -45, duration: 0.1 }, 0);
    } else {
      spinTweenRef.current = gsap
        .timeline({ defaults: { ease: "power2.inOut" } })
        .to(h, { rotate: 0, duration: 0.08 }, 0)
        .to(v, { rotate: 90, duration: 0.08 }, 0)
        .to(icon, { rotate: 0, duration: 0.001 }, 0);
    }
  }, []);

  const animateColor = useCallback(
    (opening: boolean) => {
      const btn = toggleBtnRef.current;
      if (!btn) return;
      colorTweenRef.current?.kill();
      if (changeMenuColorOnOpen) {
        const targetColor = opening ? openMenuButtonColor : menuButtonColor;
        colorTweenRef.current = gsap.to(btn, { color: targetColor, delay: 0, duration: 0.06, ease: "power2.out" });
      } else {
        gsap.set(btn, { color: menuButtonColor });
      }
    },
    [openMenuButtonColor, menuButtonColor, changeMenuColorOnOpen]
  );

  React.useEffect(() => {
    if (toggleBtnRef.current) {
      if (changeMenuColorOnOpen) {
        const targetColor = openRef.current ? openMenuButtonColor : menuButtonColor;
        gsap.set(toggleBtnRef.current, { color: targetColor });
      } else {
        gsap.set(toggleBtnRef.current, { color: menuButtonColor });
      }
    }
  }, [changeMenuColorOnOpen, menuButtonColor, openMenuButtonColor]);

  const animateText = useCallback((opening: boolean) => {
    const inner = textInnerRef.current;
    if (!inner) return;

    textCycleAnimRef.current?.kill();

    const targetLabel = opening ? "Close" : "Menu";
    setTextLines([targetLabel]);
    gsap.set(inner, { yPercent: 0 });
  }, []);

  const toggleMenu = useCallback(() => {
    const target = !openRef.current;
    openRef.current = target;
    setOpen(target);

    if (target) {
      onMenuOpen?.();
      playOpen();
    } else {
      onMenuClose?.();
      playClose();
    }

    animateIcon(target);
    animateColor(target);
    animateText(target);
  }, [playOpen, playClose, animateIcon, animateColor, animateText, onMenuOpen, onMenuClose]);

  const closeMenu = useCallback(
    (opts?: { instant?: boolean }) => {
      if (!openRef.current) return;
      const instant = opts?.instant ?? false;

      openRef.current = false;
      setOpen(false);
      setDrilledIndex(null);
      onMenuClose?.();

      openTlRef.current?.kill();
      openTlRef.current = null;
      itemEntranceTweenRef.current?.kill();
      spinTweenRef.current?.kill();
      colorTweenRef.current?.kill();

      if (instant) {
        closeTweenRef.current?.kill();
        closeTweenRef.current = null;

        const panel = panelRef.current;
        const layers = preLayerElsRef.current;
        const offscreen = position === "left" ? -100 : 100;
        if (panel) {
          gsap.set([...layers, panel], { xPercent: offscreen });
          resetPanelClosedState();
        } else {
          busyRef.current = false;
        }

        const h = plusHRef.current;
        const v = plusVRef.current;
        const icon = iconRef.current;
        if (h && v && icon) {
          gsap.set(h, { rotate: 0 });
          gsap.set(v, { rotate: 90 });
          gsap.set(icon, { rotate: 0 });
        }
      } else {
        playClose();
        animateIcon(false);
      }

      animateColor(false);
      animateText(false);
    },
    [playClose, animateIcon, animateColor, animateText, onMenuClose, position, resetPanelClosedState, setDrilledIndex]
  );

  React.useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(event.target as Node)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeOnClickAway, open, closeMenu]);

  React.useEffect(() => {
    if (!open) setDrilledIndex(null);
  }, [open]);

  const drilledItem = drilledIndex !== null ? items[drilledIndex] : null;
  const drillChildren = drilledItem?.children;

  React.useEffect(() => {
    if (drilledIndex === null) return;
    const id = requestAnimationFrame(() => drillBackRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [drilledIndex]);

  return (
    <div
      className={`sm-scope z-40 pointer-events-none ${scopeClassName ?? ""} ${isFixed ? "fixed top-0 left-0 w-screen h-screen overflow-hidden" : "h-full w-full"}`}
    >
      <div
        className={
          (className ? className + ' ' : '') + 'staggered-menu-wrapper pointer-events-none relative w-full h-full z-40'
        }
        style={accentColor ? ({ "--sm-accent": accentColor } as React.CSSProperties) : undefined}
        data-position={position}
        data-open={open || undefined}
      >
        <div
          ref={preLayersRef}
          className="sm-prelayers absolute top-0 right-0 bottom-0 pointer-events-none z-[5]"
          aria-hidden="true"
        >
          {(() => {
            const raw = colors && colors.length ? colors.slice(0, 4) : ["#1e1e22", "#35353c"];
            const arr = [...raw];
            if (arr.length >= 3) {
              const mid = Math.floor(arr.length / 2);
              arr.splice(mid, 1);
            }
            return arr.map((c, i) => (
              <div
                key={i}
                className="sm-prelayer absolute top-0 right-0 h-full w-full translate-x-0"
                style={{ background: c }}
              />
            ));
          })()}
        </div>

        <header
          className={`staggered-menu-header absolute top-0 left-0 w-full flex items-center justify-between gap-3 px-4 py-3 md:px-8 md:py-6 pointer-events-none z-20 ${headerClassName ?? ""}`}
          aria-label="Main navigation header"
        >
          {!open ? (
            <Link
              href="/"
              className="sm-logo flex min-w-0 max-w-[min(100%,18rem)] shrink items-center gap-2 select-none pointer-events-auto"
              aria-label={brandName ? `${brandName} home` : "Home"}
              onClick={() => closeMenu({ instant: true })}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- logo URL is configurable and may be non-optimized */}
              <img
                src={logoUrl || "/src/assets/logos/reactbits-gh-white.svg"}
                alt={brandName ? `${brandName} logo` : "Site logo"}
                className="sm-logo-img block h-8 w-auto max-h-9 shrink-0 object-contain"
                draggable={false}
                width={110}
                height={24}
              />
              {brandName ? (
                <span className="truncate p-0 -my-[26px] text-[0.8125rem] font-semibold leading-tight tracking-tight text-[#1d1d1f] sm:text-sm">
                  {brandName}
                </span>
              ) : null}
            </Link>
          ) : null}

          <div className="pointer-events-auto ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            {!open ? endSlot : null}
          <button
            ref={toggleBtnRef}
            className={`sm-toggle relative inline-flex items-center gap-[0.3rem] bg-transparent border-0 cursor-pointer font-medium leading-none overflow-visible pointer-events-auto ${
              open ? "text-black" : ""
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="staggered-menu-panel"
            onClick={toggleMenu}
            type="button"
          >
            <span
              ref={textWrapRef}
              className="sm-toggle-textWrap relative inline-block h-[1em] overflow-hidden whitespace-nowrap w-[var(--sm-toggle-width,auto)] min-w-[var(--sm-toggle-width,auto)]"
              aria-hidden="true"
            >
              <span ref={textInnerRef} className="sm-toggle-textInner flex flex-col leading-none">
                {textLines.map((l, i) => (
                  <span className="sm-toggle-line block h-[1em] leading-none" key={i}>
                    {l}
                  </span>
                ))}
              </span>
            </span>

            <span
              ref={iconRef}
              className="sm-icon relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center [will-change:transform]"
              aria-hidden="true"
            >
              <span
                ref={plusHRef}
                className="sm-icon-line absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
              />
              <span
                ref={plusVRef}
                className="sm-icon-line sm-icon-line-v absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2 [will-change:transform]"
              />
            </span>
          </button>
          </div>
        </header>

        <aside
          id="staggered-menu-panel"
          ref={panelRef}
          className="staggered-menu-panel absolute top-0 right-0 z-10 flex h-full flex-col bg-[#fbfbfd] pointer-events-auto overflow-y-auto"
          aria-hidden={!open}
        >
          <div className="sm-panel-inner flex min-h-0 flex-1 flex-col">
            {/* Two full-width layers (avoids 200% flex column rounding / clipping with overflow-x on body) */}
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <div
                className={`sm-panel-layer-root absolute inset-0 flex flex-col overflow-y-auto transition-transform duration-75 ease-out motion-reduce:transition-none ${
                  drilledIndex === null ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                  <ul
                    className="sm-panel-list list-none m-0 flex flex-col gap-2 p-0"
                    role="list"
                    data-numbering={displayItemNumbering || undefined}
                  >
                    {items && items.length ? (
                      items.map((it, idx) => {
                        const itemClass =
                          "sm-panel-item relative inline-block cursor-pointer text-black font-semibold uppercase leading-none tracking-[-2px] no-underline pr-[1.4em] transition-[background,color,opacity] duration-150 ease-linear active:opacity-75 max-w-full text-[clamp(2.25rem,12vw,3.75rem)] min-[420px]:text-[clamp(2.75rem,10vw,4rem)]";
                        const label = (
                          <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                            {it.label}
                          </span>
                        );
                        const hasChildren = Boolean(it.children?.length);

                        if (hasChildren) {
                          return (
                            <li
                              className="sm-panel-itemWrap relative overflow-visible leading-none"
                              key={it.label + idx}
                            >
                              <button
                                type="button"
                                className={`${itemClass} w-full text-left bg-transparent border-0 p-0 font-semibold`}
                                aria-label={it.ariaLabel}
                                aria-haspopup="true"
                                data-index={idx + 1}
                                onClick={() => setDrilledIndex(idx)}
                              >
                                {label}
                                <span
                                  className="pointer-events-none absolute right-[0.12em] top-1/2 inline-block h-0 w-0 border-y-[0.35em] border-l-[0.45em] border-y-transparent border-l-[#1d1d1f] opacity-45"
                                  style={{ transform: "translateY(-50%)" }}
                                  aria-hidden
                                />
                              </button>
                            </li>
                          );
                        }

                        return (
                          <li className="sm-panel-itemWrap relative overflow-visible leading-none" key={it.label + idx}>
                            {isInternalPath(it.link) ? (
                              <Link
                                href={it.link}
                                className={itemClass}
                                aria-label={it.ariaLabel}
                                data-index={idx + 1}
                                onClick={() => closeMenu({ instant: true })}
                              >
                                {label}
                              </Link>
                            ) : (
                              <a
                                className={itemClass}
                                href={it.link}
                                aria-label={it.ariaLabel}
                                data-index={idx + 1}
                                onClick={() => closeMenu()}
                              >
                                {label}
                              </a>
                            )}
                          </li>
                        );
                      })
                    ) : (
                      <li className="sm-panel-itemWrap relative overflow-visible leading-none" aria-hidden="true">
                        <span className="sm-panel-item relative inline-block cursor-default pr-[1.4em] text-[clamp(2.25rem,12vw,3.75rem)] font-semibold uppercase leading-none tracking-[-2px] text-black min-[420px]:text-[clamp(2.75rem,10vw,4rem)]">
                          <span className="sm-panel-itemLabel inline-block [transform-origin:50%_100%] will-change-transform">
                            No items
                          </span>
                        </span>
                      </li>
                    )}
                  </ul>

                  {displaySocials && socialItems && socialItems.length > 0 && (
                    <div className="sm-socials mt-auto flex flex-col gap-3 pt-8" aria-label="Social links">
                      <h3 className="sm-socials-title m-0 text-base font-medium [color:var(--sm-accent,#ff0000)]">
                        Socials
                      </h3>
                      <ul
                        className="sm-socials-list m-0 flex list-none flex-row flex-wrap items-center gap-4 p-0"
                        role="list"
                      >
                        {socialItems.map((s, i) => (
                          <li key={s.label + i} className="sm-socials-item">
                            <a
                              href={s.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="sm-socials-link relative inline-block py-[2px] text-[1.2rem] font-medium text-[#111] no-underline transition-[color,opacity] duration-300 ease-linear"
                            >
                              {s.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>

              <div
                className={`sm-panel-layer-drill absolute inset-0 flex flex-col overflow-y-auto pl-0 transition-transform duration-75 ease-out motion-reduce:transition-none ${
                  drilledIndex === null ? "translate-x-full pointer-events-none" : "translate-x-0"
                }`}
                aria-hidden={drilledIndex === null}
              >
                  {drilledItem && drillChildren?.length ? (
                    <div className="sm-drill-view flex flex-col pb-4">
                      <button
                        ref={drillBackRef}
                        type="button"
                        className="sm-drill-back mb-5 flex w-max items-center gap-0.5 rounded-md border-0 bg-transparent py-2 pl-0 pr-3 text-[1.0625rem] font-normal text-[#1d1d1f] transition-opacity duration-150 hover:opacity-65 active:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--sm-accent,#0071e3)]"
                        onClick={() => setDrilledIndex(null)}
                        aria-label="Back to main menu"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.25"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="shrink-0 opacity-90"
                          aria-hidden
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                      <p className="m-0 mb-4 text-xs font-semibold uppercase tracking-wide text-[#6e6e73]">
                        {drilledItem.label}
                      </p>
                      <ul className="m-0 flex list-none flex-col gap-1 p-0" role="list">
                        {isInternalPath(drilledItem.link) ? (
                          <li key="__explore-all">
                            <Link
                              href={drilledItem.link}
                              className="sm-drill-link block rounded-lg py-2.5 pr-2 text-[1.625rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1d1d1f] no-underline transition-[color,opacity] duration-150 hover:text-[var(--sm-accent,#0071e3)] active:opacity-75 sm:text-[1.875rem]"
                              aria-label={`Explore all ${drilledItem.label}`}
                              onClick={() => closeMenu({ instant: true })}
                            >
                              Explore all {drilledItem.label.toLowerCase()}
                            </Link>
                          </li>
                        ) : null}
                        {drillChildren.map((sub, sidx) => (
                          <li key={sub.label + sidx}>
                            {isInternalPath(sub.link) ? (
                              <Link
                                href={sub.link}
                                className="sm-drill-link block rounded-lg py-2.5 pr-2 text-[1.625rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1d1d1f] no-underline transition-[color,opacity] duration-150 hover:text-[var(--sm-accent,#0071e3)] active:opacity-75 sm:text-[1.875rem]"
                                aria-label={sub.ariaLabel}
                                onClick={() => closeMenu({ instant: true })}
                              >
                                {sub.label}
                              </Link>
                            ) : (
                              <a
                                href={sub.link}
                                className="sm-drill-link block rounded-lg py-2.5 pr-2 text-[1.625rem] font-semibold leading-[1.15] tracking-[-0.02em] text-[#1d1d1f] no-underline transition-[color,opacity] duration-150 hover:text-[var(--sm-accent,#0071e3)] active:opacity-75 sm:text-[1.875rem]"
                                aria-label={sub.ariaLabel}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => closeMenu()}
                              >
                                {sub.label}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex-1" aria-hidden />
                  )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <style>{`
.sm-scope .staggered-menu-wrapper { position: relative; width: 100%; height: 100%; z-index: 40; pointer-events: none; }
.sm-scope .staggered-menu-header { position: absolute; top: 0; left: 0; width: 100%; display: flex; align-items: center; justify-content: space-between; pointer-events: none; z-index: 20; }
.sm-scope .staggered-menu-header > * { pointer-events: auto; }
.sm-scope .sm-logo { display: flex; align-items: center; gap: 0.5rem; user-select: none; }
.sm-scope .sm-logo-img { display: block; height: 32px; width: auto; object-fit: contain; }
.sm-scope .sm-toggle { position: relative; display: inline-flex; align-items: center; gap: 0.3rem; background: transparent; border: none; cursor: pointer; font-weight: 500; line-height: 1; overflow: visible; }
.sm-scope .sm-toggle:focus-visible { outline: 2px solid #ffffffaa; outline-offset: 4px; border-radius: 4px; }
.sm-scope .sm-line:last-of-type { margin-top: 6px; }
.sm-scope .sm-toggle-textWrap { position: relative; margin-right: 0.5em; display: inline-block; height: 1em; overflow: hidden; white-space: nowrap; width: var(--sm-toggle-width, auto); min-width: var(--sm-toggle-width, auto); }
.sm-scope .sm-toggle-textInner { display: flex; flex-direction: column; line-height: 1; }
.sm-scope .sm-toggle-line { display: block; height: 1em; line-height: 1; }
.sm-scope .sm-icon { position: relative; width: 14px; height: 14px; flex: 0 0 14px; display: inline-flex; align-items: center; justify-content: center; will-change: transform; }
.sm-scope .sm-panel-itemWrap { position: relative; overflow: visible; line-height: 1; }
.sm-scope .sm-icon-line { position: absolute; left: 50%; top: 50%; width: 100%; height: 2px; background: currentColor; border-radius: 2px; transform: translate(-50%, -50%); will-change: transform; }
.sm-scope .sm-line { display: none !important; }
.sm-scope .staggered-menu-panel { position: absolute; top: 0; right: 0; width: clamp(260px, 38vw, 420px); height: 100%; background: #fbfbfd; display: flex; flex-direction: column; padding: 6em max(1.25rem, env(safe-area-inset-right, 0px)) 2em max(1.25rem, env(safe-area-inset-left, 0px)); overflow-y: auto; z-index: 10; scrollbar-width: none; -ms-overflow-style: none; box-sizing: border-box; }
.sm-scope .staggered-menu-panel::-webkit-scrollbar { display: none; }
.sm-scope [data-position='left'] .staggered-menu-panel { right: auto; left: 0; }
.sm-scope .sm-prelayers { position: absolute; top: 0; right: 0; bottom: 0; width: clamp(260px, 38vw, 420px); pointer-events: none; z-index: 5; }
.sm-scope [data-position='left'] .sm-prelayers { right: auto; left: 0; }
.sm-scope .sm-prelayer { position: absolute; top: 0; right: 0; height: 100%; width: 100%; transform: translateX(0); }
.sm-scope .sm-panel-inner { flex: 1; display: flex; flex-direction: column; gap: 1.25rem; }
.sm-scope .sm-socials { margin-top: auto; padding-top: 2rem; display: flex; flex-direction: column; gap: 0.75rem; }
.sm-scope .sm-socials-title { margin: 0; font-size: 1rem; font-weight: 500; color: var(--sm-accent, #ff0000); }
.sm-scope .sm-socials-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; gap: 1rem; flex-wrap: wrap; }
.sm-scope .sm-socials-list .sm-socials-link { opacity: 1; transition: opacity 0.3s ease; }
.sm-scope .sm-socials-list:hover .sm-socials-link:not(:hover) { opacity: 0.35; }
.sm-scope .sm-socials-list:focus-within .sm-socials-link:not(:focus-visible) { opacity: 0.35; }
.sm-scope .sm-socials-list .sm-socials-link:hover,
.sm-scope .sm-socials-list .sm-socials-link:focus-visible { opacity: 1; }
.sm-scope .sm-socials-link:focus-visible { outline: 2px solid var(--sm-accent, #ff0000); outline-offset: 3px; }
.sm-scope .sm-socials-link { font-size: 1.2rem; font-weight: 500; color: #111; text-decoration: none; position: relative; padding: 2px 0; display: inline-block; transition: color 0.3s ease, opacity 0.3s ease; }
.sm-scope .sm-socials-link:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-title { margin: 0; font-size: 1rem; font-weight: 600; color: #fff; text-transform: uppercase; }
.sm-scope .sm-panel-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.5rem; }
.sm-scope .sm-panel-item { position: relative; color: #000; font-weight: 600; cursor: pointer; line-height: 1; letter-spacing: -2px; text-transform: uppercase; transition: background 0.25s, color 0.25s; display: inline-block; text-decoration: none; padding-right: 1.4em; }
.sm-scope .sm-panel-itemLabel { display: inline-block; will-change: transform; transform-origin: 50% 100%; }
.sm-scope .sm-panel-item:hover { color: var(--sm-accent, #ff0000); }
.sm-scope .sm-panel-list[data-numbering] { counter-reset: smItem; }
.sm-scope .sm-panel-list[data-numbering] .sm-panel-item::after { counter-increment: smItem; content: counter(smItem, decimal-leading-zero); position: absolute; top: 0.1em; right: 3.2em; font-size: 18px; font-weight: 400; color: var(--sm-accent, #ff0000); letter-spacing: 0; pointer-events: none; user-select: none; opacity: var(--sm-num-opacity, 0); }
@media (max-width: 1024px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; max-width: 100%; padding-left: max(1.25rem, env(safe-area-inset-left, 0px)); padding-right: max(1.25rem, env(safe-area-inset-right, 0px)); } }
@media (max-width: 640px) { .sm-scope .staggered-menu-panel { width: 100%; left: 0; right: 0; max-width: 100%; padding-left: max(1.25rem, env(safe-area-inset-left, 0px)); padding-right: max(1.25rem, env(safe-area-inset-right, 0px)); } }
      `}</style>
    </div>
  );
};

export default StaggeredMenu;
