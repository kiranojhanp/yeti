"use client";

import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const tools = [
  "Yeti",
  "DBML",
  "Prisma",
  "Drizzle",
  "Liquibase",
  "Flyway",
  "Atlas",
];

const rows: {
  label: string;
  values: Record<string, "yes" | "no" | "partial" | "note">;
  notes?: Record<string, string>;
}[] = [
  {
    label: "Pure schema DSL",
    values: {
      Yeti: "yes",
      DBML: "yes",
      Prisma: "yes",
      Drizzle: "no",
      Liquibase: "no",
      Flyway: "no",
      Atlas: "yes",
    },
    notes: { Prisma: "PSL — but ORM-coupled, not standalone" },
  },
  {
    label: "ORM-free",
    values: {
      Yeti: "yes",
      DBML: "yes",
      Prisma: "no",
      Drizzle: "no",
      Liquibase: "yes",
      Flyway: "yes",
      Atlas: "yes",
    },
  },
  {
    label: "Migration engine",
    values: {
      Yeti: "yes",
      DBML: "no",
      Prisma: "yes",
      Drizzle: "yes",
      Liquibase: "yes",
      Flyway: "yes",
      Atlas: "yes",
    },
  },
  {
    label: "Hash-verified migrations",
    values: {
      Yeti: "yes",
      DBML: "no",
      Prisma: "partial",
      Drizzle: "no",
      Liquibase: "partial",
      Flyway: "partial",
      Atlas: "partial",
    },
    notes: {
      Yeti: "SHA-256 per file",
      Prisma: "Checksum only",
      Liquibase: "MD5, partial",
      Flyway: "Breaks on whitespace",
      Atlas: "Directory-level",
    },
  },
  {
    label: "VS Code autocomplete",
    values: {
      Yeti: "yes",
      DBML: "no",
      Prisma: "yes",
      Drizzle: "note",
      Liquibase: "no",
      Flyway: "no",
      Atlas: "no",
    },
    notes: { Drizzle: "TS only, not schema-aware" },
  },
  {
    label: "Go to definition",
    values: {
      Yeti: "yes",
      DBML: "no",
      Prisma: "no",
      Drizzle: "note",
      Liquibase: "no",
      Flyway: "no",
      Atlas: "no",
    },
    notes: { Drizzle: "TS only, not schema-aware" },
  },
  {
    label: "Rename symbol",
    values: {
      Yeti: "yes",
      DBML: "no",
      Prisma: "no",
      Drizzle: "note",
      Liquibase: "no",
      Flyway: "no",
      Atlas: "no",
    },
    notes: { Drizzle: "TS only, not schema-aware" },
  },
  {
    label: "No JVM or runtime required",
    values: {
      Yeti: "yes",
      DBML: "yes",
      Prisma: "yes",
      Drizzle: "yes",
      Liquibase: "no",
      Flyway: "no",
      Atlas: "yes",
    },
  },
  {
    label: "License",
    values: {
      Yeti: "yes",
      DBML: "yes",
      Prisma: "note",
      Drizzle: "note",
      Liquibase: "note",
      Flyway: "note",
      Atlas: "note",
    },
    notes: {
      Yeti: "MIT",
      DBML: "MIT",
      Prisma: "Apache 2.0",
      Drizzle: "Apache 2.0",
      Liquibase: "Open-core",
      Flyway: "Restricted (Redgate)",
      Atlas: "EULA — CE is Apache 2.0",
    },
  },
];

const blurbs: Record<string, { headline: string; body: string }> = {
  DBML: {
    headline: "Great DSL. No migrations.",
    body: "DBML is the closest thing to what Yeti is building — clean, ORM-free schema syntax. But it stops at documentation. No migration engine, no editor tooling beyond basic highlighting. Yeti is what DBML would be if it took migrations seriously.",
  },
  Prisma: {
    headline: "Best ORM DX. Tied to Prisma.",
    body: "The schema format only exists to serve Prisma Client. Step outside what Prisma supports and you're writing raw SQL anyway — with two sources of truth. Migrate also needs a shadow database just to diff.",
  },
  Drizzle: {
    headline: "TypeScript, not a DSL.",
    body: "The schema is TypeScript code — pgTable, mysqlTable. Switching databases means rewriting the schema. The editor experience is IntelliSense, not schema-aware tooling. No go-to-definition for entities you defined in your own file.",
  },
  Liquibase: {
    headline: "Changelog, not a schema.",
    body: "60+ databases and battle-tested since 2006. But Liquibase has no schema — just a changelog of every change ever made. To understand current state you replay history or inspect a live database. Enterprise features are commercial.",
  },
  Flyway: {
    headline: "Simple model, commercial ceiling.",
    body: "Numbered SQL files applied in order — clean mental model. But no schema definition, no rollbacks without paying, and checksum validation breaks if someone edits whitespace in an applied file. Now owned by Redgate.",
  },
  Atlas: {
    headline: "Most powerful. Steepest curve.",
    body: "Declarative schema-as-code, 50+ migration linting checks, Kubernetes operator. Genuinely impressive. But HCL syntax, EULA on the default binary, and the best features are behind Atlas Cloud.",
  },
};

