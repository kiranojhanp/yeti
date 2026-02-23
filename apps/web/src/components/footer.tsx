import Link from "next/link";

const stats = [
  { value: "MIT", label: "Licensed" },
  { value: "5+", label: "Packages" },
  { value: "100%", label: "Free" },
];

const links = [
  { name: "GitHub", href: "https://github.com/kiranojhanp/yeti" },
  { name: "npm", href: "https://www.npmjs.com/package/@yeti/parse" },
  {
    name: "VS Code",
    href: "https://marketplace.visualstudio.com/items?itemName=kiranojhanp.yeti-vscode-plugin",
  },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
];

export function Footer() {
  return (
    <footer className="bg-background text-foreground py-20 px-6 border-t border-foreground/10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left — headline + CTAs */}
        <div>
          <h2 className="font-serif text-6xl md:text-8xl tracking-tight leading-[0.95] mb-6">
            Write it
            <br />
            <em className="italic text-muted-foreground">once.</em>
          </h2>
          <p className="text-muted-foreground max-w-md mb-8 leading-relaxed">
            Yeti is open source, MIT licensed, and built by one person. No
            accounts, no tiers, no lock-in — just a{" "}
            <code className="font-mono text-foreground bg-foreground/5 px-1.5 py-0.5 rounded text-sm">
              .yeti
            </code>{" "}
            file and production-ready SQL.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/kiranojhanp/yeti"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-foreground text-background px-8 py-4 rounded-full text-sm font-medium uppercase tracking-wide hover:bg-muted-foreground transition-colors duration-200"
            >
              Get started free
            </a>
            <a
              href="mailto:hello@yetiql.dev"
              className="border border-foreground/20 px-8 py-4 rounded-full text-sm font-medium uppercase tracking-wide hover:bg-foreground hover:text-background transition-all duration-200"
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Right — stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-muted/40 border border-foreground/8 p-8 rounded-3xl"
            >
              <div className="font-serif text-5xl tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {stat.label}
              </div>
            </div>
          ))}

          {/* Arrow CTA tile */}
          <a
            href="https://github.com/kiranojhanp/yeti"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-foreground text-background p-8 rounded-3xl flex items-center justify-center group hover:bg-muted-foreground transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="-rotate-45 group-hover:rotate-0 transition-transform duration-300"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground">
        <span>© 2026 Yeti. MIT licensed.</span>
        <div className="flex flex-wrap justify-center gap-6">
          {links.map((link) =>
            link.href.startsWith("#") ? (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-foreground transition-colors"
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
              >
                {link.name}
              </a>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
