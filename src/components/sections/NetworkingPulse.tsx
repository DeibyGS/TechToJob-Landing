"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Hash, Plus, Gift, Smile } from "lucide-react";

export type Fragment = {
  username: string;
  message: string;
  time: string;
};

const VISIBLE_COUNT = 4;
const ROTATE_INTERVAL_MS = 3500;

type PulseItem = { key: number; fragment: Fragment };

/**
 * Live-feeling chat ticker: a new message slides in at the bottom every few
 * seconds, the rest shift up, and the oldest scrolls off — the "real chat"
 * feel a static list can't give. Client-only (needs a timer). Cycles
 * through `pool` on a loop; under prefers-reduced-motion it just shows the
 * first few messages and never rotates.
 */
export function NetworkingPulse({
  activityLabel,
  channelName,
  chatPlaceholder,
  pool,
}: {
  activityLabel: string;
  channelName: string;
  chatPlaceholder: string;
  pool: Fragment[];
}) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef(true);
  const nextIndex = useRef(VISIBLE_COUNT % Math.max(pool.length, 1));
  const nextKey = useRef(VISIBLE_COUNT);
  const [items, setItems] = useState<PulseItem[]>(() =>
    pool.slice(0, VISIBLE_COUNT).map((fragment, i) => ({ key: i, fragment })),
  );

  // Same viewport-gating TestimonialsCarousel uses — a decorative timer has
  // no reason to keep re-rendering every 3.5s once the section is scrolled
  // out of view.
  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(([entry]) => {
      isVisible.current = entry.isIntersecting;
    }, { threshold: 0 });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduceMotion || pool.length <= VISIBLE_COUNT) return;

    const id = setInterval(() => {
      if (!isVisible.current) return;

      const fragment = pool[nextIndex.current % pool.length];
      nextIndex.current += 1;
      const item: PulseItem = { key: nextKey.current, fragment };
      nextKey.current += 1;

      setItems((prev) => {
        const next = [...prev, item];
        return next.length > VISIBLE_COUNT ? next.slice(next.length - VISIBLE_COUNT) : next;
      });
    }, ROTATE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [reduceMotion, pool]);

  return (
    <div ref={containerRef} className="flex h-full flex-col overflow-hidden rounded-2xl bg-brand-dark">
      {/* Window titlebar — real Discord channel header: # + name + topic */}
      <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3 text-sm">
        <Hash className="h-4 w-4 shrink-0 text-white/40" strokeWidth={2.5} aria-hidden="true" />
        <span className="font-semibold text-white">{channelName}</span>
        <span className="hidden truncate text-white/60 sm:inline">· {activityLabel}</span>
        {/* Generic "live" indicator — no invented member count, base.md bans made-up numbers */}
        <span className="ml-auto flex h-2 w-2 shrink-0 rounded-full bg-brand-teal" aria-hidden="true" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-1 overflow-hidden p-3">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map(({ key, fragment }) => (
            <motion.div
              key={key}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.03]"
            >
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-brand-teal/10">
                <Image
                  src={`https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(fragment.username)}`}
                  alt=""
                  width={32}
                  height={32}
                  unoptimized
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <p className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-brand-teal">{fragment.username}</span>
                  <span className="text-xs text-white/45">{fragment.time}</span>
                </p>
                <p className="text-sm text-white/70">{fragment.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {/* Decorative message composer — sells the "real chat window" feel. Not a
          real input (site has no chat backend), so it's inert and hidden from
          assistive tech rather than announced as a broken form field. No send
          button shown, same as real Discord (sends on Enter). */}
      <div aria-hidden="true" className="flex items-center gap-2 border-t border-white/10 px-3 py-2.5">
        <Plus className="h-5 w-5 shrink-0 text-white/40" strokeWidth={2} />
        <div className="flex-1 truncate rounded-lg bg-white/10 px-3 py-2 text-sm text-white/40">
          {chatPlaceholder}
        </div>
        <div className="flex shrink-0 items-center gap-2.5 text-white/40">
          <Gift className="h-4 w-4" strokeWidth={2} />
          <Smile className="h-4 w-4" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}
