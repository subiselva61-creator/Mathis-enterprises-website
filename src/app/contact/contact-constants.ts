import { INDIAMART_BASE } from "@/data/catalog/constants";

/** Single-line lines for NAP / schema (extend with street when available from Google Business). */
export const ADDRESS_LINES = ["Chennai", "Tamil Nadu", "India"] as const;

export const GST_NUMBER = "33ACPPV8797A2ZX";

export const IM_URL = `${INDIAMART_BASE}/`;

/** Opens the same place as the public short link (maps.app.goo.gl/…). */
export const GOOGLE_MAPS_LINK = "https://maps.app.goo.gl/Y3m2xWVB6jaFf6w56";

/**
 * Embed for Mathi Enterprises (construction materials supplier), Chennai —
 * built from the resolved place id and coordinates for that short link.
 */
export const GOOGLE_MAPS_EMBED_SRC =
  "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d15551.2!2d80.1891409!3d12.9334886!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525dc300903949%3A0x7149b780636d6fa3!2sMathi%20Enterprises!5e0!3m2!1sen!2sin!4v1!5m2!1sen!2sin";

export const PHONE_TEL = "+917845583158";
export const PHONE_DISPLAY = "+91 7845583158";
