import { ArrowRight, Play } from "lucide-react";
import { DashboardMockup } from "./dashboard-mockup";
import { heroContent } from "@/content/site-content";

export function HeroSection() {
  return (
    <section className="section-shell relative flex min-h-[90vh] flex-col justify-center overflow-hidden pt-28 lg:pt-36">
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-surface-3/70 blur-[120px] animate-float" />

      <div className="max-w-4xl mx-auto text-center z-10 relative">
        <div className="status-pill mb-8 animate-fade-down">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground/30 opacity-70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground/40" />
          </span>
          <span className="text-sm font-medium text-ink-soft">
            {heroContent.status}
          </span>
        </div>

        <h1
          className="mb-6 text-balance font-serif text-5xl leading-[0.96] text-foreground animate-fade-up sm:text-6xl md:mb-8 md:text-8xl md:leading-[1.1]"
          style={{ animationDelay: "100ms" }}
        >
          {heroContent.title.prefix} <br className="hidden md:block" />
          In{" "}
          <span className="premium-gradient-hero italic">
            {heroContent.title.emphasis}
          </span>
        </h1>

        <p
          className="mx-auto mb-8 max-w-2xl text-base leading-relaxed text-ink-soft animate-fade-up sm:text-lg md:mb-10 md:text-xl"
          style={{ animationDelay: "200ms" }}
        >
          {heroContent.description}{" "}
          <code className="inline-code-chip">.yeti</code> file.
        </p>

        <div
          className="flex w-full flex-col items-stretch justify-center gap-3 animate-fade-up sm:w-auto sm:flex-row sm:items-center sm:gap-4"
          style={{ animationDelay: "300ms" }}
        >
          <a
            href={heroContent.ctas.primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-primary group flex w-full sm:w-auto"
          >
            {heroContent.ctas.primary.label}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href={heroContent.ctas.secondary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-hero-secondary flex w-full sm:w-auto"
          >
            <Play className="w-4 h-4 text-muted-foreground fill-current" />
            {heroContent.ctas.secondary.label}
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
