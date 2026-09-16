import type { ReactNode } from "react";

type SectionContainerProps = {
  children: ReactNode;
  className?: string;
  background?: "light" | "dark";
  id?: string;
};

export function SectionContainer({
  children,
  className,
  background = "light",
  id,
}: SectionContainerProps) {
  const backgroundClasses =
    background === "dark"
      ? "bg-brand-dark text-brand-white"
      : "bg-brand-white text-brand-dark";

  return (
    <section id={id} className={`${backgroundClasses} py-16 md:py-24`}>
      <div className={`mx-auto max-w-7xl px-4 md:px-8 ${className ?? ""}`}>
        {children}
      </div>
    </section>
  );
}
