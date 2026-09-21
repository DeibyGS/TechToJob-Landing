"use client";

import { useReducedMotion } from "motion/react";

export function SectionDivider() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative py-8 md:py-12" aria-hidden="true">
      <div className="flex items-center justify-center gap-4">
        {/* Línea izquierda con gradiente */}
        <div
          className={`h-px flex-1 bg-gradient-to-r from-transparent via-brand-teal/30 to-brand-teal/50 ${
            reduceMotion ? "" : "section-divider-line"
          }`}
        />

        {/* Diamante central con glow */}
        <div
          className={`relative ${
            reduceMotion ? "" : "section-divider-diamond"
          }`}
        >
          {/* Glow exterior */}
          <div className="absolute inset-0 h-4 w-4 rotate-45 bg-brand-teal/20 blur-md" />
          {/* Diamante sólido */}
          <div className="relative h-2.5 w-2.5 rotate-45 bg-brand-teal/60" />
        </div>

        {/* Línea derecha con gradiente */}
        <div
          className={`h-px flex-1 bg-gradient-to-l from-transparent via-brand-teal/30 to-brand-teal/50 ${
            reduceMotion ? "" : "section-divider-line"
          }`}
        />
      </div>
    </div>
  );
}
