"use client";

import { usePathname } from "next/navigation";

/**
 * Temporary: on viewports ≥768px, public routes show a mobile-only notice instead of the storefront.
 * Admin routes are excluded so the panel stays usable on desktop.
 */
export default function DesktopMobileGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return children;
  }

  return (
    <>
      <div className="desktop-viewing-notice" role="status" aria-live="polite">
        <p className="desktop-viewing-notice__title">Please use a mobile phone</p>
        <p className="desktop-viewing-notice__text">
          For the best viewing experience, open this site on your mobile device.
        </p>
      </div>
      <div className="storefront-mobile-only">{children}</div>
    </>
  );
}
