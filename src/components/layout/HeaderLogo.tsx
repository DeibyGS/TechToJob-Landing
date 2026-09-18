"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

const LOGO_VARIANTS = [
  { src: "/logo/v1-negativo.png", alt: "TechToJob" },
  { src: "/logo/v1-positivo.png", alt: "" },
  { src: "/logo/v1-degradado.png", alt: "" },
] as const;

/**
 * Header logo with color-cycling animation.
 *
 * The logo cycles through 4 color variants (negativo → degradado → black → positivo)
 * using CSS keyframe opacity crossfades. Runs once on mount, ~6s total.
 * Under prefers-reduced-motion, shows the final positivo variant immediately.
 */
export function HeaderLogo() {
  const reduceMotion = useReducedMotion();

  return (
    <a href="#hero" className="relative flex items-center">
      <motion.span
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 20 }
        }
        className="relative h-8 w-[140px]"
      >
        {LOGO_VARIANTS.map(({ src, alt }, i) => (
          <Image
            key={src}
            src={src}
            alt={alt}
            fill
            sizes="140px"
            priority={i === 0}
            className={`object-contain ${reduceMotion ? "" : `logo-cycle-${i}`}`}
          />
        ))}
      </motion.span>
    </a>
  );
}
