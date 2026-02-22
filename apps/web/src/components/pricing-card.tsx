"use client";

import { cn } from "@/lib/utils";
import { CheckIcon } from "./check-icon";

interface PricingCardProps {
  features: string[];
  ctaText: string;
  popular?: boolean;
  delay?: number;
}

export function PricingCard({
  features,
  ctaText,
  popular = false,
  delay = 0,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg p-8 transition-all duration-300 hover:-translate-y-1",
        popular
          ? "bg-accent border-2 border-foreground shadow-[0_12px_40px_rgba(43,43,43,0.15)]"
          : "bg-card border border-foreground hover:shadow-[0_12px_40px_rgba(43,43,43,0.15)]"
      )}
      style={{
        animationDelay: `${delay}ms`,
      }}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs uppercase tracking-wide px-4 py-1 rounded-full">
          Open Source
        </div>
      )}

      <div className="mb-8">
        <h3 className="font-serif text-4xl md:text-5xl tracking-tight mb-2">
          Free. All of it.
        </h3>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          Every package. The VS Code extension. Future adapters. MIT licensed.
          No account, no usage limits, no &ldquo;community tier.&rdquo;
        </p>
      </div>

      <ul className="flex flex-col gap-4 mb-8" role="list">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm">
            <CheckIcon className="shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        className={cn(
          "w-full inline-flex items-center justify-center gap-2 font-medium text-sm uppercase tracking-wide px-6 py-4 rounded-full border border-foreground transition-all duration-300 cursor-pointer",
          popular
            ? "bg-foreground text-background hover:bg-muted-foreground"
            : "bg-background text-foreground hover:bg-muted"
        )}
      >
        {ctaText}
      </button>
    </div>
  );
}
