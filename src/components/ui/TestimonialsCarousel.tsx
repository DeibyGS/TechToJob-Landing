"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "motion/react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  avatar: string;
  timestamp: string;
  channel?: string;
};

type TestimonialsCarouselProps = {
  items: Testimonial[];
  channelLabel: string;
  channelDescription: string;
  prevLabel: string;
  nextLabel: string;
  slideLabels: string[];
  paginationLabel: string;
};

const VISIBLE_DESKTOP = 3;
const VISIBLE_MOBILE = 1;
const AUTOPLAY_MS = 6000;
const SWIPE_THRESHOLD = 50;

export function TestimonialsCarousel({
  items,
  channelLabel,
  channelDescription,
  prevLabel,
  nextLabel,
  slideLabels,
  paginationLabel,
}: TestimonialsCarouselProps) {
  const reduceMotion = useReducedMotion();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(VISIBLE_DESKTOP);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchDeltaX = useRef(0);
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const maxIndex = Math.max(0, items.length - visibleCount);

  // Responsive visible count — clamp currentIndex via the derived offset
  useEffect(() => {
    const updateVisible = () => {
      setVisibleCount(window.innerWidth < 768 ? VISIBLE_MOBILE : VISIBLE_DESKTOP);
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  const goTo = useCallback((index: number) => {
    setCurrentIndex(() => Math.max(0, Math.min(index, maxIndex)));
  }, [maxIndex]);

  // Autoplay: pauses on hover, reduced motion, and outside viewport
  useEffect(() => {
    if (reduceMotion || isHovered) {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      return;
    }

    autoplayRef.current = setInterval(next, AUTOPLAY_MS);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [next, reduceMotion, isHovered]);

  // Pause when section not visible
  useEffect(() => {
    const container = containerRef.current?.closest("section");
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      },
      { threshold: 0 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > SWIPE_THRESHOLD) {
      if (touchDeltaX.current < 0) next();
      else prev();
    }
    touchDeltaX.current = 0;
  };

  // Keyboard navigation (ArrowLeft / ArrowRight)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
      }
    },
    [next, prev],
  );

  const clampedIndex = Math.min(currentIndex, maxIndex);
  const trackOffset = -(clampedIndex * (100 / visibleCount));

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="group"
      aria-roledescription="carousel"
      aria-label={channelDescription}
    >
      {/* Discord-like channel header */}
      <div className="mb-4 flex items-center gap-2 rounded-t-xl border border-brand-white/10 bg-brand-white/5 px-4 py-2">
        <span className="text-brand-teal" aria-hidden="true">#</span>
        <span className="text-sm font-medium text-brand-white/70">{channelLabel}</span>
        <span className="ml-auto hidden text-xs text-brand-white/40 sm:inline">{channelDescription}</span>
      </div>

      {/* Carousel track */}
      <div
        className="overflow-hidden rounded-b-xl border border-t-0 border-brand-white/10 bg-brand-white/5"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <motion.div
          className="flex items-stretch"
          animate={reduceMotion ? { x: 0 } : { x: `${trackOffset}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          aria-live="polite"
        >
          {items.map((item, index) => (
            <div
              key={item.name}
              className="flex-shrink-0 px-3 py-1"
              style={{ width: `${100 / visibleCount}%` }}
              role="group"
              aria-roledescription="slide"
              aria-label={slideLabels[index] ?? `Slide ${index + 1}`}
            >
              <motion.article
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: reduceMotion ? 0 : index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="flex h-full gap-3 rounded-xl border border-brand-white/5 bg-brand-white/[0.03] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-teal/20 hover:bg-brand-white/[0.06] hover:shadow-[0_8px_24px_rgba(132,192,191,0.1)]"
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-white/10">
                  <Image
                    src={`https://api.dicebear.com/10.x/avataaars/svg?seed=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    width={40}
                    height={40}
                    unoptimized
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-semibold text-brand-white">{item.name}</span>
                    <span className="flex-shrink-0 text-xs text-brand-white/30">{item.timestamp}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-brand-white/40">{item.role}</p>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-white/80">
                    <span className="mr-0.5 text-lg font-bold text-brand-teal/30" aria-hidden="true">&ldquo;</span>
                    {item.quote}
                    <span className="ml-0.5 text-lg font-bold text-brand-teal/30" aria-hidden="true">&rdquo;</span>
                  </p>
                  {item.channel && (
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-teal/10 px-2.5 py-0.5 text-xs text-brand-teal">
                      <span aria-hidden="true">#</span>{item.channel}
                    </span>
                  )}
                </div>
              </motion.article>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation arrows */}
      {items.length > visibleCount && (
        <>
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 -translate-x-3 rounded-full border border-brand-white/10 bg-brand-dark/80 p-2 text-brand-white/60 backdrop-blur-sm transition-colors hover:bg-brand-dark hover:text-brand-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal md:-translate-x-5"
            aria-label={prevLabel}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 translate-x-3 rounded-full border border-brand-white/10 bg-brand-dark/80 p-2 text-brand-white/60 backdrop-blur-sm transition-colors hover:bg-brand-dark hover:text-brand-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal md:translate-x-5"
            aria-label={nextLabel}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Pagination dots */}
      {items.length > visibleCount && (
        <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label={paginationLabel}>
          {Array.from({ length: maxIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              role="tab"
              aria-selected={i === clampedIndex}
              aria-label={slideLabels[i] ?? `Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                i === clampedIndex ? "w-6 bg-brand-teal" : "w-2 bg-brand-white/30 hover:bg-brand-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
