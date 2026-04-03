/**
 * Placeholder photos via Unsplash (imgix CDN).
 * Use `auto=format&fit=crop` — several older bare `photo-…` URLs now 404 and break `next/image`.
 * Replace with `/public/products/...` when you have site-owned photos.
 */
const q = "auto=format&fit=crop&w=1200&q=80";

export const catalogImages = {
  /** Brick / masonry */
  brick: `https://images.unsplash.com/photo-1581578731548-c64695cc6952?${q}`,
  brickGray: `https://images.unsplash.com/photo-1615529328331-f8917597711f?${q}`,
  /** Sand / fine aggregate */
  sand: `https://images.unsplash.com/photo-1589939705384-5185137a7f0f?${q}`,
  /** Coarse aggregate / quarry */
  aggregate: `https://images.unsplash.com/photo-1541888946425-d81bb19240f5?${q}`,
  /** AAC / site construction */
  aac: `https://images.unsplash.com/photo-1503387762-592deb58ef4e?${q}`,
  /** Cement / industrial bags */
  cement: `https://images.unsplash.com/photo-1489515217757-5fd1be406fef?${q}`,
  concrete: `https://images.unsplash.com/photo-1621905251918-48416bd8575a?${q}`,
  /** Rebar / steel */
  tmt: `https://images.unsplash.com/photo-1563207153-f403bf289096?${q}`,
  /** Land / residential */
  plot: `https://images.unsplash.com/photo-1613490493576-7fde63acd811?${q}`,
  paver: `https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?${q}`,
  block: `https://images.unsplash.com/photo-1600585154526-990dced4db0d?${q}`,
  estate: `https://images.unsplash.com/photo-1600585154084-4e5fe7c39198?${q}`,
} as const;
