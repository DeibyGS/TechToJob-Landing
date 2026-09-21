"use client";

import Image from "next/image";

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
 * the visitor. 3 depth layers: background (blurred, atmospheric),
 * midground and foreground (both legible — depth comes from opacity and
 * the panel's own backdrop-blur, not from blurring the text itself).
 */
export function HeroChatFragments({ fragments }: HeroChatFragmentsProps) {
  // Layout config: position, depth layer, visibility.
  // Only `bg` carries a content blur — it's meant to stay atmospheric.
  // `mid`/`fg` rely on opacity + panelBlur (blurs what's behind the glass
  // panel, not the text drawn on it) so they stay readable.
  const layout = [
    // Background layer (3) — blurred, low opacity, far corners
    { top: "8%", left: "3%", blur: "blur(8px)", opacity: 0.2, panelBlur: "backdrop-blur-sm", layer: "bg", show: "md" },
    { top: "15%", right: "4%", blur: "blur(12px)", opacity: 0.18, panelBlur: "backdrop-blur-sm", layer: "bg", show: "md" },
    { bottom: "12%", left: "5%", blur: "blur(10px)", opacity: 0.22, panelBlur: "backdrop-blur-sm", layer: "bg", show: "md" },

    // Midground layer (4) — legible, medium-high opacity, laterals
    { top: "25%", left: "2%", opacity: 0.55, panelBlur: "backdrop-blur-md", layer: "mid", show: "md" },
    { top: "10%", right: "2%", opacity: 0.35, panelBlur: "backdrop-blur-md", layer: "mid", show: "always" },
    { bottom: "20%", right: "3%", opacity: 0.55, panelBlur: "backdrop-blur-md", layer: "mid", show: "md" },
    { bottom: "30%", left: "1%", opacity: 0.6, panelBlur: "backdrop-blur-md", layer: "mid", show: "md" },

    // Foreground layer (3) — near-fully legible, edges (partially cropped)
    { top: "40%", left: "-2%", opacity: 0.85, panelBlur: "backdrop-blur-md", layer: "fg", show: "md" },
    { top: "20%", right: "-1%", opacity: 0.95, panelBlur: "backdrop-blur-md", layer: "fg", show: "md" },
    { bottom: "15%", right: "0%", opacity: 0.45, panelBlur: "backdrop-blur-md", layer: "fg", show: "always" },
  ] as const;

  // Drift animation variants (CSS classes in globals.css)
  const driftClasses = [
    "hero-fragment-drift-a",
    "hero-fragment-drift-b",
    "hero-fragment-drift-c",
  ];

  // Full literal class names per layer — Tailwind's JIT scanner needs the
  // complete class string in source, so these can't be built by
  // interpolating an opacity number into a template string at runtime.
  const TEXT_CLASSES = {
    bg: { username: "text-brand-white/45", time: "text-white/20", message: "text-white/35" },
    mid: { username: "text-brand-white/70", time: "text-white/35", message: "text-white/65" },
    fg: { username: "text-brand-white/90", time: "text-white/45", message: "text-white/85" },
  } as const;

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
          filter: "blur" in config ? config.blur : undefined,
          opacity: config.opacity,
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
              className={`flex items-start gap-2 rounded-xl border border-white/[0.08] bg-white/[0.05] p-2.5 ${config.panelBlur}`}
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
                  <span className={`text-[11px] font-semibold ${TEXT_CLASSES[config.layer].username}`}>
                    {fragment.username}
                  </span>
                  <span className={`flex-shrink-0 text-[9px] ${TEXT_CLASSES[config.layer].time}`}>
                    {fragment.time}
                  </span>
                </div>
                <p className={`mt-0.5 text-xs leading-snug ${TEXT_CLASSES[config.layer].message}`}>
                  {fragment.message}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
