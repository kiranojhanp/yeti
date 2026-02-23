"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/use-active-section";

const navLinks = [
  { label: "Features", href: "#features", id: "features" },
  { label: "Comparison", href: "#comparison", id: "comparison" },
  { label: "Testimonials", href: "#testimonials", id: "testimonials" },
  { label: "Pricing", href: "#pricing", id: "pricing" },
  { label: "FAQ", href: "#faq", id: "faq" },
] as const;

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const activeSection = useActiveSection(navbarHeight);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const ro = new ResizeObserver(([entry]) => {
      setNavbarHeight(entry.contentRect.height);
    });
    ro.observe(nav);
    return () => ro.disconnect();
  }, []);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    if (window.location.pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 top-0 z-50 border-b border-line-soft bg-surface-1/80 backdrop-blur-lg"
    >
      <div className="flex items-center justify-between px-5 py-3.5 sm:px-6 md:px-10 lg:px-12">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="inline-flex items-center gap-2 font-serif text-xl sm:text-2xl"
        >
          <Image
            src="/icon.png"
            alt="Yeti"
            width={24}
            height={24}
            className="h-6 w-6"
          />
          <span>Yeti.</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-7 md:flex">
          {navLinks.map(({ label, href, id }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={href}
                href={href}
                className={cn(
                  "text-sm transition-colors",
                  isActive ? "font-medium text-foreground" : "link-subtle"
                )}
              >
                {label}
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/kiranojhanp/yeti"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill-compact-primary"
          >
            View on GitHub
          </a>

          {/* Mobile hamburger */}
          <button
            className="flex flex-col gap-1.5 p-1 md:hidden"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <span
              className={cn(
                "block w-5 h-px bg-foreground transition-all duration-300 origin-center",
                menuOpen && "rotate-45 translate-y-[7px]"
              )}
            />
            <span
              className={cn(
                "block w-5 h-px bg-foreground transition-all duration-300",
                menuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block w-5 h-px bg-foreground transition-all duration-300 origin-center",
                menuOpen && "-rotate-45 -translate-y-[7px]"
              )}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden overflow-hidden border-t border-line-soft transition-all duration-300 ease-in-out",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-4 px-5 py-4 sm:px-6">
          {navLinks.map(({ label, href, id }) => {
            const isActive = activeSection === id;
            return (
              <a
                key={href}
                href={href}
                onClick={() => {
                  setMenuOpen(false);
                }}
                className={cn(
                  "text-sm transition-colors",
                  isActive ? "font-medium text-foreground" : "link-subtle"
                )}
              >
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
