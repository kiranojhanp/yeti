import { ArrowRight, Play } from "lucide-react";
import { DashboardMockup } from "./dashboard-mockup";

export function HeroSection() {
  return (
    <section className="min-h-[90vh] flex flex-col justify-center pt-32 pb-12 px-6 lg:pt-40 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent/20 blur-[120px] rounded-full -z-10 animate-float pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center z-10 relative">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-foreground/15 shadow-sm mb-8 animate-fade-down">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          <span className="text-sm font-medium text-muted-foreground">
            v0.0.4 — now available
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-serif text-6xl md:text-8xl text-foreground leading-[0.95] md:leading-[1.1] mb-8 animate-fade-up text-balance"
          style={{ animationDelay: "100ms" }}
        >
          Write your schema once. <br className="hidden md:block" />
          In <span className="italic text-muted-foreground">plain text.</span>
        </h1>

        {/* Subhead */}
        <p
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-up"
          style={{ animationDelay: "200ms" }}
        >
          Yeti is a schema definition language for databases. Describe what you
          want — entities, relationships, constraints — and it generates
          production-ready SQL. No ORM lock-in. No boilerplate. Just a{" "}
          <code className="font-mono text-foreground bg-foreground/5 px-1.5 py-0.5 rounded">
            .yeti
          </code>{" "}
          file.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style={{ animationDelay: "300ms" }}
        >
          <a
            href="https://github.com/kiranojhanp/yeti"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground text-background px-8 py-4 rounded-full text-base font-medium hover:bg-muted-foreground transition shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-300 flex items-center gap-2 group cursor-pointer"
          >
            Get started free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://marketplace.visualstudio.com/items?itemName=kiranojhanp.yeti-vscode-plugin"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-background text-foreground border border-foreground/15 px-8 py-4 rounded-full text-base font-medium hover:border-foreground/40 transition flex items-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 text-muted-foreground fill-current" />
            Install VS Code extension
          </a>
        </div>
      </div>

      {/* Dashboard Mockup */}
      <div
        className="mt-16 md:mt-24 max-w-6xl mx-auto relative w-full animate-fade-up"
        style={{ animationDelay: "400ms" }}
      >
        <DashboardMockup />
      </div>
    </section>
  );
}
