"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NavLinks } from "@/components/layout/NavLinks";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { Button } from "@/components/ui/Button";
import { DiscordIcon } from "@/components/ui/DiscordIcon";

type MobileMenuProps = {
  links: { id: string; label: string }[];
  currentLocale: string;
  /** Translated a11y labels (messages/*.json → Nav) — never hardcoded. */
  labels: { open: string; close: string; menu: string };
  /** Primary conversion action, kept one tap away inside the menu. */
  cta: { label: string; href: string };
};

/**
 * Classic hamburger dropdown menu for mobile navigation.
 * Replaces the LanguageSwitcher position in the header on mobile (<768px).
 * Contains NavLinks (vertical), the primary Discord CTA, and LanguageSwitcher.
 * Closes on: link click, language switch, outside click, Escape key.
 */
export function MobileMenu({ links, currentLocale, labels, cta }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-brand-teal/25 bg-brand-white text-brand-dark shadow-[0_4px_16px_rgba(132,192,191,0.2)] transition-colors hover:bg-brand-teal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? labels.close : labels.open}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Dropdown panel */}
      {/* Blurred backdrop behind the panel — keeps focus on the menu; a tap
          on it closes the menu via the outside-click handler above. Sized
          from the header's bottom edge (absolute, not fixed: the header's
          transform would make `fixed` resolve against the header itself). */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="absolute inset-x-0 top-full z-40 h-[100dvh] bg-brand-dark/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-label={labels.menu}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-50 mt-2 mx-4 rounded-2xl border border-brand-teal/25 bg-brand-white p-4 shadow-[0_8px_32px_rgba(132,192,191,0.25)]"
          >
            {/* NavLinks — vertical layout */}
            <NavLinks links={links} orientation="vertical" onLinkClick={handleClose} />

            {/* Primary CTA — hiding the main conversion action behind the
                menu with no emphasis costs conversions, so it gets the same
                cta Button as the Hero, full width. */}
            <div className="mt-3 flex justify-center">
              <Button
                label={cta.label}
                href={cta.href}
                icon={<DiscordIcon />}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
              />
            </div>

            {/* Divider */}
            <div className="my-3 border-t border-brand-teal/15" />

            {/* LanguageSwitcher */}
            <div className="flex justify-center">
              <LanguageSwitcher currentLocale={currentLocale} onSwitch={handleClose} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
