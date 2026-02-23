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
    <footer className="section-shell border-t border-line-soft bg-surface-1 pb-10 text-foreground">
      <div className="section-inner grid items-center gap-10 md:grid-cols-2 md:gap-12">
        <div>
          <h2 className="mb-6 font-serif text-5xl leading-[0.95] tracking-tight sm:text-6xl md:text-8xl">
            Write it
            <br />
            <em className="premium-gradient-footer italic">once.</em>
          </h2>
          <p className="mb-8 max-w-md leading-relaxed text-ink-soft">
            Yeti is open source, MIT licensed, and built by one person. No
            accounts, no tiers, no lock-in — just a{" "}
            <code className="inline-code-chip text-sm">.yeti</code> file and
            production-ready SQL.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://github.com/kiranojhanp/yeti"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-primary"
            >
              Get started free
            </a>
            <a href="mailto:hello@yetiql.dev" className="btn-pill-secondary">
              Get in touch
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="stats-card">
              <div className="font-serif text-5xl tracking-tight mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-medium uppercase tracking-widest text-ink-soft">
                {stat.label}
              </div>
            </div>
          ))}

          <a
            href="https://github.com/kiranojhanp/yeti"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center rounded-3xl border border-foreground/25 bg-foreground p-6 text-background transition-colors duration-200 hover:bg-foreground/85 sm:p-8"
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

      <div className="section-inner mt-16 flex flex-col items-center justify-between gap-4 border-t border-line-soft pt-8 text-[11px] uppercase tracking-[0.2em] text-ink-soft sm:text-xs sm:tracking-widest md:mt-20 md:flex-row">
        <span>© 2026 Yeti. MIT licensed.</span>
        <div className="flex flex-wrap justify-center gap-6">
          {links.map((link) =>
            link.href.startsWith("#") ? (
              <Link key={link.name} href={link.href} className="link-subtle">
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="link-subtle"
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
