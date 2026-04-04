"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Wraps each navigation segment with a keyed div so the route enter CSS animation restarts. */
export default function RouteEnterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const skipAnimation = pathname.startsWith("/admin");

  return (
    <div key={pathname} className={skipAnimation ? undefined : "route-page-enter"}>
      {children}
    </div>
  );
}
