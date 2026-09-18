"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { onFirstReveal } from "@/components/layout/HeaderReveal";

const LOGO_VARIANTS = [
  { src: "/logo/v1-negativo.png", alt: "TechToJob" },
  { src: "/logo/v1-positivo.png", alt: "" },
  { src: "/logo/v1-degradado.png", alt: "" },
] as const;

// Determine which animation class to apply to a logo variant based on
// motion preferences and reveal state.
function getLogoAnimationClass(
  index: number,
  reduceMotion: boolean | null,
  revealed: boolean
): string {
  if (reduceMotion) return "";
  if (revealed) return `logo-cycle-${index}`;
  return index === 0 ? "opacity-100" : "opacity-0";
}

/**
 * Header logo with color-cycling animation.
 *
 * The logo cycles through 4 color variants (negativo → degradado → black → positivo)
 * using CSS keyframe opacity crossfades, ~6s total. Starts when the header is
 * revealed for the first time (see HeaderReveal's onFirstReveal), not on
 * mount — the header sits translated off-screen for the whole Hero, so an
 * on-mount start would already be finished by the time it's visible.
 * Under prefers-reduced-motion, shows the final positivo variant immediately.
 */
export function HeaderLogo() {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;
    onFirstReveal(() => setRevealed(true));
  }, [reduceMotion]);

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
            className={`object-contain ${getLogoAnimationClass(i, reduceMotion, revealed)}`}
          />
        ))}
      </motion.span>
    </a>
  );
}
