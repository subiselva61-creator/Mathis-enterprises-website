import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/cart-context";
import { products } from "@/data/products";
import SiteBackground from "@/components/layout/SiteBackground";
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

export const metadata: Metadata = {
  title: {
    default: "Mathis Enterprises",
    template: "%s · Mathis Enterprises",
  },
  description:
    "Modern ecommerce demo — curated products for work and life. Shop a static catalog with a local cart; payments coming soon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <SiteBackground />
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <div className="site-shell">
          <CartProvider products={products}>
            <SiteHeader />
            <main id="main-content" className="main" tabIndex={-1}>
              {children}
            </main>
            <SiteFooter />
          </CartProvider>
        </div>
      </body>
    </html>
  );
}
