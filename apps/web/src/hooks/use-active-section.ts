"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks the currently active section using IntersectionObserver.
 *
 * Takes the navbar height as input so the observer's root margin exactly
 * matches the navbar's bottom edge — a section becomes "active" the moment
 * its top crosses below the navbar, not at some arbitrary percentage.
 *
 * The callback only receives *changed* entries, not all observed sections.
 * We maintain a persistent Map (intersectingIds) to track which sections are
 * currently inside the observation zone across all callback invocations. Each
 * callback adds/removes entries, then we pick the winner from the full map by
 * finding the section whose top edge is closest to (and below) the navbar.
 */
export function useActiveSection(navbarHeight: number): string | null {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const intersectingIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (navbarHeight === 0) return;

    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    if (sections.length === 0) return;

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          intersectingIds.current.add(entry.target.id);
        } else {
          intersectingIds.current.delete(entry.target.id);
        }
      });

      if (intersectingIds.current.size === 0) {
        setActiveSection(null);
        return;
      }

      // Among all intersecting sections, pick the topmost one — i.e. the one
      // whose top edge is closest to the navbar bottom. This correctly handles
      // the case where two sections are simultaneously in the observation zone.
      let winner: string | null = null;
      let winnerTop = Infinity;

      sections.forEach((section) => {
        if (!intersectingIds.current.has(section.id)) return;
        const top = section.getBoundingClientRect().top;
        if (top < winnerTop) {
          winnerTop = top;
          winner = section.id;
        }
      });

      setActiveSection(winner);
    };

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      // Top margin = exact navbar height, so the observation zone starts right
      // where the navbar ends. Bottom margin = -50% so only the section that
      // has actually scrolled into view (past the navbar) is considered active.
      rootMargin: `-${navbarHeight}px 0px -50% 0px`,
      threshold: 0,
    });

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      intersectingIds.current.clear();
    };
  }, [navbarHeight]);

  return activeSection;
}
