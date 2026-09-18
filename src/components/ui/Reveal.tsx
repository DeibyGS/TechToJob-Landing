"use client";

import type { ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react";
import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  whileHover?: HTMLMotionProps<"div">["whileHover"];
  whileTap?: HTMLMotionProps<"div">["whileTap"];
};

export function Reveal({ children, delay = 0, className, whileHover, whileTap }: RevealProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={reduceMotion ? undefined : whileHover}
      whileTap={reduceMotion ? undefined : whileTap}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
