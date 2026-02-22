import { HeroSection } from "@/components/hero-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PricingCard } from "@/components/pricing-card";
import { PricingFAQ } from "@/components/pricing-faq";
import { Footer } from "@/components/footer";

const plans = [
  {
    name: "Free",
    features: [
      "@yeti/parse — the parser",
      "@yeti/generator — base SQL generator",
      "@yeti/pg-generator — PostgreSQL DDL",
      "@yeti/migration-core — migration engine",
      "@yeti/sqlite-migration — SQLite adapter",
      "VS Code extension",
      "MIT licensed",
    ],
    ctaText: "Get Started",
    popular: true,
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-background/80 backdrop-blur-lg border-b border-foreground/5">
        <span className="font-serif text-2xl">yeti.</span>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#hero"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Product
          </a>
          <a
            href="#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
          <a href="#pricing" className="text-sm font-medium transition-colors">
            Pricing
          </a>
          <a
            href="#faq"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
        </div>
        <a
          href="https://github.com/kiranojhanp/yeti"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-full hover:bg-muted-foreground transition-colors cursor-pointer"
        >
          View on GitHub
        </a>
      </nav>

      {/* Hero Section */}
      <div id="hero">
        <HeroSection />
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-block px-4 py-2 border-b border-dashed border-foreground mb-4">
              <span className="text-sm uppercase tracking-widest font-medium">
                Pricing
              </span>
            </div>
          </div>

          {/* Single free card — centered, capped width */}
          <div className="max-w-md mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                features={plan.features}
                ctaText={plan.ctaText}
                popular={plan.popular}
                delay={index * 100}
              />
            ))}
          </div>

          {/* Buy me a coffee */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Yeti is built by one person, in the open, for free.
            </p>
            <a
              href="https://buymeacoffee.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-foreground/20 text-sm font-medium hover:bg-foreground hover:text-background transition-all duration-300"
            >
              ☕ Buy me a coffee
            </a>
          </div>

          <div id="faq">
            <PricingFAQ />
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
