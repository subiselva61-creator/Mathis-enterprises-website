import Link from "next/link";
import { categories } from "@/data/products";

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
  return (
    <footer className="bg-[#f5f5f7] text-[12px] text-[#6e6e73]">
      <div className="mx-auto max-w-[980px] px-4 pb-6 pt-10">
        <div className="grid grid-cols-2 gap-8 border-b border-[#d2d2d7] pb-6 md:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title} data-scroll-footer-col>
              <h3 className="mb-3 font-semibold text-[#1d1d1f]">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={`${col.title}-${l.label}`}>
                    {l.external ? (
                      <a
                        href={l.href}
                        className="hover:underline hover:text-[#424245]"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="hover:underline hover:text-[#424245]">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
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
            GST: 33ACPPV8797A2ZX · Chennai, Tamil Nadu.
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

        <div className="flex flex-col gap-3 border-t border-[#d2d2d7] pt-4 md:flex-row md:items-center md:justify-between">
          <p className="text-[#86868b]">
            Copyright © {new Date().getFullYear()} Mathi Enterprises. All rights reserved.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-1">
            {["Privacy Policy", "Terms of Use", "Legal", "Site Map"].map((label) => (
              <li key={label}>
                <Link href="/" className="hover:underline">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
