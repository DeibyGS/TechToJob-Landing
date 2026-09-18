"use client";

import { ArrowRight, MessageCircle } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type CommunityBarProps = {
  members: string;
  online: string;
  channels: string[];
  channelOnline: string;
  ctaLabel: string;
  ctaHoverLabel: string;
  ctaHref: string;
};

/**
 * Community status bar — sits at the bottom of the Hero, above the scroll
 * indicator. Shows a compact Discord-inspired composition: member counts,
 * online indicator with pulse, channel pills with hover reveals, and a
 * CTA with text-swap on hover.
 *
 * All animation is CSS-only (group-hover, transitions, keyframe pulse).
 * No motion library needed — coexists cleanly with GSAP on the parent.
 */
export function CommunityBar({
  members,
  online,
  channels,
  channelOnline,
  ctaLabel,
  ctaHoverLabel,
  ctaHref,
}: CommunityBarProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div data-hero-community className="mt-8 flex flex-col items-center gap-4">
      {/* ── Status row: members + online indicator ── */}
      <div className="flex items-center gap-3 text-sm text-brand-white/60">
        <span className="flex items-center gap-1.5">
          <span
            className={`online-dot inline-block h-2 w-2 rounded-full bg-emerald-400${reduceMotion ? " motion-reduce:animate-none" : ""}`}
            aria-hidden
          />
          <span className="font-medium text-brand-white/80">{members}</span>
        </span>
        <span aria-hidden className="text-brand-white/30">
          ·
        </span>
        <span>{online}</span>
      </div>

      {/* ── Channel pills ── */}
      <div className="flex flex-wrap justify-center gap-2">
        {channels.map((channel) => (
          <span
            key={channel}
            className="group relative inline-flex cursor-default items-center gap-1 rounded-full border border-brand-white/10 bg-brand-white/5 px-3 py-1.5 text-xs font-medium text-brand-white/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-white/20 hover:bg-brand-white/10 hover:text-brand-white/90 hover:shadow-sm hover:shadow-brand-teal/10"
          >
            {channel}
            <span className="ml-0.5 hidden text-brand-teal/80 group-hover:inline">
              · {channelOnline}
            </span>
          </span>
        ))}
      </div>

      {/* ── CTA — Discord join button with text swap ── */}
      <motion.a
        href={ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={reduceMotion ? undefined : { scale: 1.01, y: -1 }}
        whileTap={reduceMotion ? undefined : { scale: 0.98 }}
        className="group relative mt-2 inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-full border border-brand-white/10 bg-brand-white/5 px-5 py-2.5 text-xs font-semibold text-brand-white/80 shadow-sm shadow-brand-teal/5 backdrop-blur-sm transition-all duration-200 hover:border-brand-teal/30 hover:bg-brand-white/10 hover:text-brand-white hover:shadow-md hover:shadow-brand-teal/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark"
      >
        <MessageCircle className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" aria-hidden />
        <span className="relative inline-flex items-center gap-1.5">
          <span className="inline-block transition-all duration-200 group-hover:-translate-y-4 group-hover:opacity-0">
            {ctaLabel}
          </span>
          <span className="absolute inset-0 inline-flex items-center gap-1.5 transition-all duration-200 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
            {ctaHoverLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </span>
      </motion.a>
    </div>
  );
}
