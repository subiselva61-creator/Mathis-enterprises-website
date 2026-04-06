import Link from "next/link";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import { categories } from "@/data/products";
import { ADDRESS_LINES, GST_NUMBER, PHONE_DISPLAY, PHONE_TEL } from "@/app/contact/contact-constants";
import { BUSINESS_NAME } from "@/lib/site";

const IM_PROFILE = "https://www.indiamart.com/mathi-enterprises-tamilnadu/";

const shopCategories = categories.filter((c) => c !== "All");

const columns: { title: string; links: { href: string; label: string; external?: boolean }[] }[] = [
  {
    title: "Shop by category",
    links: [
      { href: "/shop", label: "Full catalog" },
      ...shopCategories.map((c) => ({
        href: `/shop?cat=${encodeURIComponent(c)}`,
        label: c,
      })),
      { href: "/cart", label: "Shopping bag" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/", label: "Mathi Enterprises" },
      { href: "/contact", label: "Contact" },
      { href: "/service-areas", label: "Service areas" },
      { href: IM_PROFILE, label: "IndiaMART storefront", external: true },
      { href: "/shop", label: "Request quote (via catalog)" },
    ],
  },
  {
    title: "Products",
    links: [
      { href: `/shop?cat=${encodeURIComponent("Construction Materials")}`, label: "Construction materials" },
      { href: `/shop?cat=${encodeURIComponent("Cement")}`, label: "Cement" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/", label: "Privacy Policy" },
      { href: "/", label: "Terms of Use" },
    ],
  },
];

export default function SiteFooter() {
  const linkClass =
    "text-[#6e6e73] transition-colors duration-200 hover:text-[#424245] hover:underline underline-offset-2";

  return (
    <footer className="bg-[#f5f5f7] text-[12px] text-[#6e6e73]">
      <LocalBusinessJsonLd />
      <div className="mx-auto max-w-[1120px] px-4 pb-6 pt-10 xl:px-8 xl:pb-8 xl:pt-12">
        <div className="grid grid-cols-2 gap-8 border-b border-[#d2d2d7] pb-6 md:grid-cols-4 xl:gap-10">
          {columns.map((col) => (
            <div key={col.title} data-scroll-footer-col>
              <h3 className="mb-3 text-[13px] font-semibold text-[#1d1d1f] xl:text-sm">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    {l.external ? (
                      <a href={l.href} className={linkClass} target="_blank" rel="noopener noreferrer">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-2 rounded-2xl border border-[#d2d2d7] bg-white/80 px-4 py-4 text-[13px] leading-relaxed text-[#424245] md:px-5 md:py-5">
          <p className="text-[14px] font-semibold text-[#1d1d1f]">{BUSINESS_NAME}</p>
          <p className="mt-1">
            {ADDRESS_LINES[0]}, {ADDRESS_LINES[1]}, {ADDRESS_LINES[2]}
          </p>
          <p className="mt-2">
            <a href={`tel:${PHONE_TEL}`} className="font-medium text-[#1d1d1f] underline-offset-2 hover:underline">
              {PHONE_DISPLAY}
            </a>
          </p>
          <p className="mt-1 font-mono text-[12px] text-[#6e6e73]">GST: {GST_NUMBER}</p>
        </div>

        <div className="py-4">
          <p className="mb-3 leading-relaxed">
            <strong className="font-semibold text-[#424245]">Pricing:</strong> Rates and MOQs on this site are indicative,
            transcribed from our{" "}
            <a
              href={IM_PROFILE}
              className="text-[#424245] underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              IndiaMART
            </a>{" "}
            listings and may change. Always confirm the latest quote, freight, and availability before placing an order.
            GST: {GST_NUMBER} · {ADDRESS_LINES[0]}, {ADDRESS_LINES[1]}.
          </p>
          <p className="mb-4 leading-relaxed">
            You can place a cash-on-delivery order from your{" "}
            <Link href="/cart" className="text-[#424245] underline">
              shopping bag
            </Link>
            . We confirm the final amount and delivery before dispatch. For other enquiries, use{" "}
            <a href={IM_PROFILE} className="text-[#424245] underline" target="_blank" rel="noopener noreferrer">
              IndiaMART
            </a>{" "}
            or your usual sales channel.
          </p>
          <p className="mb-4">
            <Link href="/shop" className="text-[#424245] hover:underline">
              Browse the catalog
            </Link>{" "}
            or open your{" "}
            <Link href="/cart" className="text-[#424245] hover:underline">
              bag
            </Link>
            .
          </p>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#d2d2d7] pt-4 md:flex-row md:items-center md:justify-between xl:pt-5">
          <p className="text-[#86868b]">
            Copyright © {new Date().getFullYear()} Mathi Enterprises. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            <li>
              <Link href="/" className={linkClass}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/" className={linkClass}>
                Terms of Use
              </Link>
            </li>
            <li>
              <Link href="/" className={linkClass}>
                Legal
              </Link>
            </li>
            <li>
              <Link href="/service-areas" className={linkClass}>
                Site map
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
