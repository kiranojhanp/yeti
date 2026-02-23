import { cn } from "@/lib/utils";
import { CheckIcon } from "./check-icon";

interface PricingCardProps {
  features: string[];
  ctaText: string;
  popular?: boolean;
}

export function PricingCard({
  features,
  ctaText,
  popular = false,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-1 sm:p-8",
        popular
          ? "border-foreground/25 bg-surface-1 shadow-[0_16px_40px_-30px_rgba(22,22,22,0.4)]"
          : "border-line-soft bg-background/80 hover:shadow-[0_16px_40px_-30px_rgba(22,22,22,0.35)]"
      )}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-foreground/20 bg-foreground/95 px-4 py-1 text-xs uppercase tracking-wide text-background">
          Open Source
        </div>
      )}

      <div className="mb-8">
        <h3 className="mb-2 font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl">
          Free. All of it.
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-ink-soft">
          Every package. The VS Code extension. Future adapters. MIT licensed.
          No account, no usage limits, no &ldquo;community tier.&rdquo;
        </p>
      </div>

      <ul className="mb-8 flex flex-col gap-3 sm:gap-4" role="list">
        {features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm">
            <CheckIcon className="shrink-0" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href="https://github.com/kiranojhanp/yeti"
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full border border-foreground px-6 py-3.5 text-xs font-medium uppercase tracking-wide transition-all duration-300 sm:py-4 sm:text-sm",
          popular
            ? "bg-foreground text-background hover:bg-foreground/85"
            : "bg-background text-foreground hover:bg-surface-1"
        )}
      >
        {ctaText}
      </a>
    </div>
  );
}
