"use client";

import { useCallback, useEffect, useRef } from "react";

const features = [
  {
    title: "Error-recovering parser",
    description:
      "The @yeti/parse package reads .yeti files and produces a fully typed AST with line and column tracking on every node. When you make a syntax mistake, it recovers and keeps parsing — you see all your errors at once, not one at a time.",
    icon: (
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
  },
  {
    title: "Full PostgreSQL DDL",
    description:
      "@yeti/pg-generator converts your schema to valid PostgreSQL. Enum types, foreign key ordering, double-quoted identifiers, and SQL injection-safe defaults — all handled. You write the schema; it writes the SQL.",
    icon: (
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
  },
  {
    title: "Hash-verified migrations",
    description:
      "@yeti/migration-core validates SHA-256 hashes on every applied migration. Sequence gaps, out-of-order applies, and tampered files all stop the run before anything touches your database.",
    icon: (
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
  },
  {
    title: "SQLite adapter",
    description:
      "@yeti/sqlite-migration runs each migration as an immediate transaction, WAL-mode safe, with process-level locking to prevent concurrent runs. Works with better-sqlite3 out of the box.",
    icon: (
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
  },
  {
    title: "VS Code extension",
    description:
      "Autocomplete, hover documentation, go to definition, rename symbol, and a Generate SQL command — all schema-aware. It only loads when a .yeti file is open.",
    icon: (
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
  },
  {
    title: "Extensible generators",
    description:
      "Adding a new database target means implementing two interfaces: SQLDialect and TemplateProvider. The base generator handles the rest. MySQL, SQLite DDL, documentation — the architecture doesn't care.",
    icon: (
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
  },
];

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
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-5");
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
      className="py-16 md:py-24 px-6 md:px-12 bg-foreground text-background"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 border-b border-dashed border-background/40 mb-4">
            <span className="text-sm uppercase tracking-widest font-medium text-background/60">
              Features
            </span>
          </div>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-background">
            Everything in the toolchain,{" "}
            <em className="italic text-background/50">
              nothing you don&apos;t need
            </em>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={setItemRef(index)}
              className="opacity-0 translate-y-5 transition-all duration-700"
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div
                tabIndex={0}
                className="group flex flex-col items-start text-left rounded-xl border border-background/10 bg-gradient-to-b from-background/10 to-background/0 p-6 md:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-background/20 hover:bg-background/10 hover:shadow-[0_12px_32px_-22px_rgba(255,255,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background/30 focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-background/10 border border-background/15 rounded-lg flex items-center justify-center mb-6 text-background/70 ring-1 ring-inset ring-background/10 transition-all duration-300 group-hover:bg-background/20 group-hover:scale-[1.03] group-hover:text-background">
                  {feature.icon}
                </div>
                <h3 className="font-serif text-2xl mb-3 text-background/90 transition-colors duration-300 group-hover:text-background">
                  {feature.title}
                </h3>
                <p className="text-background/55 text-sm leading-relaxed transition-colors duration-300 group-hover:text-background/70">
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
