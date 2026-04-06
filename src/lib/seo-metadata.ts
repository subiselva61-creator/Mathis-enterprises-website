import type { Metadata } from "next";
import {
  absoluteUrl,
  BUSINESS_NAME,
  DEFAULT_OG_DESCRIPTION,
  DEFAULT_OG_IMAGE_PATH,
  siteUrl,
} from "@/lib/site";

type PageSeoInput = {
  title: string;
  description: string;
  /** Path starting with / (e.g. `/shop`) */
  path: string;
  keywords?: string[];
  /** Override default OG/Twitter image */
  ogImage?: string;
};

/**
 * Standard marketing-page metadata: canonical URL, Open Graph, Twitter Card.
 * Root `metadataBase` supplies the origin for relative image paths.
 */
export function marketingPageMetadata({
  title,
  description,
  path,
  keywords,
  ogImage = DEFAULT_OG_IMAGE_PATH,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(path);
  const images = [{ url: ogImage, width: 1200, height: 630, alt: title }];
  return {
    /** Avoid appending the root `title.template` when the string already includes the brand. */
    title: { absolute: title },
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "en_IN",
      url,
      siteName: BUSINESS_NAME,
      title,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function noindexMetadata(partial: Metadata = {}): Metadata {
  const { title, ...rest } = partial;
  const titleOut: Metadata["title"] | undefined =
    typeof title === "string" ? { absolute: title } : title;
  return {
    ...rest,
    ...(titleOut != null ? { title: titleOut } : {}),
    robots: { index: false, follow: true },
  };
}

export { siteUrl, absoluteUrl, BUSINESS_NAME, DEFAULT_OG_DESCRIPTION, DEFAULT_OG_IMAGE_PATH };
