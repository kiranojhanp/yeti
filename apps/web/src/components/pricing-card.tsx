import { cn } from "@/lib/utils";
import { pricingSectionContent } from "@/content/site-content";
import { CheckIcon } from "./check-icon";

interface PricingCardProps {
  features: readonly string[];
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
        "pricing-shell",
        popular ? "pricing-shell-popular" : "pricing-shell-default"
      )}
    >
      {popular && (
        <div className="pricing-badge">{pricingSectionContent.plan.badge}</div>
      )}

      <div className="mb-8">
        <h3 className="mb-2 font-serif text-3xl tracking-tight sm:text-4xl md:text-5xl">
          {pricingSectionContent.plan.title}
        </h3>
        <p className="mb-6 text-sm leading-relaxed text-ink-soft">
          {pricingSectionContent.plan.description}
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
        href={pricingSectionContent.plan.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "pricing-cta",
          popular ? "pricing-cta-popular" : "pricing-cta-default"
        )}
      >
        {ctaText}
      </a>
    </div>
  );
}