type CellValue = "yes" | "no" | "partial" | "note";

const CellContent = memo(function CellContent({
  value,
  note,
}: {
  value: CellValue;
  note?: string;
}) {
  const icon = (
    <span className="inline-flex items-center justify-center">
      {value === "yes" && (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold">
          ✓
        </span>
      )}
      {value === "no" && (
        <span className="text-muted-foreground/40 font-light">—</span>
      )}
      {(value === "partial" || value === "note") && (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-foreground/30 text-foreground/50 text-xs cursor-default">
          ~
        </span>
      )}
    </span>
  );

  if (note) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{icon}</TooltipTrigger>
        <TooltipContent>{note}</TooltipContent>
      </Tooltip>
    );
  }

  return icon;
});

/** Client sub-component that owns the blurb disclosure state. */
function ComparisonBlurbPanel({
  activeBlurb,
  setActiveBlurb,
}: {
  activeBlurb: string | null;
  setActiveBlurb: (tool: string | null) => void;
}) {
  return (
    <>
      {/* Blurb panel — outside the table, no layout shift */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          activeBlurb
            ? "mb-6 max-h-72 opacity-100 md:max-h-40"
            : "mb-0 max-h-0 opacity-0"
        )}
      >
        {activeBlurb && blurbs[activeBlurb] && (
          <div className="rounded-xl border border-line-soft bg-surface-1 px-4 py-4 sm:px-6">
            <span className="mr-2 font-serif text-base sm:mr-3">
              {blurbs[activeBlurb].headline}
            </span>
            <span className="text-sm leading-relaxed text-ink-soft">
              {blurbs[activeBlurb].body}
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-line-soft">
              <th className="w-40 px-3 py-3 text-left sm:w-44 md:w-48 md:px-4" />
              {tools.map((tool) =>
                tool === "Yeti" ? (
                  <th
                    key={tool}
                    className="rounded-t-md border-x border-line-soft border-t bg-surface-2 px-3 py-3 text-center font-serif text-sm sm:text-base md:px-4"
                  >
                    {tool}
                    <span className="block text-xs font-normal text-ink-soft">
                      you are here
                    </span>
                  </th>
                ) : (
                  <th
                    key={tool}
                    className="px-3 py-3 text-center text-xs font-medium text-ink-soft sm:text-sm md:px-4"
                  >
                    <button
                      onClick={() =>
                        setActiveBlurb(activeBlurb === tool ? null : tool)
                      }
                      className={cn(
                        "underline decoration-dotted underline-offset-4 transition-colors",
                        activeBlurb === tool
                          ? "text-foreground"
                          : "hover:text-foreground"
                      )}
                    >
                      {tool}
                    </button>
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                className={cn(
                  "border-b border-line-soft",
                  i % 2 === 0 ? "bg-transparent" : "bg-surface-2/60"
                )}
              >
                <td className="px-3 py-2.5 text-xs font-medium sm:text-sm md:px-4 md:py-3">
                  {row.label}
                </td>
                {tools.map((tool) => (
                  <td
                    key={tool}
                    className={cn(
                      "px-3 py-2.5 text-center text-xs sm:text-sm md:px-4 md:py-3",
                      tool === "Yeti" &&
                        "border-x border-line-soft bg-surface-2"
                    )}
                  >
                    <CellContent
                      value={row.values[tool]}
                      note={row.notes?.[tool]}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function ComparisonSection() {
  const [activeBlurb, setActiveBlurb] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="comparison" className="section-shell">
      <div className="section-inner">
        <div
          ref={sectionRef}
          className="section-header opacity-0 translate-y-5 transition-all duration-700"
        >
          <div className="section-label">
            <span className="section-label-text">Comparison</span>
          </div>
          <h2 className="mb-4 font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl">
            How Yeti stacks up against{" "}
            <em className="premium-gradient-comparison italic">
              the alternatives
            </em>
          </h2>
          <p className="mx-auto max-w-xl text-sm text-ink-soft">
            Click any tool header to see the honest take. Hover{" "}
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-foreground/30 text-foreground/50 text-[10px] mx-0.5">
              ~
            </span>{" "}
            for caveats.
          </p>
        </div>

        <ComparisonBlurbPanel
          activeBlurb={activeBlurb}
          setActiveBlurb={setActiveBlurb}
        />

        <div className="mt-5 flex flex-wrap items-center justify-start gap-4 text-[11px] text-ink-soft sm:text-xs md:justify-end">
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-foreground text-background text-[10px]">
              ✓
            </span>
            Yes
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-foreground/30 text-[10px]">
              ~
            </span>
            Partial / other — hover for detail
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground/40">—</span>
            No
          </span>
        </div>
      </div>
    </section>
  );
}
