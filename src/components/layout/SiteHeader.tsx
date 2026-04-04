"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Search, ShoppingBag, User, X } from "lucide-react";
import { gsap } from "gsap";
import StaggeredMenu from "@/components/StaggeredMenu";
import { useCart } from "@/components/cart/cart-context";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import { cn } from "@/lib/utils";

const BRAND_NAME = "Mathi Enterprises";

function isDesktopNavActive(pathname: string, href: string): boolean {
  if (href.startsWith("http")) return false;
  if (href === "/") return pathname === "/";
  if (href === "/shop") return pathname === "/shop" || pathname.startsWith("/shop/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

function desktopNavLinkClass(active: boolean) {
  return cn(
    "whitespace-nowrap text-[12px] tracking-tight text-[#1d1d1f] transition-[opacity,transform] duration-200 ease-out",
    "relative inline-block pb-0.5 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-[#0071e3] after:transition-transform after:duration-300 after:ease-out after:content-['']",
    active
      ? "font-semibold opacity-100 after:scale-x-100"
      : "font-normal opacity-90 after:origin-left after:scale-x-0 hover:opacity-100 hover:after:scale-x-100",
  );
}

const centerNav: { href: string; label: string; external?: boolean }[] = [
  { href: "/shop", label: "Catalog" },
  { href: "/bricks", label: "BRICKS" },
  { href: "/aggregates", label: "AGGREGATES" },
  { href: "/sand", label: "SAND" },
  { href: "/cement", label: "CEMENT" },
  { href: "/contact", label: "Contact" },
  { href: "https://www.indiamart.com/mathi-enterprises-tamilnadu/", label: "IndiaMART", external: true },
];

function UserNavLink({ isSignedIn }: { isSignedIn: boolean }) {
  return (
    <Link
      href={isSignedIn ? "/account" : "/login"}
      className="relative flex h-10 w-10 items-center justify-center text-[#1d1d1f] opacity-90 transition-opacity duration-150 hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] md:h-9 md:w-9"
      aria-label={isSignedIn ? "Account" : "Sign in"}
    >
      <User className="h-[19px] w-[19px]" strokeWidth={1.5} />
    </Link>
  );
}

function CartBadgeLink() {
  const { itemCount, isReady } = useCart();
  return (
    <Link
      href="/cart"
      className="relative flex h-10 w-10 items-center justify-center text-[#1d1d1f] opacity-90 transition-opacity duration-150 hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] md:h-9 md:w-9"
      aria-label={
        isReady && itemCount > 0
          ? `Shopping bag, ${itemCount > 99 ? "99+" : itemCount} items`
          : "Shopping bag"
      }
    >
      <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.5} />
      {isReady && itemCount > 0 ? (
        <span className="absolute right-1 top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-[#1d1d1f] px-0.5 text-[9px] font-bold leading-none text-white">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}

/** Matches StaggeredMenu mobile prelayer palette (middle tone omitted like sm-prelayers). */
const SEARCH_OVERLAY_PRELAYERS = ["#e8e8ed", "#c4c4cc"] as const;

type SearchQuickLink = { label: string; href: string; external?: boolean };

function SearchOpenButton({
  className,
  onOpen,
}: {
  className?: string;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "inline-flex h-10 w-10 cursor-pointer items-center justify-center border-0 bg-transparent p-0 text-[#1d1d1f] opacity-90 shadow-none ring-0 transition-opacity duration-150 [-webkit-appearance:none] appearance-none hover:opacity-100 active:opacity-65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] [&::-moz-focus-inner]:border-0 md:h-9 md:w-9",
        className
      )}
      aria-label="Search store"
      aria-haspopup="dialog"
    >
      <Search className="h-[19px] w-[19px]" strokeWidth={1.5} />
    </button>
  );
}

function AppleStyleSearchOverlay({
  open,
  onClose,
  quickLinks,
}: {
  open: boolean;
  onClose: () => void;
  quickLinks: SearchQuickLink[];
}) {
  const router = useRouter();
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const animTlRef = useRef<gsap.core.Timeline | null>(null);
  const [draft, setDraft] = useState("");
  /** Stays true until close animation finishes so the panel can animate out. */
  const [shouldMount, setShouldMount] = useState(false);

  const submitSearch = useCallback(() => {
    const q = draft.trim();
    onClose();
    setDraft("");
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/shop");
    }
  }, [draft, onClose, router]);

  useEffect(() => {
    if (open) setShouldMount(true);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setDraft("");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!open && !shouldMount) return;
    const root = rootRef.current;
    if (!root) return;

    animTlRef.current?.kill();
    animTlRef.current = null;

    const prelayers = Array.from(root.querySelectorAll(".search-overlay-prelayer")) as HTMLElement[];
    const surface = root.querySelector(".search-overlay-surface") as HTMLElement | null;
    const closeEl = root.querySelector("[data-search-close]") as HTMLElement | null;
    const formEl = root.querySelector("[data-search-form]") as HTMLElement | null;
    const quickTitle = root.querySelector("[data-search-quick-title]") as HTMLElement | null;
    const linkEls = Array.from(root.querySelectorAll("[data-search-link]")) as HTMLElement[];

    if (!surface) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactMotion =
      typeof window !== "undefined" &&
      (window.matchMedia("(max-width: 768px)").matches ||
        window.matchMedia("(pointer: coarse)").matches);

    if (open) {
      gsap.set([...prelayers, surface], { xPercent: 100 });
      const labelOrigin = { transformOrigin: "50% 100%" as const };
      if (closeEl) gsap.set(closeEl, { opacity: 0, y: -14 });
      if (formEl) gsap.set(formEl, { ...labelOrigin, yPercent: 140, rotate: 10, opacity: 1 });
      if (quickTitle) gsap.set(quickTitle, { ...labelOrigin, yPercent: 140, rotate: 10 });
      if (linkEls.length)
        gsap.set(linkEls, { ...labelOrigin, yPercent: 140, rotate: 10, opacity: 1 });

      if (reduceMotion) {
        gsap.set([...prelayers, surface], { xPercent: 0 });
        if (closeEl) gsap.set(closeEl, { opacity: 1, y: 0 });
        if (formEl) gsap.set(formEl, { yPercent: 0, rotate: 0, opacity: 1 });
        if (quickTitle) gsap.set(quickTitle, { yPercent: 0, rotate: 0 });
        if (linkEls.length) gsap.set(linkEls, { yPercent: 0, rotate: 0, opacity: 1 });
        requestAnimationFrame(() => inputRef.current?.focus());
        return () => {
          animTlRef.current?.kill();
          animTlRef.current = null;
        };
      }

      const preDur = compactMotion ? 0.2 : 0.5;
      const preStagger = compactMotion ? 0.03 : 0.07;
      const preGap = compactMotion ? 0.04 : 0.08;
      const panelDuration = compactMotion ? 0.3 : 0.65;
      const contentDur = compactMotion ? 0.34 : 1;
      const closeDur = compactMotion ? 0.22 : 0.45;
      const linkStagger = compactMotion ? 0.03 : 0.1;

      const tl = gsap.timeline({
        defaults: { ease: "power4.out" },
        onComplete: () => {
          requestAnimationFrame(() => inputRef.current?.focus());
        },
      });

      prelayers.forEach((layer, i) => {
        tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: preDur }, i * preStagger);
      });

      const lastPreT = prelayers.length ? (prelayers.length - 1) * preStagger : 0;
      const surfaceStart = lastPreT + (prelayers.length ? preGap : 0);

      tl.fromTo(surface, { xPercent: 100 }, { xPercent: 0, duration: panelDuration }, surfaceStart);

      const contentStart = surfaceStart + panelDuration * (compactMotion ? 0.12 : 0.15);

      if (closeEl) {
        tl.to(closeEl, { opacity: 1, y: 0, duration: closeDur, ease: "power3.out" }, contentStart);
      }
      if (formEl) {
        tl.to(
          formEl,
          { yPercent: 0, rotate: 0, duration: contentDur, ease: "power4.out" },
          contentStart + 0.04
        );
      }
      if (quickTitle) {
        tl.to(
          quickTitle,
          { yPercent: 0, rotate: 0, duration: contentDur, ease: "power4.out" },
          contentStart + 0.1
        );
      }
      if (linkEls.length) {
        tl.to(
          linkEls,
          {
            yPercent: 0,
            rotate: 0,
            duration: contentDur,
            ease: "power4.out",
            stagger: { each: linkStagger, from: "start" },
          },
          contentStart + 0.16
        );
      }

      animTlRef.current = tl;
      tl.play(0);
    } else {
      if (reduceMotion) {
        queueMicrotask(() => setShouldMount(false));
        return () => {
          animTlRef.current?.kill();
          animTlRef.current = null;
        };
      }

      const outLinkDur = compactMotion ? 0.14 : 0.28;
      const outLinkSt = compactMotion ? 0.02 : 0.04;
      const outTitleDur = compactMotion ? 0.14 : 0.26;
      const outFormDur = compactMotion ? 0.16 : 0.3;
      const outCloseDur = compactMotion ? 0.14 : 0.22;
      const outSurfaceDur = compactMotion ? 0.2 : 0.34;
      const outPreDur = compactMotion ? 0.18 : 0.3;
      const outPreSt = compactMotion ? 0.03 : 0.05;

      const tl = gsap.timeline({
        defaults: { ease: "power3.in" },
        onComplete: () => setShouldMount(false),
      });

      tl.to(linkEls, { yPercent: 90, rotate: 6, duration: outLinkDur, stagger: { each: outLinkSt, from: "end" } }, 0);
      if (quickTitle) tl.to(quickTitle, { yPercent: 90, rotate: 5, duration: outTitleDur }, 0.04);
      if (formEl) tl.to(formEl, { yPercent: 90, rotate: 6, duration: outFormDur }, 0.06);
      if (closeEl) tl.to(closeEl, { opacity: 0, y: -10, duration: outCloseDur, ease: "power2.in" }, 0.04);

      tl.to(surface, { xPercent: 100, duration: outSurfaceDur }, 0.1);
      prelayers.forEach((layer, i) => {
        const rev = prelayers.length - 1 - i;
        tl.to(layer, { xPercent: 100, duration: outPreDur }, 0.14 + rev * outPreSt);
      });

      animTlRef.current = tl;
      tl.play(0);
    }

    return () => {
      animTlRef.current?.kill();
      animTlRef.current = null;
    };
  }, [open, shouldMount]);

  if (!open && !shouldMount) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[200] overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
        {SEARCH_OVERLAY_PRELAYERS.map((bg, i) => (
          <div
            key={bg}
            className="search-overlay-prelayer absolute inset-0 will-change-transform"
            style={{ background: bg, zIndex: i }}
          />
        ))}
      </div>

      <div className="search-overlay-surface absolute inset-0 z-[3] flex flex-col bg-[#f5f5f7] will-change-transform">
        <button
          type="button"
          data-search-close
          onClick={onClose}
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-0 text-[#86868b] shadow-none ring-0 [-webkit-appearance:none] appearance-none transition-colors hover:text-[#1d1d1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] [&::-moz-focus-inner]:border-0 md:right-8 md:top-5"
          aria-label="Close search"
        >
          <X className="h-[22px] w-[22px]" strokeWidth={1.25} aria-hidden />
        </button>

        <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-10 pt-[4.5rem] sm:px-10 md:px-16 md:pt-[5.5rem] lg:mx-auto lg:w-full lg:max-w-[980px] lg:px-10">
          <h2 id={titleId} className="sr-only">
            Search
          </h2>

          <form
            data-search-form
            className="flex w-full items-center gap-3 border-0 sm:gap-4 [transform-origin:50%_100%] [will-change:transform]"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
          >
            <Search
              className="h-7 w-7 shrink-0 text-[#86868b] sm:h-9 sm:w-9"
              strokeWidth={1.15}
              aria-hidden
            />
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Search"
              autoComplete="off"
              enterKeyHint="search"
              className="min-w-0 flex-1 border-0 bg-transparent p-0 text-[1.75rem] font-semibold leading-tight tracking-tight text-[#1d1d1f] placeholder:text-[#86868b] placeholder:opacity-100 [-webkit-appearance:none] appearance-none focus:outline-none focus:ring-0 sm:text-[2.25rem] md:text-[2.75rem]"
            />
          </form>

          <div className="mt-14 overflow-hidden sm:mt-20">
            <p
              data-search-quick-title
              className="m-0 text-[0.8125rem] font-semibold text-[#86868b] [transform-origin:50%_100%] [will-change:transform]"
            >
              Quick Links
            </p>
            <ul className="mt-4 list-none space-y-1 p-0 sm:space-y-2" role="list">
              {quickLinks.map(({ label, href, external }) => (
                <li key={href + label} className="overflow-hidden">
                  {external ? (
                    <a
                      href={href}
                      data-search-link
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={onClose}
                      className="group flex items-baseline gap-2 py-1.5 text-[1.0625rem] font-semibold text-[#1d1d1f] no-underline transition-opacity hover:opacity-70 sm:text-[1.125rem] [transform-origin:50%_100%] [will-change:transform]"
                    >
                      <span className="font-normal text-[#1d1d1f] opacity-80" aria-hidden>
                        →
                      </span>
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      data-search-link
                      onClick={onClose}
                      className="group flex items-baseline gap-2 py-1.5 text-[1.0625rem] font-semibold text-[#1d1d1f] no-underline transition-opacity hover:opacity-70 sm:text-[1.125rem] [transform-origin:50%_100%] [will-change:transform]"
                    >
                      <span className="font-normal text-[#1d1d1f] opacity-80" aria-hidden>
                        →
                      </span>
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, isReady } = useCart();
  const { user } = useSupabaseUser();
  const [searchOpen, setSearchOpen] = useState(false);
  const isSignedIn = Boolean(user);

  const searchQuickLinks = useMemo((): SearchQuickLink[] => {
    const authLink: SearchQuickLink = isSignedIn
      ? { label: "Account", href: "/account" }
      : { label: "Sign in", href: "/login" };
    return [
      { label: "Catalog", href: "/shop" },
      { label: "Bricks", href: "/bricks" },
      { label: "Aggregates", href: "/aggregates" },
      { label: "Sand", href: "/sand" },
      { label: "Cement", href: "/cement" },
      { label: "Contact", href: "/contact" },
      { label: "Shopping bag", href: "/cart" },
      authLink,
      { label: "IndiaMART storefront", href: "https://www.indiamart.com/mathi-enterprises-tamilnadu/", external: true },
      { label: "Home", href: "/" },
    ];
  }, [isSignedIn]);

  const staggeredItems = useMemo(
    () => [
      { label: "Home", ariaLabel: "Go to home", link: "/" },
      {
        label: "BRICKS",
        ariaLabel: "View brick products",
        link: "/bricks",
      },
      {
        label: "AGGREGATES",
        ariaLabel: "View aggregate products",
        link: "/aggregates",
      },
      {
        label: "SAND",
        ariaLabel: "View sand products",
        link: "/sand",
      },
      {
        label: "CEMENT",
        ariaLabel: "View bagged cement products",
        link: "/cement",
      },
      {
        label: "IndiaMART",
        ariaLabel: "Mathi Enterprises on IndiaMART",
        link: "https://www.indiamart.com/mathi-enterprises-tamilnadu/",
      },
      { label: "Catalog", ariaLabel: "Browse the catalog", link: "/shop" },
      { label: "Contact", ariaLabel: "Contact Mathi Enterprises", link: "/contact" },
      isSignedIn
        ? { label: "Account", ariaLabel: "Your account and orders", link: "/account" }
        : { label: "Sign in", ariaLabel: "Sign in to your account", link: "/login" },
      {
        label: "Bag",
        ariaLabel:
          isReady && itemCount > 0
            ? `Shopping bag, ${itemCount > 99 ? "99+" : itemCount} items`
            : "Shopping bag",
        link: "/cart",
      },
    ],
    [isSignedIn, isReady, itemCount]
  );

  const mobileEndSlot = (
    <>
      <SearchOpenButton onOpen={() => setSearchOpen(true)} />
      <UserNavLink isSignedIn={isSignedIn} />
      <CartBadgeLink />
    </>
  );

  return (
    <>
      <AppleStyleSearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        quickLinks={searchQuickLinks}
      />
      {/* Mobile / tablet: Apple-style bar + StaggeredMenu (GSAP panel) */}
      <div className="lg:hidden">
        <StaggeredMenu
          scopeClassName="!z-[100]"
          isFixed
          position="right"
          logoUrl="/logo.png"
          brandName={BRAND_NAME}
          menuButtonColor="#1d1d1f"
          openMenuButtonColor="#1d1d1f"
          changeMenuColorOnOpen={false}
          displaySocials={false}
          colors={["#e8e8ed", "#d2d2d7", "#c4c4cc"]}
          accentColor="#0071e3"
          items={staggeredItems}
          endSlot={mobileEndSlot}
          headerClassName="h-11 border-b border-black/[0.08] bg-[rgba(251,251,253,0.82)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(251,251,253,0.72)] md:h-12"
        />
      </div>

      {/* Desktop: unchanged centered nav + icons */}
      <header
        className={cn(
          "fixed left-0 right-0 top-0 z-[100] hidden h-11 border-b border-black/[0.08] bg-[rgba(251,251,253,0.82)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(251,251,253,0.72)] lg:flex md:h-12"
        )}
      >
        <div className="relative mx-auto flex h-full w-full max-w-[1120px] items-center justify-between px-4 lg:px-6 xl:px-8">
          <Link
            href="/"
            className="relative z-[110] flex min-w-0 max-w-[min(100%,20rem)] shrink-0 items-center gap-2 opacity-90 transition hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0071e3]"
            aria-label={`${BRAND_NAME} home`}
          >
            <Image
              src="/logo.png"
              alt=""
              width={28}
              height={28}
              className="h-5 w-5 shrink-0 rounded-sm object-cover md:h-[22px] md:w-[22px]"
              priority
            />
            <span className="truncate text-[13px] font-semibold leading-tight tracking-tight text-[#1d1d1f] md:text-sm">
              {BRAND_NAME}
            </span>
          </Link>

          <nav className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block" aria-label="Main">
            <ul className="flex items-center gap-7 xl:gap-8">
              {centerNav.map(({ href, label, external }) => (
                <li key={`${href}-${label}`}>
                  {external ? (
                    <a
                      href={href}
                      className="whitespace-nowrap text-[12px] font-normal tracking-tight text-[#1d1d1f] opacity-90 transition-opacity duration-200 hover:opacity-100"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className={desktopNavLinkClass(isDesktopNavActive(pathname, href))}
                      aria-current={isDesktopNavActive(pathname, href) ? "page" : undefined}
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-[110] flex items-center gap-1 md:gap-2">
            <SearchOpenButton onOpen={() => setSearchOpen(true)} />
            <UserNavLink isSignedIn={isSignedIn} />
            <CartBadgeLink />
          </div>
        </div>
      </header>
    </>
  );
}
