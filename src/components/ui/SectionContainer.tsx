import type { ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
  background?: "light" | "dark";
  id?: string;
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

export function SectionContainer({
  children,
  className,
  background = "light",
  id,
  fullHeight,
  backgroundDecoration,
}: SectionContainerProps) {
  const backgroundClasses =
    background === "dark"
      ? "bg-brand-dark text-brand-white"
      : "bg-brand-white text-brand-dark";
  const heightClasses = fullHeight ? "flex min-h-[100dvh] flex-col justify-center" : "";

  return (
    <section id={id} className={`relative ${backgroundClasses} ${heightClasses} py-16 md:py-24`}>
      {backgroundDecoration && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {backgroundDecoration}
        </div>
      )}
      <div className={`relative mx-auto w-full max-w-7xl px-4 md:px-8 ${className ?? ""}`}>
        {children}
      </div>
    </section>
  );
}
