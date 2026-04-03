"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ExternalLink, MapPin, Phone, Receipt, Store } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  GOOGLE_MAPS_EMBED_SRC,
  GOOGLE_MAPS_LINK,
  IM_URL,
  PHONE_DISPLAY,
  PHONE_TEL,
} from "./contact-constants";

const labelClass =
  "text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-[#86868b]";

const cardClass =
  "w-full min-w-0 rounded-xl border border-neutral-200/90 bg-white p-4 shadow-sm shadow-neutral-900/[0.04] transition-shadow duration-300 hover:shadow-md hover:shadow-neutral-900/[0.06] sm:rounded-2xl sm:p-6";

const ctaButtonClass =
  "inline-flex w-full min-h-12 max-w-full justify-center gap-2 whitespace-normal px-4 text-center [text-wrap:balance] sm:w-auto sm:min-w-0 sm:max-w-none sm:px-8";

function useContactMotion() {
  const reduced = usePrefersReducedMotion();
  const transition = reduced
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.16, 1, 0.3, 1] as const };

  const child = {
    hidden: reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition },
  };

  const container = {
    hidden: {},
    visible: {
      transition: reduced ? {} : { staggerChildren: 0.1, delayChildren: 0.05 },
    },
  };

  const cardHover = reduced
    ? {}
    : { whileHover: { scale: 1.01 }, whileTap: { scale: 0.99 } };

  return { reduced, transition, child, container, cardHover };
}

export function ContactPageClient() {
  const { reduced, transition, child, container, cardHover } = useContactMotion();

  return (
    <div className="w-full max-w-4xl">
      <motion.div
        className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-start"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.a
          variants={child}
          href={IM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "default", size: "lg" }), ctaButtonClass)}
        >
          <Store className="size-4 shrink-0" data-icon="inline-start" aria-hidden />
          <span className="min-w-0">IndiaMART — Mathi Enterprises</span>
          <ExternalLink
            className="hidden size-4 shrink-0 opacity-80 sm:inline"
            data-icon="inline-end"
            aria-hidden
          />
        </motion.a>
        <motion.a
          variants={child}
          href={`tel:${PHONE_TEL}`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), ctaButtonClass)}
        >
          <Phone className="size-4 shrink-0" data-icon="inline-start" aria-hidden />
          Call {PHONE_DISPLAY}
        </motion.a>
        <motion.div variants={child} className="w-full sm:w-auto">
          <Link
            href="/shop"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), ctaButtonClass)}
          >
            Browse the catalog
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-8 grid w-full grid-cols-1 gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2"
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
      >
        <motion.article variants={child} {...cardHover} className={cn(cardClass, "flex flex-col text-left")}>
          <div className="mb-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/[0.08] text-primary sm:mb-4 sm:size-11">
            <Store className="size-[1.125rem] sm:size-5" aria-hidden />
          </div>
          <p className={labelClass}>Quotes &amp; orders</p>
          <a
            href={IM_URL}
            className="mt-2 break-words text-base font-semibold leading-snug text-primary underline-offset-4 hover:underline sm:text-lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            IndiaMART — Mathi Enterprises
          </a>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            We confirm formal quotes and order details through IndiaMART and our usual sales channels.
          </p>
        </motion.article>

        <motion.article variants={child} {...cardHover} className={cn(cardClass, "flex flex-col text-left")}>
          <div className="mb-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[#1d1d1f] sm:mb-4 sm:size-11">
            <Phone className="size-[1.125rem] sm:size-5" aria-hidden />
          </div>
          <p className={labelClass}>Phone</p>
          <a
            href={`tel:${PHONE_TEL}`}
            className="mt-2 text-base font-semibold tabular-nums leading-snug text-[#1d1d1f] underline-offset-4 hover:underline sm:text-lg"
          >
            {PHONE_DISPLAY}
          </a>
        </motion.article>

        <motion.article
          variants={child}
          {...cardHover}
          className={cn(cardClass, "text-left md:col-span-2")}
        >
          <div className="mb-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[#1d1d1f] sm:mb-4 sm:size-11">
            <MapPin className="size-[1.125rem] sm:size-5" aria-hidden />
          </div>
          <p className={labelClass}>Location</p>
          <p className="mt-2 text-[0.9375rem] font-medium leading-snug text-[#1d1d1f] sm:text-base">
            Chennai, Tamil Nadu, India
          </p>

          <div className="mt-4 overflow-hidden rounded-lg border border-neutral-200 bg-[#f5f5f7] shadow-inner sm:mt-5 sm:rounded-xl">
            <div className="aspect-[4/3] w-full min-h-[200px] sm:aspect-[16/10] sm:min-h-[220px]">
              <iframe
                title="Mathi Enterprises on Google Maps"
                src={GOOGLE_MAPS_EMBED_SRC}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
          <p className="mt-3 text-sm text-neutral-600">
            <a
              href={GOOGLE_MAPS_LINK}
              className="inline-flex items-center gap-1 font-medium text-primary underline-offset-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in Google Maps
              <ExternalLink className="size-3.5 opacity-80" aria-hidden />
            </a>
          </p>
        </motion.article>

        <motion.article variants={child} {...cardHover} className={cn(cardClass, "flex flex-col text-left")}>
          <div className="mb-3 flex size-10 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[#1d1d1f] sm:mb-4 sm:size-11">
            <Receipt className="size-[1.125rem] sm:size-5" aria-hidden />
          </div>
          <p className={labelClass}>GST</p>
          <p className="mt-2 font-mono text-sm tracking-wide text-[#1d1d1f]">33ACPPV8797A2ZX</p>
        </motion.article>
      </motion.div>

      <motion.p
        className="mt-6 max-w-prose text-sm leading-relaxed text-neutral-600 sm:mt-8 [text-wrap:pretty]"
        initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={transition}
      >
        <Link href="/shop" className="font-medium text-primary underline-offset-2 hover:underline">
          Browse the catalog
        </Link>{" "}
        to explore cement, aggregates, sand, bricks, and more.
      </motion.p>
    </div>
  );
}
