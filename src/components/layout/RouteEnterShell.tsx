"use client";

import { usePathname } from "next/navigation";
import { useSyncExternalStore, type ReactNode } from "react";
import { motion } from "motion/react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

function subscribeMinLg(cb: () => void) {
  const mq = window.matchMedia("(min-width: 1024px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function snapshotMinLg() {
  return window.matchMedia("(min-width: 1024px)").matches;
}

function serverMinLg() {
  return false;
}

function useMinWidthLg() {
  return useSyncExternalStore(subscribeMinLg, snapshotMinLg, serverMinLg);
}

/** Wraps each navigation segment with a keyed wrapper so route enter motion restarts. */
export default function RouteEnterShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const skipAnimation = pathname.startsWith("/admin");
  const reducedMotion = usePrefersReducedMotion();
  const isLg = useMinWidthLg();

  if (skipAnimation || reducedMotion) {
    return <div key={pathname}>{children}</div>;
  }

  const y = isLg ? 22 : 14;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: isLg ? 0.52 : 0.42,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
