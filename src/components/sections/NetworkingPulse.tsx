"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

export type Fragment = {
  username: string;
  message: string;
  time: string;
};

const VISIBLE_COUNT = 3;
const ROTATE_INTERVAL_MS = 3500;

type PulseItem = { key: number; fragment: Fragment };

/**
 * Live-feeling chat ticker: a new message slides in at the bottom every few
 * seconds, the rest shift up, and the oldest scrolls off — the "real chat"
 * feel a static list can't give. Client-only (needs a timer). Cycles
 * through `pool` on a loop; under prefers-reduced-motion it just shows the
 * first few messages and never rotates.
 */
export function NetworkingPulse({ activityLabel, pool }: { activityLabel: string; pool: Fragment[] }) {
  const reduceMotion = useReducedMotion();
  const nextIndex = useRef(VISIBLE_COUNT % Math.max(pool.length, 1));
  const nextKey = useRef(VISIBLE_COUNT);
  const [items, setItems] = useState<PulseItem[]>(() =>
    pool.slice(0, VISIBLE_COUNT).map((fragment, i) => ({ key: i, fragment })),
  );

  useEffect(() => {
    if (reduceMotion || pool.length <= VISIBLE_COUNT) return;

    const id = setInterval(() => {
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
    <div className="flex flex-col gap-4 rounded-2xl border border-brand-dark/10 bg-brand-teal/5 p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-brand-dark/50">
        <DiscordIcon className="h-4 w-4" aria-hidden={true} />
        {activityLabel}
      </div>
      <div className="flex flex-col gap-3 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map(({ key, fragment }) => (
            <motion.div
              key={key}
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="flex items-start gap-2.5 rounded-xl border border-brand-dark/[0.06] bg-white p-3 shadow-sm"
            >
              <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-brand-teal/10">
                <Image
                  src={`https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(fragment.username)}`}
                  alt={fragment.username}
                  width={32}
                  height={32}
                  unoptimized
                  loading="lazy"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-brand-dark">{fragment.username}</p>
                <p className="text-sm text-brand-dark/60">{fragment.message}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
