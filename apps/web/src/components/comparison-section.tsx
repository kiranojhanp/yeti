"use client";

import { memo, useEffect, useRef } from "react";
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
import { comparisonContent, type CellValue } from "@/content/site-content";

const tools = comparisonContent.tools;
const rows: readonly {
  label: string;
  values: Record<string, CellValue>;
  notes?: Record<string, string>;
}[] = comparisonContent.rows;
const blurbs = comparisonContent.blurbs;

type ToolBlurbKey = keyof typeof blurbs;

function ComparisonHelp({ className }: { className?: string }) {
  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          aria-label={comparisonContent.help.ariaLabel}
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
            {comparisonContent.help.heading}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">
            {comparisonContent.help.bodyPrefix}
            <span className="mx-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-foreground/55 bg-foreground/[0.04] text-[10px] text-foreground/75">
              ~
            </span>
            {comparisonContent.help.bodySuffix}
          </p>
        </div>

        <div className="mt-3 space-y-1.5 rounded-lg border border-line-soft bg-surface-2/60 p-2.5 text-[11px] text-ink-soft">
          <p className="inline-flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-emerald-300/45 bg-emerald-300/15 text-xs font-semibold text-emerald-100">
              ✓
            </span>
            {comparisonContent.help.nativeSupport}
          </p>
          <p className="inline-flex items-center gap-2 ml-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-amber-300/45 bg-amber-300/15 text-xs font-semibold text-amber-100">
              ~
            </span>
            {comparisonContent.help.partialSupport}
          </p>
          <p className="inline-flex items-center gap-2">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-rose-300/45 bg-rose-300/15 text-rose-100 text-xs font-semibold">
              ✕
            </span>
            {comparisonContent.help.notAvailable}
          </p>
        </div>

        <p className="mt-2 text-[10px] leading-relaxed text-ink-soft">
          {comparisonContent.help.footnote}
        </p>
      </HoverCardContent>
    </HoverCard>
  );
}

function ToolHeaderBlurb({ tool }: { tool: ToolBlurbKey }) {
  const blurb = blurbs[tool];

  return (
    <HoverCard openDelay={120} closeDelay={80}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          className="underline decoration-dotted underline-offset-4 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {tool}
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        align="center"
        side="bottom"
        sideOffset={10}
        className="w-[320px] rounded-xl border border-line-soft bg-surface-1 p-3 text-left text-foreground shadow-[0_20px_45px_-30px_rgba(0,0,0,0.55)]"
      >
        <p className="text-[10px] uppercase tracking-[0.12em] text-ink-soft">
          {tool}
        </p>
        <p className="mt-1.5 font-serif text-[15px] leading-snug text-foreground">
          {blurb.headline}
        </p>
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
          {blurb.body}
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
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-emerald-300/45 bg-emerald-300/15 text-emerald-100 text-xs font-bold">
          ✓
        </span>
      )}
      {value === "no" && (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-rose-300/45 bg-rose-300/15 text-rose-100 text-xs font-semibold">
          ✕
        </span>
      )}
      {(value === "partial" || value === "note") && (
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-amber-300/45 bg-amber-300/15 text-amber-100 text-xs cursor-default">
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

function ComparisonBlurbPanel() {
  return (
    <>
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
                  <span className="sr-only">
                    {comparisonContent.help.capabilityLabel}
                  </span>
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
                        {comparisonContent.yetiColumnSubtitle}
                      </span>
                    </th>
                  ) : (
                    <th
                      key={tool}
                      scope="col"
                      className="px-3 py-3 text-center text-xs font-medium text-ink-soft sm:text-sm md:px-4"
                    >
                      <ToolHeaderBlurb tool={tool as ToolBlurbKey} />
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
  const sectionRef = useRef<HTMLDivElement>(null);

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
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="comparison" className="section-shell">
      <div className="section-inner">
        <div ref={sectionRef} className="section-header reveal-up-init">
          <div className="section-label">
            <span className="section-label-text">
              {comparisonContent.label}
            </span>
          </div>
          <h2 className="mb-4 font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl">
            {comparisonContent.titlePrefix}{" "}
            <em className="premium-gradient-comparison italic">
              {comparisonContent.titleEmphasis}
            </em>
          </h2>
        </div>

        <ComparisonBlurbPanel />
      </div>
    </section>
  );
}
