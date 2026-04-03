import type { NextConfig } from "next";

function supabaseStorageRemotePatterns(): { protocol: "https"; hostname: string; pathname: string }[] {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return [];
  try {
    const host = new URL(url).hostname;
    return [{ protocol: "https", hostname: host, pathname: "/storage/v1/object/public/**" }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  serverExternalPackages: ["@react-pdf/renderer", "@react-pdf/primitives", "@react-pdf/font"],
  /** Tighter than Next defaults (60s / 5 pages) to trim dev server memory without constant recompiles. */
  onDemandEntries: {
    maxInactiveAge: 30 * 1000,
    pagesBufferLength: 2,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "motion/react", "gsap"],
    /** Soft cap for Turbopack’s own cache (bytes); helps avoid runaway RAM in `next dev` */
    turbopackMemoryLimit: 768 * 1024 * 1024,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "5.imimg.com",
        pathname: "/**",
      },
      ...supabaseStorageRemotePatterns(),
    ],
  },
};

export default nextConfig;
