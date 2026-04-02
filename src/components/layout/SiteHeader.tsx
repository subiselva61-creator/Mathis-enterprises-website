"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import styles from "./SiteHeader.module.css";

const nav = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/cart", label: "Cart" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, isReady } = useCart();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <Image
            src="/logo.png"
            alt=""
            width={37}
            height={36}
            className={styles.logoMark}
            priority
          />
          <span className={styles.logoText}>Mathis Enterprises</span>
        </Link>
        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.navList}>
            {nav.map(({ href, label }) => {
              const active = pathname === href || (href !== "/" && pathname.startsWith(href));
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={active ? styles.navLinkActive : styles.navLink}
                    aria-current={active ? "page" : undefined}
                  >
                    {label}
                    {href === "/cart" && isReady && itemCount > 0 ? (
                      <span className={styles.badge} aria-label={`${itemCount} items in cart`}>
                        {itemCount > 99 ? "99+" : itemCount}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
