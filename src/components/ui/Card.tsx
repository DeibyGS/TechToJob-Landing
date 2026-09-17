import type { ComponentPropsWithoutRef } from "react";

type CardBorder = "dark" | "light";

const BORDER_CLASSES: Record<CardBorder, string> = {
  dark: "border-brand-dark/10",
  light: "border-brand-white/15",
};

type CardProps = ComponentPropsWithoutRef<"div"> & {
  border?: CardBorder;
};

export function Card({ children, className, border = "dark", ...rest }: CardProps) {
  return (
    <div
      className={`rounded-2xl border ${BORDER_CLASSES[border]} p-6 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </div>
  );
}
