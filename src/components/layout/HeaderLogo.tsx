"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * Header logo: icon (`symbol-positive.svg`, the same brand mark used across
 * the site) + a real HTML text wordmark, per docs/DESIGN.md's Logo usage
 * matrix. Split into two elements (unlike Hero/Footer's fused
 * `logo-negative.svg`) so "TechToJob" stays real, indexable text instead of
 * pixels baked into an image.
 */
export function HeaderLogo() {
  const reduceMotion = useReducedMotion();

  return (
    <a href="#hero" className="flex items-center gap-2">
      <motion.span
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 260, damping: 20 }
        }
        className="relative h-7 w-7 shrink-0"
      >
        <Image src="/logo/symbol-positive.svg" alt="" fill sizes="28px" priority className="object-contain" />
      </motion.span>
      <span className="text-lg font-bold text-brand-dark">TechToJob</span>
    </a>
  );
}
