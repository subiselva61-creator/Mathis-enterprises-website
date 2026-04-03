import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** Call before creating ScrollTrigger instances (safe to call multiple times). */
export function registerScrollTrigger(): void {
  if (typeof window === "undefined" || registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { ScrollTrigger };
