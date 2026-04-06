import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { getMergedProducts } from "@/lib/catalog";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteScrollExperience from "@/components/motion/SiteScrollExperience";
import ForceLightDocument from "@/components/layout/ForceLightDocument";
import {
  BUSINESS_NAME,
  DEFAULT_OG_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  siteUrl,
} from "@/lib/site";

/** Merged catalog reads Supabase; must not freeze at build time. */
export const dynamic = "force-dynamic";

/**
 * Lock the document to a light palette so mobile browsers (Chrome auto-dark, etc.)
 * do not remap colors when the user has system dark mode enabled.
 */
export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#ffffff",
};

const canonical = siteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(canonical),
  title: {
    default: BUSINESS_NAME,
    template: "%s · Mathi Enterprises",
  },
  description:
    "Mathi Enterprises — wholesale construction materials supplier in Chennai: cement, TMT steel, bricks, sand, aggregates, and AAC blocks (GST 33ACPPV8797A2ZX). Bulk pricing and project supply chain support; confirm quotes on IndiaMART.",
  keywords: [
    "bulk cement Chennai",
    "wholesale construction materials",
    "TMT steel supplier",
    "building materials wholesale",
    "construction procurement Chennai",
    "Mathi Enterprises",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: canonical,
    siteName: BUSINESS_NAME,
    title: `${BUSINESS_NAME} — Bulk building materials, Chennai`,
    description: DEFAULT_OG_DESCRIPTION,
    images: [{ url: DEFAULT_OG_IMAGE_PATH, width: 1200, height: 630, alt: BUSINESS_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BUSINESS_NAME} — Bulk building materials, Chennai`,
    description: DEFAULT_OG_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE_PATH],
  },
  appleWebApp: {
    statusBarStyle: "default",
  },
};

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const products = await getMergedProducts();
  return (
    <html lang="en" className={dmSans.variable} style={{ colorScheme: "only light" }}>
      <body className="app-root">
        <ForceLightDocument />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="site-shell">
          <CartProvider
            catalog={products.map((p) => ({
              id: p.id,
              price: p.price,
              priceOnRequest: p.priceOnRequest,
            }))}
          >
            <SiteHeader />
            <SiteScrollExperience>
              <main id="main-content" className="main main--apple" tabIndex={-1}>
                {children}
              </main>
              <SiteFooter />
            </SiteScrollExperience>
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
