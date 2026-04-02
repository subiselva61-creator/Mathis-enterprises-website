"use client";

import Silk from "@/components/ui/Silk";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./SiteBackground.module.css";

export default function SiteBackground() {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <div className={styles.layer} aria-hidden>
      <Silk
        className={styles.fill}
        speed={5}
        scale={1}
        /* Slightly brighter than stock #7B7481 so motion reads through the veil */
        color="#9a90b0"
        noiseIntensity={1.5}
        rotation={0}
        paused={reducedMotion}
      />
      <div className={styles.veil} />
    </div>
  );
}
