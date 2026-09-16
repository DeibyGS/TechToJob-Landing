"use client";

import type { ComponentProps } from "react";
import { motion, useReducedMotion } from "motion/react";

type ButtonVariant = "primary" | "secondary";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-teal text-brand-dark",
  secondary: "bg-brand-dark text-brand-white",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type LinkProps = ComponentProps<typeof motion.a> & {
  variant?: ButtonVariant;
  href: string;
};

type ButtonElProps = ComponentProps<typeof motion.button> & {
  variant?: ButtonVariant;
  href?: undefined;
};

type ButtonProps = LinkProps | ButtonElProps;

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const reduceMotion = useReducedMotion();
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${className ?? ""}`;
  const tap = reduceMotion ? undefined : { scale: 0.98 };

  if (props.href !== undefined) {
    const { href, ...rest } = props as LinkProps;
    return (
      <motion.a
        href={href}
        whileTap={tap}
        className={classes}
        {...rest}
      />
    );
  }

  const buttonProps = props as ButtonElProps;
  return <motion.button whileTap={tap} className={classes} {...buttonProps} />;
}
