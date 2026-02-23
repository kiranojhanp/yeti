"use client";

import { memo, useEffect, useRef, useState } from "react";
import { CircleHelp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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

function ComparisonHelp({ className }: { className?: string }) {
  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label="Comparison legend and caveat help"
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded-md border border-line-soft bg-surface-1 text-ink-soft shadow-sm transition-all hover:border-foreground/30 hover:bg-surface-2 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            className
          )}
        >
          <CircleHelp className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        align="end"
        side="bottom"
        sideOffset={10}
        className="w-[300px] rounded-xl border border-line-soft bg-surface-1 p-3 text-foreground shadow-[0_20px_45px_-30px_rgba(0,0,0,0.55)]"
      >
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-ink-soft">
            Quick guide
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
            Open any tool header for notes. In cells,
            <span className="mx-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-foreground/55 bg-foreground/[0.04] text-[10px] text-foreground/75">
              ~
            </span>
            means partial support or caveats.
          </p>
        </div>

        <div className="mt-3 space-y-1.5 rounded-lg border border-line-soft bg-surface-2/60 p-2.5 text-[11px] text-ink-soft">
          <p className="inline-flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] text-background">
              ✓
            </span>
            Native support
          </p>
          <p className="inline-flex items-center gap-2 ml-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-foreground/55 bg-foreground/[0.04] text-[10px] text-foreground/75">
              ~
            </span>
            Partial support
          </p>
          <p className="inline-flex items-center gap-2">
            <span className="text-foreground/60">—</span>
            Not available
          </p>
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-ink-soft">
          Snapshot from public docs (Feb 2026).
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

const CellContent = memo(function CellContent({
  value,
  label,
  tool,
  note,
}: {
  value: CellValue;
  label: string;
  tool: string;
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
        <span className="text-foreground/60 font-medium">—</span>
      )}
      {(value === "partial" || value === "note") && (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-foreground/55 bg-foreground/[0.04] text-foreground/75 text-xs cursor-default">
          ~
        </span>
      )}
    </span>
  );

  if (note) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`${tool} caveat for ${label}: ${note}`}
            className="inline-flex items-center justify-center"
          >
            {icon}
          </button>
        </TooltipTrigger>
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
            <div className="mb-2 flex items-center justify-end gap-4">
              <button
                type="button"
                onClick={() => setActiveBlurb(null)}
                className="text-[10px] text-ink-soft underline decoration-dotted underline-offset-4 hover:text-foreground"
              >
                Close
              </button>
            </div>
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
      <div className="rounded-xl border border-line-soft bg-surface-1 shadow-[0_14px_40px_-30px_rgba(0,0,0,0.35)]">
        <div className="flex items-center justify-end border-b border-line-soft/80 px-3 py-2">
          <ComparisonHelp />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-line-soft">
                <th
                  scope="col"
                  className="sticky left-0 z-20 w-44 bg-surface-1 px-3 py-3 text-left sm:w-48 md:px-4"
                >
                  <span className="sr-only">Capability</span>
                </th>
                {tools.map((tool) =>
                  tool === "Yeti" ? (
                    <th
                      key={tool}
                      scope="col"
                      className="border-x border-line-soft bg-surface-2 px-3 py-3 text-center font-serif text-sm sm:text-base md:px-4"
                    >
                      {tool}
                      <span className="block text-xs font-normal text-ink-soft">
                        you are here
                      </span>
                    </th>
                  ) : (
                    <th
                      key={tool}
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-ink-soft sm:text-sm md:px-4"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setActiveBlurb(activeBlurb === tool ? null : tool)
                        }
                        aria-expanded={activeBlurb === tool}
                        className={cn(
                          "underline decoration-dotted underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
              {rows.map((row, i) => {
                const rowShade =
                  i % 2 === 0 ? "bg-transparent" : "bg-surface-2/60";
                const stickyShade =
                  i % 2 === 0 ? "bg-surface-1" : "bg-surface-2/85";

                return (
                  <tr
                    key={row.label}
                    className={cn("border-b border-line-soft", rowShade)}
                  >
                    <th
                      scope="row"
                      className={cn(
                        "sticky left-0 z-10 px-3 py-2.5 text-left text-xs font-medium sm:text-sm md:px-4 md:py-3",
                        stickyShade
                      )}
                    >
                      {row.label}
                    </th>
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
                          label={row.label}
                          tool={tool}
                          note={row.notes?.[tool]}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
        </div>

        <ComparisonBlurbPanel
          activeBlurb={activeBlurb}
          setActiveBlurb={setActiveBlurb}
        />
      </div>
    </section>
  );
}
