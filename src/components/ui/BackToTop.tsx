"use client";

import { useCallback } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/Button";

type BackToTopProps = {
  label: string;
};

// Same shared CTA as every other button on the landing (see
// specs/unify-button-component/) — this also fixes a pre-existing bug: the
// old hand-rolled markup used `group-hover` on its arrow span without the
// parent ever having the `group` class, so the arrow never animated.
export function BackToTop({ label }: BackToTopProps) {
  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return <Button label={label} href="#hero" trailingIcon={<ArrowUp />} onClick={handleClick} />;
}
