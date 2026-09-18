import type { ComponentProps, ReactNode } from "react";
import { ArrowRight, type LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-brand-teal text-brand-dark",
  secondary: "bg-brand-dark text-brand-white",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-6 py-3 text-sm",
  sm: "px-5 py-2.5 text-sm",
};

// Uppercase lives here, not baked into copy strings — single enforcement
// point so every consumer renders consistently regardless of how the
// source translation is cased (see DiscordCtaButton.tsx, which follows the
// same convention).
const BASE_CLASSES =
  "group relative inline-flex items-center justify-center overflow-hidden whitespace-nowrap rounded-full font-semibold uppercase tracking-wide shadow-sm shadow-brand-dark/10 transition-[transform,box-shadow] duration-300 ease-out hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-md hover:shadow-brand-dark/20 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-dark focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

// One-time diagonal shine sweep + icon-slide on hover — plain CSS
// (group-hover) throughout, no animation library. This used to sit
// alongside a `motion`-driven whileHover/whileTap on the outer element for
// the scale/lift; that's now plain CSS too (see BASE_CLASSES) specifically
// so this component has zero `motion` dependency and can be used inside a
// GSAP `ScrollTrigger`-pinned subtree (HowItWorksStage.tsx) without
// violating the constitution's "GSAP and motion never share a DOM
// subtree" rule.
function ButtonContent({ icon: Icon, children }: { icon?: LucideIcon; children: React.ReactNode }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-brand-white/40 opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[350%] group-hover:opacity-100"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4" aria-hidden />}
        {children}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </span>
    </>
  );
}

type LinkProps = ComponentProps<"a"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  href: string;
};

type ButtonElProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: LucideIcon;
  href?: undefined;
};

type ButtonProps = (LinkProps | ButtonElProps) & { children?: ReactNode };

export function Button({ variant = "primary", size = "md", icon, className, children, ...props }: ButtonProps) {
  const classes = `${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className ?? ""}`;

  if (props.href !== undefined) {
    const { href, ...rest } = props as LinkProps;
    return (
      <a href={href} className={classes} {...rest}>
        <ButtonContent icon={icon}>{children}</ButtonContent>
      </a>
    );
  }

  const buttonProps = props as ButtonElProps;
  return (
    <button className={classes} {...buttonProps}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </button>
  );
}
