export function PricingHeader() {
  return (
    <div className="text-center mb-16">
      <div className="inline-block px-4 py-2 border-b border-dashed border-foreground mb-4">
        <span className="text-sm uppercase tracking-widest font-medium">
          Pricing
        </span>
      </div>
      <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4 text-balance">
        Free. All of it.
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-base leading-relaxed">
        Every package. The VS Code extension. Future adapters. MIT licensed. No
        account, no usage limits, no &ldquo;community tier.&rdquo;
      </p>
    </div>
  );
}
