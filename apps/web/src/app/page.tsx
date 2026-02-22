import { HeroSection } from "@/components/hero-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PricingHeader } from "@/components/pricing-header";
import { PricingCard } from "@/components/pricing-card";
import { PricingFAQ } from "@/components/pricing-faq";
import { Footer } from "@/components/footer";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["Up to 5 projects", "Basic templates", "Cloud sync"],
    ctaText: "Get Started",
  },
  {
    name: "Pro",
    price: "$9",
    description: "For professional creators",
    features: [
      "Unlimited projects",
      "Premium templates",
      "Team collaboration",
      "Priority support",
    ],
    ctaText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$19",
    description: "For growing teams",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Advanced analytics",
      "Custom integrations",
    ],
    ctaText: "Contact Sales",
  },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-5 bg-background/80 backdrop-blur-lg border-b border-foreground/5">
        <span className="font-serif text-2xl">acme.</span>
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#hero"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Product
          </a>
          <a
            href="#hero"
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
        <button className="bg-foreground text-background text-sm font-medium px-5 py-2.5 rounded-full hover:bg-muted-foreground transition-colors cursor-pointer">
          Sign Up
        </button>
      </nav>

      {/* Hero Section */}
      <div id="hero">
        <HeroSection />
      </div>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Pricing Section */}
      <section id="pricing" className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <PricingHeader />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <PricingCard
                key={plan.name}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                ctaText={plan.ctaText}
                popular={plan.popular}
                delay={index * 100}
              />
            ))}
          </div>

          {/* Trust bar */}
          <div className="mt-16 text-center">
            <p className="text-sm text-muted-foreground mb-6">
              Trusted by teams at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-40">
              {["Vercel", "Stripe", "Linear", "Notion", "Figma"].map(
                (brand) => (
                  <span
                    key={brand}
                    className="font-serif text-xl md:text-2xl text-foreground select-none"
                  >
                    {brand}
                  </span>
                )
              )}
            </div>
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
