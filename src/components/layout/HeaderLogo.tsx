"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";

/**
 * Two-stage entrance (icon, then wordmark rising in after it) on first
 * paint. Split into icon + real text instead of the fused logo-positive.svg
 * so each piece can animate independently — see docs/DESIGN.md's Logo usage
 * matrix for the header-specific exception this creates.
 */
export function HeaderLogo() {
  const reduceMotion = useReducedMotion();

  return (
    <a href="#hero" className="flex items-center gap-2">
      <motion.span
        initial={reduceMotion ? false : { opacity: 0, scale: 0.5, rotate: -20 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Image src="/logo/symbol-positive.svg" alt="" width={32} height={32} priority className="h-8 w-8" />
      </motion.span>
      {/* Clip-path reveal — same signature move as the Hero headline's
          entrance (animations/hero.ts), for a brand-specific reveal instead
          of a generic fade+slide. */}
      <motion.span
        initial={reduceMotion ? false : { clipPath: "inset(0 0 100% 0)" }}
        animate={{ clipPath: "inset(0 0 0% 0)" }}
        transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="font-sora text-xl font-bold tracking-tight text-brand-dark md:text-2xl"
      >
        TechToJob
      </motion.span>
    </a>
  );
}
