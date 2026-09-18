"use client";

import {
  cloneElement,
  isValidElement,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from "react";
import { ArrowRight, Loader2 } from "lucide-react";

type ButtonVariant = "cta" | "pill";

const ICON_CLASSES = "h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5";

// `icon`/`trailingIcon` take a pre-rendered element (`<DiscordIcon />`, not
// `DiscordIcon`) — several callers (ClosingSection, and any other Server
// Component) pass these across the server/client boundary, and React can't
// serialize a raw function reference there ("Functions cannot be passed
// directly to Client Components"). An already-rendered element is fine to
// pass through; this just clones it to inject the sizing/animation classes
// Button needs, regardless of what className the caller's element already had.
function withIconClasses(icon: ReactNode, className: string): ReactNode {
  if (!isValidElement(icon)) return icon;
  return cloneElement(icon as ReactElement<{ className?: string; "aria-hidden"?: boolean }>, {
    className,
    "aria-hidden": true,
  });
}

type ButtonProps = {
  variant?: ButtonVariant;
  label: string;
  className?: string;
  /** cta only — shown on hover instead of `label`. Omit when there's no
   * distinct hover phrasing (e.g. HowItWorks steps) — hovering then only
   * reveals the arrow, the label itself doesn't change. */
  hoverLabel?: string;
  /** cta only — leading icon. Omit for no leading icon at all (e.g.
   * BackToTop) — Button has no built-in fallback icon, callers own that
   * decision (see DiscordIcon.tsx for Hero/Closing's case). */
  icon?: ReactNode;
  /** cta only — defaults to ArrowRight. BackToTop passes ArrowUp since it
   * scrolls up, not sideways. */
  trailingIcon?: ReactNode;
  /** cta only — swaps the whole content for a spinner and forces the
   * disabled look, without the caller having to juggle label/icon swapping
   * itself. */
  loading?: boolean;
  /** pill only. */
  isActive?: boolean;
  /** Renders as this element instead of the default `<a>`/`<button>` — e.g.
   * LanguageSwitcher needs next-intl's locale-aware `Link` for correct
   * /es //en prefixing, not a plain anchor. Whatever `as` needs (locale,
   * scroll, href, ...) is forwarded via `...rest`; Button doesn't need to
   * know what next-intl is. */
  as?: ElementType;
  href?: string;
} & Record<string, unknown>;

/**
 * Every clickable "button-shaped" element on the landing — CTAs, nav pills,
 * language switcher, back-to-top — in one place, so a visual/behavioral
 * change to any variant only needs to happen once. See
 * specs/unify-button-component/ for the consolidation this replaced
 * (Button.tsx's old shine-sweep style + DiscordCtaButton.tsx, merged here).
 *
 * Zero `motion` dependency, on purpose: this renders inside GSAP
 * ScrollTrigger subtrees (Hero, HowItWorks) and the constitution's
 * hybrid-stack rule forbids mixing GSAP and `motion` in the same subtree.
 *
 * `variant="cta"`: filled teal, glow shadow, arrow hidden until hover. Rests
 * sized to `label`; on hover/focus it animates its own width to fit
 * `hoverLabel` (or `label` again, if omitted — only the arrow then animates
 * in) and cross-fades the text. Both label spans are measured via ref (not
 * guessed with a fixed max-width) so the button never sits pre-sized to the
 * longer label and never clips the shorter one either.
 *
 * `variant="pill"`: nav links / language switcher — small pill, subtle
 * border, teal fill when `isActive` or hovered. No expand/cross-fade
 * mechanic, no icon.
 */
export function Button({
  variant = "cta",
  label,
  className,
  hoverLabel,
  icon,
  trailingIcon,
  loading = false,
  isActive,
  as,
  href,
  ...rest
}: ButtonProps) {
  if (variant === "pill") {
    return (
      <PillButton label={label} className={className} isActive={isActive} as={as} href={href} {...rest} />
    );
  }

  return (
    <CtaButton
      label={label}
      hoverLabel={hoverLabel ?? label}
      icon={icon}
      trailingIcon={trailingIcon ?? <ArrowRight />}
      loading={loading}
      className={className}
      as={as}
      href={href}
      {...rest}
    />
  );
}

function PillButton({
  label,
  className,
  isActive,
  as: As,
  href,
  ...rest
}: {
  label: string;
  className?: string;
  isActive?: boolean;
  as?: ElementType;
  href?: string;
} & Record<string, unknown>) {
  // Padding is left to `className` (not hardcoded here) because NavLinks and
  // LanguageSwitcher use different pill sizes (text-sm vs text-xs context) —
  // baking one padding in here would fight whatever the caller passes,
  // since Tailwind's generated-CSS order doesn't reliably let a later
  // className string override an earlier conflicting utility.
  const classes = `rounded-full transition-colors ${
    isActive ? "bg-brand-teal text-brand-dark" : "text-brand-dark/70 hover:bg-brand-teal hover:text-brand-dark"
  } ${className ?? ""}`;

  if (As) {
    return (
      <As className={classes} href={href} {...rest}>
        {label}
      </As>
    );
  }
  if (href !== undefined) {
    return (
      <a className={classes} href={href} {...rest}>
        {label}
      </a>
    );
  }
  return (
    <button className={classes} {...rest}>
      {label}
    </button>
  );
}

function CtaButton({
  label,
  hoverLabel,
  icon: Icon,
  trailingIcon: TrailingIcon,
  loading,
  className,
  as: As,
  href,
  ...rest
}: {
  label: string;
  hoverLabel: string;
  icon?: ReactNode;
  trailingIcon: ReactNode;
  loading: boolean;
  className?: string;
  as?: ElementType;
  href?: string;
} & Record<string, unknown>) {
  const [isActiveHover, setIsActiveHover] = useState(false);
  const [widths, setWidths] = useState<{ collapsed: number; expanded: number } | null>(null);
  const collapsedRef = useRef<HTMLSpanElement>(null);
  const expandedRef = useRef<HTMLSpanElement>(null);

  const activate = useCallback(() => setIsActiveHover(true), []);
  const deactivate = useCallback(() => setIsActiveHover(false), []);

  useLayoutEffect(() => {
    if (collapsedRef.current && expandedRef.current) {
      setWidths({
        collapsed: collapsedRef.current.scrollWidth,
        expanded: expandedRef.current.scrollWidth,
      });
    }
  }, [label, hoverLabel]);

  const classes = `group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-brand-teal px-5 py-2.5 text-xs font-semibold tracking-wide whitespace-nowrap text-brand-dark uppercase shadow-[0_6px_20px_rgba(0,0,0,0.35),0_0_20px_rgba(132,192,191,0.25)] transition-shadow duration-300 ease-out hover:shadow-[0_10px_28px_rgba(0,0,0,0.4),0_0_32px_rgba(132,192,191,0.45)] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 focus-visible:ring-offset-brand-dark focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ""}`;

  const content: ReactNode = loading ? (
    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
  ) : (
    <>
      {withIconClasses(Icon, ICON_CLASSES)}
      {/* Width lives here, not on the outer element — this span's measured
          width is the label only, so the outer flex layout (icon + gap +
          padding) still sizes itself around it instead of being fought over
          by two different width sources. */}
      <span
        className="relative grid h-4 shrink-0 overflow-hidden transition-[width] duration-300 ease-out"
        style={widths ? { width: isActiveHover ? widths.expanded : widths.collapsed } : undefined}
      >
        <span
          ref={collapsedRef}
          className="col-start-1 row-start-1 inline-flex w-max items-center gap-1.5 transition-opacity duration-200 group-hover:opacity-0 group-focus-visible:opacity-0"
        >
          {label}
        </span>
        <span
          ref={expandedRef}
          className="col-start-1 row-start-1 inline-flex w-max items-center gap-1.5 opacity-0 transition-opacity delay-100 duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          {hoverLabel}
          {withIconClasses(TrailingIcon, "h-3.5 w-3.5")}
        </span>
      </span>
    </>
  );

  const hoverHandlers = {
    onMouseEnter: activate,
    onMouseLeave: deactivate,
    onFocus: activate,
    onBlur: deactivate,
  };

  if (As) {
    return (
      <As className={classes} href={href} {...hoverHandlers} {...rest}>
        {content}
      </As>
    );
  }

  if (href !== undefined) {
    return (
      <a className={classes} href={href} {...hoverHandlers} {...rest}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} disabled={loading || Boolean(rest.disabled)} {...hoverHandlers} {...rest}>
      {content}
    </button>
  );
}
