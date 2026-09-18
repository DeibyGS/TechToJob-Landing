"use client";

import { useCallback } from "react";

type BackToTopProps = {
  label: string;
};

export function BackToTop({ label }: BackToTopProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <a
      href="#hero"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full bg-brand-teal px-5 py-2.5 text-xs font-semibold tracking-wide uppercase text-brand-dark shadow-[0_0_20px_rgba(132,192,191,0.3)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(132,192,191,0.5)] active:scale-[0.98]"
    >
      {label}
      <span className="transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
    </a>
  );
}
