"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  featuresSectionContent,
  type FeatureIconKey,
} from "@/content/site-content";

const featureIcons: Record<FeatureIconKey, React.ReactNode> = {
  parser: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  postgres: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  ),
  migrations: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  sqlite: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  ),
  vscode: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  ),
  extensible: (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      <path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M8.46 8.46a5 5 0 0 0 0 7.07" />
    </svg>
  ),
};

export function FeaturesSection() {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const setItemRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      itemRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-up-visible");
            entry.target.classList.remove("reveal-up-init");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    itemRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
      itemRefs.current = [];
    };
  }, []);

  return (
    <section
      id="features"
      className="section-shell bg-surface-2 text-foreground"
    >
      <div className="section-inner">
        <div className="section-header">
          <div className="section-label">
            <span className="section-label-text">
              {featuresSectionContent.label}
            </span>
          </div>
          <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {featuresSectionContent.titlePrefix}{" "}
            <em className="premium-gradient-features italic">
              {featuresSectionContent.titleEmphasis}
            </em>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3 md:gap-8 md:auto-rows-fr">
          {featuresSectionContent.items.map((feature, index) => (
            <div
              key={feature.title}
              ref={setItemRef(index)}
              className="reveal-up-init h-full"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div tabIndex={0} className="feature-card group">
                <div className="feature-icon-badge">
                  {featureIcons[feature.iconKey]}
                </div>
                <h3 className="mb-3 font-serif text-xl text-foreground transition-colors duration-300 sm:text-2xl">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-soft transition-colors duration-300 group-hover:text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
