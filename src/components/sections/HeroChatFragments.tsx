"use client";

import Image from "next/image";
import { useReducedMotion } from "motion/react";

export type Fragment = {
  username: string;
  message: string;
  time: string;
};

type HeroChatFragmentsProps = {
  fragments: Fragment[];
};

/**
 * Floating chat conversation fragments layered behind the hero headline.
 * Purely decorative — aria-hidden, pointer-events-none. Creates the
 * impression of a living community with conversations happening around
 * the visitor. 3 depth layers: background (heavy blur), midground,
 * foreground (sharp, near edges, partially cropped).
 *
 * Integrates with GSAP parallax via data-hero-chat-fragment attributes.
 */
export function HeroChatFragments({ fragments }: HeroChatFragmentsProps) {
  const reduceMotion = useReducedMotion();

  // Layout config: position, depth layer, visibility
  const layout = [
    // Background layer (3) — heavy blur, low opacity, far corners
    { top: "8%", left: "3%", blur: "blur(12px)", opacity: 0.2, layer: "bg", show: "md" },
    { top: "15%", right: "4%", blur: "blur(14px)", opacity: 0.15, layer: "bg", show: "md" },
    { bottom: "12%", left: "5%", blur: "blur(10px)", opacity: 0.2, layer: "bg", show: "md" },

    // Midground layer (4) — moderate blur, medium opacity, laterals
    { top: "25%", left: "2%", blur: "blur(6px)", opacity: 0.35, layer: "mid", show: "md" },
    { top: "10%", right: "2%", blur: "blur(5px)", opacity: 0.4, layer: "mid", show: "always" },
    { bottom: "20%", right: "3%", blur: "blur(7px)", opacity: 0.3, layer: "mid", show: "md" },
    { bottom: "30%", left: "1%", blur: "blur(6px)", opacity: 0.35, layer: "mid", show: "md" },

    // Foreground layer (3) — sharp, higher opacity, edges (partially cropped)
    { top: "40%", left: "-2%", blur: "blur(2px)", opacity: 0.55, layer: "fg", show: "md" },
    { top: "20%", right: "-1%", blur: "blur(1px)", opacity: 0.6, layer: "fg", show: "md" },
    { bottom: "15%", right: "0%", blur: "blur(2px)", opacity: 0.5, layer: "fg", show: "always" },
  ] as const;

  // Drift animation variants (CSS classes in globals.css)
  const driftClasses = [
    "hero-fragment-drift-a",
    "hero-fragment-drift-b",
    "hero-fragment-drift-c",
  ];

  // Connection lines between selected fragments (SVG coordinates are % of container)
  const connections = [
    { x1: "12%", y1: "20%", x2: "8%", y2: "45%", opacity: 0.12 },
    { x1: "88%", y1: "18%", x2: "92%", y2: "55%", opacity: 0.1 },
    { x1: "15%", y1: "75%", x2: "85%", y2: "70%", opacity: 0.08 },
  ];

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      data-hero-chat-layer
    >
      {/* Connection lines */}
      <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {connections.map((conn, i) => (
          <line
            key={i}
            x1={conn.x1}
            y1={conn.y1}
            x2={conn.x2}
            y2={conn.y2}
            stroke="rgba(132, 192, 191, 0.15)"
            strokeWidth="1"
            opacity={conn.opacity}
          />
        ))}
        {/* Glow dots at connection endpoints */}
        {connections.map((conn, i) => (
          <g key={`dots-${i}`}>
            <circle cx={conn.x1} cy={conn.y1} r="2" fill="rgba(132, 192, 191, 0.2)" />
            <circle cx={conn.x2} cy={conn.y2} r="2" fill="rgba(132, 192, 191, 0.2)" />
          </g>
        ))}
      </svg>

      {/* Chat fragments */}
      {fragments.map((fragment, index) => {
        const config = layout[index];
        if (!config) return null;

        // Hide on mobile unless show === "always"
        const isHiddenOnMobile = config.show === "md";

        const positionStyle: React.CSSProperties = {
          top: "top" in config ? config.top : undefined,
          bottom: "bottom" in config ? config.bottom : undefined,
          left: "left" in config ? config.left : undefined,
          right: "right" in config ? config.right : undefined,
          filter: config.blur,
          opacity: reduceMotion ? config.opacity : undefined,
        };

        return (
          <div
            key={`${fragment.username}-${index}`}
            data-hero-chat-fragment
            data-layer={config.layer}
            className={`hero-fragment absolute z-[1] ${driftClasses[index % 3]} ${isHiddenOnMobile ? "hidden md:block" : ""}`}
            style={positionStyle}
          >
            <div
              className="flex items-start gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] p-2.5 backdrop-blur-md"
              style={{ maxWidth: "220px" }}
            >
              {/* Avatar */}
              <div className="h-6 w-6 flex-shrink-0 overflow-hidden rounded-full bg-white/10">
                <Image
                  src={`https://api.dicebear.com/10.x/notionists/svg?seed=${encodeURIComponent(fragment.username)}`}
                  alt=""
                  width={24}
                  height={24}
                  unoptimized
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-1">
                  <span className="text-[10px] font-semibold text-brand-teal">{fragment.username}</span>
                  <span className="flex-shrink-0 text-[9px] text-white/25">{fragment.time}</span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-white/50">{fragment.message}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
