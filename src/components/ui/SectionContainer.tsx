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
};

export function SectionContainer({
  children,
  className,
  background = "light",
  id,
  fullHeight,
}: SectionContainerProps) {
  const backgroundClasses =
    background === "dark"
      ? "bg-brand-dark text-brand-white"
      : "bg-brand-white text-brand-dark";
  const heightClasses = fullHeight ? "flex min-h-[100dvh] flex-col justify-center" : "";

  return (
    <section id={id} className={`${backgroundClasses} ${heightClasses} py-16 md:py-24`}>
      <div className={`mx-auto w-full max-w-7xl px-4 md:px-8 ${className ?? ""}`}>
        {children}
      </div>
    </section>
  );
}
