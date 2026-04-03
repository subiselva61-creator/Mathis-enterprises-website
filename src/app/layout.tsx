import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { products } from "@/data/products";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600"],
});

export const metadata: Metadata = {
  title: {
    default: "Mathi Enterprises",
    template: "%s · Mathi Enterprises",
  },
  description:
    "Mathi Enterprises — retail trader of construction materials, cement, TMT bars, aggregates, AAC blocks, and residential plots in Chennai, Tamil Nadu (GST 33ACPPV8797A2ZX). Browse our catalog; confirm quotes on IndiaMART.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}
    >
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="site-shell">
          <CartProvider products={products}>
            <SiteHeader />
            <main id="main-content" className="main main--apple" tabIndex={-1}>
              {children}
            </main>
            <SiteFooter />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
