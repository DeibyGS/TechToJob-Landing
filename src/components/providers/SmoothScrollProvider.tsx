"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { initSmoothScroll } from "@/components/animations/smoothScroll";

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    return initSmoothScroll();
  }, []);

  return children;
}
