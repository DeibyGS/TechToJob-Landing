"use client";

import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

type ButtonVariant = "primary" | "secondary";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-teal text-brand-dark",
  secondary: "bg-brand-dark text-brand-white",
};

const BASE_CLASSES =
  "group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold shadow-sm shadow-brand-dark/10 transition-shadow hover:shadow-md hover:shadow-brand-dark/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

// One-time diagonal shine sweep + icon-slide on hover. Plain CSS
// (group-hover), not `motion` — coexists with the outer whileHover
// scale/shadow (motion) without fighting it, since each is triggered by a
// different mechanism (motion's pointer listeners vs. the native :hover
// pseudo-class) reacting to the same real hover event.
function ButtonContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-brand-white/40 opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[350%] group-hover:opacity-100"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </span>
    </>
  );
}

type LinkProps = ComponentProps<typeof motion.a> & {
  variant?: ButtonVariant;
  href: string;
};

type ButtonElProps = ComponentProps<typeof motion.button> & {
  variant?: ButtonVariant;
  href?: undefined;
};

type ButtonProps = (LinkProps | ButtonElProps) & { children?: ReactNode };

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className ?? ""}`;
  const tap = reduceMotion ? undefined : { scale: 0.98 };
  const hover = reduceMotion ? undefined : { scale: 1.03, y: -2 };

  if (props.href !== undefined) {
    const { href, ...rest } = props as LinkProps;
    return (
      <motion.a href={href} whileHover={hover} whileTap={tap} className={classes} {...rest}>
        <ButtonContent>{children}</ButtonContent>
      </motion.a>
    );
  }

  const buttonProps = props as ButtonElProps;
  return (
    <motion.button whileHover={hover} whileTap={tap} className={classes} {...buttonProps}>
      <ButtonContent>{children}</ButtonContent>
    </motion.button>
  );
}
