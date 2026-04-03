import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { getMergedProducts } from "@/lib/catalog";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteScrollExperience from "@/components/motion/SiteScrollExperience";
import DesktopMobileGate from "@/components/layout/DesktopMobileGate";

/** Merged catalog reads Supabase; must not freeze at build time. */
export const dynamic = "force-dynamic";

/** Force light chrome (scrollbars, form controls) regardless of system appearance. */
export const viewport: Viewport = {
  colorScheme: "light",
};

export const metadata: Metadata = {
  title: {
    default: "Mathi Enterprises",
    template: "%s · Mathi Enterprises",
  },
  description:
    "Mathi Enterprises — retail trader of construction materials, cement, TMT bars, aggregates, AAC blocks, and residential plots in Chennai, Tamil Nadu (GST 33ACPPV8797A2ZX). Browse our catalog; confirm quotes on IndiaMART.",
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
    <html lang="en" className={dmSans.variable}>
      <body className="app-root">
        <DesktopMobileGate>
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
        </DesktopMobileGate>
      </body>
    </html>
  );
}
