import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { ComparisonSection } from "@/components/comparison-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PricingCard } from "@/components/pricing-card";
import { PricingFAQ } from "@/components/pricing-faq";
import { Footer } from "@/components/footer";
import { pricingSectionContent } from "@/content/site-content";

export default function Page() {
  return (
    <main className="min-h-screen bg-surface-1 text-foreground font-sans">
      <Navbar />

      <section id="hero">
        <HeroSection />
      </section>

      <FeaturesSection />

      <ComparisonSection />

      <TestimonialsSection />

      <section
        id="pricing"
        className="section-shell border-t border-line-soft/70 bg-surface-1"
      >
        <div className="mx-auto w-full max-w-4xl">
          <div className="text-center mb-10">
            <div className="section-label">
              <span className="section-label-text">
                {pricingSectionContent.label}
              </span>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <PricingCard
              features={pricingSectionContent.plan.features}
              ctaText={pricingSectionContent.plan.ctaText}
              popular={true}
            />
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-sm text-ink-soft">
              {pricingSectionContent.support.text}
            </p>
            <a
              href={pricingSectionContent.support.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-line-soft bg-background/70 px-6 py-3 text-sm font-medium transition-all duration-300 hover:border-foreground/20 hover:bg-background"
            >
              {pricingSectionContent.support.ctaLabel}
            </a>
          </div>
        </div>
      </section>

      <section id="faq" className="section-shell bg-surface-3 text-foreground">
        <div className="mx-auto w-full max-w-4xl">
          <PricingFAQ />
        </div>
      </section>

      <Footer />
    </main>
  );
}
