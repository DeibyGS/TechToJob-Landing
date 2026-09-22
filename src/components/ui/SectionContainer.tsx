import type { ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
  background?: "light" | "dark";
  id?: string;
  /** Vertical padding preset: "default" = py-16/py-24, "compact" = py-10/py-14, "none" = no padding. */
  padding?: "default" | "compact" | "none";
  /** Fills the initial viewport height and vertically centers content — for
   * a section that should be the first full-screen impression (currently
   * only Hero). Opt-in, so every other section's layout is unaffected. */
  fullHeight?: boolean;
  /** Rendered as a full-bleed layer behind `children`, sized to the whole
   * section — not just the centered max-w-7xl content column. `children`
   * sits inside that narrower column, so a decoration meant to wash the
   * entire section (e.g. Hero's ambient glow) has to live outside it. */
  backgroundDecoration?: ReactNode;
};

const PADDING_CLASSES: Record<NonNullable<SectionContainerProps["padding"]>, string> = {
  default: "py-16 md:py-24",
  compact: "py-10 md:py-14",
  none: "",
};

export function SectionContainer({
  children,
  className,
  background = "light",
  id,
  padding = "default",
  fullHeight,
  backgroundDecoration,
}: SectionContainerProps) {
  const backgroundClasses =
    background === "dark"
      ? "bg-brand-dark text-brand-white"
      : "bg-brand-white text-brand-dark";
  const heightClasses = fullHeight ? "flex min-h-[100dvh] flex-col justify-center" : "";
  // `flex-1` lets a fullHeight section's content column fill the available
  // height itself, instead of being centered as one fixed-height block —
  // that's what lets a child layout (e.g. HeroStage) distribute its own
  // content top-weighted vs. bottom-weighted instead of the whole stack
  // landing wherever its combined height happens to center to.
  const contentClasses = fullHeight ? "flex flex-1 flex-col" : "";

  return (
    <section id={id} className={`relative ${backgroundClasses} ${heightClasses} ${PADDING_CLASSES[padding]}`}>
      {backgroundDecoration && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {backgroundDecoration}
        </div>
      )}
      <div className={`relative mx-auto w-full max-w-7xl px-4 md:px-8 ${contentClasses} ${className ?? ""}`}>
        {children}
      </div>
    </section>
  );
}
