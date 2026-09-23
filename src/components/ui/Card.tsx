import type { ComponentPropsWithoutRef } from "react";

type CardBorder = "dark" | "light";

const BORDER_CLASSES: Record<CardBorder, string> = {
  dark: "border-brand-dark/10",
  light: "border-brand-white/15",
};

type CardProps = ComponentPropsWithoutRef<"div"> & {
  border?: CardBorder;
  /** Semantic element — `article` for self-contained entries (e.g. news). */
  as?: "div" | "article";
};

export function Card({ children, className, border = "dark", as: Tag = "div", ...rest }: CardProps) {
  return (
    <Tag
      className={`rounded-2xl border ${BORDER_CLASSES[border]} p-6 ${className ?? ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
