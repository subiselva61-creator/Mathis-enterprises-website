/**
 * Shared Link-as-button styles for the public storefront (hero, catalog, forms).
 * Prefer these over duplicating long Tailwind strings.
 */

/** Apple-style primary (home hero, carousel). */
export const storefrontPillApplePrimary =
  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#0071e3] px-6 text-[17px] font-normal leading-none text-white transition-[color,transform,box-shadow] duration-200 hover:bg-[#0077ed] hover:shadow-md hover:shadow-[#0071e3]/25 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] md:text-[19px]";

/** Apple-style outline secondary (home hero). */
export const storefrontPillAppleSecondary =
  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-[#1d1d1f] bg-transparent px-6 text-[17px] font-normal leading-none text-[#1d1d1f] transition-[color,transform,background-color,box-shadow] duration-200 hover:bg-[#1d1d1f]/5 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0071e3] md:text-[19px]";

/** Brand blue (#0027eb) — catalog cards, checkout, etc. */
export const storefrontPillBrand =
  "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#0027eb] px-6 text-[17px] font-normal leading-none text-white transition-[color,transform,box-shadow] duration-200 hover:bg-[#1e46f4] hover:shadow-md hover:shadow-[#0027eb]/20 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0027eb] md:text-[19px]";

/** Compact brand pill for dense forms (e.g. checkout). */
export const storefrontPillBrandCompact =
  "inline-flex min-h-[2.75rem] shrink-0 items-center justify-center rounded-full bg-[#0027eb] px-6 text-sm font-medium text-white transition-[color,transform,box-shadow] duration-200 hover:bg-[#1e46f4] hover:shadow-md hover:shadow-[#0027eb]/20 active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0027eb]";
