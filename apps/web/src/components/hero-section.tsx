import { ArrowRight, Play } from "lucide-react";
import { DashboardMockup } from "./dashboard-mockup";

export function HeroSection() {
  return (
    <section className="section-shell relative flex min-h-[90vh] flex-col justify-center overflow-hidden pt-28 lg:pt-36">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-surface-3/70 blur-[120px] animate-float" />

      <div className="max-w-4xl mx-auto text-center z-10 relative">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-line-soft bg-background/80 px-4 py-2 shadow-sm animate-fade-down">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/30 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground/40" />
          </span>
          <span className="text-sm font-medium text-ink-soft">
            v0.0.4 — now available
          </span>
        </div>

        <h1
          className="mb-6 text-balance font-serif text-5xl leading-[0.96] text-foreground animate-fade-up sm:text-6xl md:mb-8 md:text-8xl md:leading-[1.1]"
          style={{ animationDelay: "100ms" }}
        >
          Write your schema once. <br className="hidden md:block" />
          In <span className="premium-gradient-hero italic">plain text.</span>
        </h1>

        <p
          className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-ink-soft animate-fade-up sm:text-lg md:mb-10 md:text-xl"
          style={{ animationDelay: "200ms" }}
        >
          Yeti is a schema definition language for databases. Describe what you
          want — entities, relationships, constraints — and it generates
          production-ready SQL. No ORM lock-in. No boilerplate. Just a{" "}
          <code className="rounded bg-foreground/6 px-1.5 py-0.5 font-mono text-foreground">
            .yeti
          </code>{" "}
          file.
        </p>

        <div
          className="flex w-full flex-col items-stretch justify-center gap-3 animate-fade-up sm:w-auto sm:flex-row sm:items-center sm:gap-4"
          style={{ animationDelay: "300ms" }}
        >
          <a
            href="https://github.com/kiranojhanp/yeti"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-foreground bg-foreground px-6 py-3.5 text-sm font-medium text-background shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-foreground/85 hover:shadow-lg sm:w-auto sm:px-8 sm:text-base sm:py-4"
          >
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=kiranojhanp.yeti-vscode-plugin"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-line-soft bg-background/80 px-6 py-3.5 text-sm font-medium text-foreground transition hover:border-foreground/25 sm:w-auto sm:px-8 sm:text-base sm:py-4"
          >
            <Play className="w-4 h-4 text-muted-foreground fill-current" />
            Install VS Code extension
          </a>
        </div>
      </div>

      <div
        className="relative mx-auto mt-12 w-full max-w-6xl animate-fade-up md:mt-20"
        style={{ animationDelay: "400ms" }}
      >
        <DashboardMockup />
      </div>
    </section>
  );
}
