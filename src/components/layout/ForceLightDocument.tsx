"use client";

import { useEffect } from "react";

/**
 * Some mobile browsers (Samsung Internet, in-app WebViews, older Chrome) still honor
 * OS dark mode for the page canvas even when <meta name="color-scheme" content="only light" />
 * is present. Re-applying on the document element after hydration matches spec and reduces drift.
 */
export default function ForceLightDocument() {
  useEffect(() => {
    const root = document.documentElement;
    root.style.colorScheme = "only light";
    root.setAttribute("data-color-scheme", "light-only");
  }, []);
  return null;
}
