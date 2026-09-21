"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";
import { NavLinks } from "@/components/layout/NavLinks";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

type MobileMenuProps = {
  links: { id: string; label: string }[];
  currentLocale: string;
};

/**
 * Classic hamburger dropdown menu for mobile navigation.
 * Replaces the LanguageSwitcher position in the header on mobile (<768px).
 * Contains NavLinks (vertical) + LanguageSwitcher at the bottom.
 * Closes on: link click, language switch, outside click, Escape key.
 */
export function MobileMenu({ links, currentLocale }: MobileMenuProps) {
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
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            role="dialog"
            aria-label="Navegación móvil"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-x-0 top-full z-50 mt-2 mx-4 rounded-2xl border border-brand-teal/25 bg-brand-white p-4 shadow-[0_8px_32px_rgba(132,192,191,0.25)]"
          >
            {/* NavLinks — vertical layout */}
            <NavLinks links={links} orientation="vertical" onLinkClick={handleClose} />

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
