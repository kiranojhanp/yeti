import Link from "next/link"

function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M7 17l9.2-9.2M17 17V7H7" />
    </svg>
  )
}

const socials = [
  { name: "Twitter / X", href: "#" },
  { name: "LinkedIn", href: "#" },
  { name: "GitHub", href: "#" },
  { name: "Dribbble", href: "#" },
]

const resources = [
  { name: "Documentation", href: "#" },
  { name: "Changelog", href: "#" },
  { name: "Blog", href: "#" },
  { name: "Status Page", href: "#" },
]

const product = [
  { name: "Features", href: "#hero" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Pricing", href: "#pricing" },
  { name: "FAQ", href: "#faq" },
]

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-foreground text-background overflow-hidden">
      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 min-h-[380px]">
        {/* Brand Column */}
        <div className="col-span-1 md:col-span-2 lg:col-span-1 p-8 lg:p-10 border-b md:border-b lg:border-b-0 lg:border-r border-background/10 flex flex-col justify-between">
          <div>
            <h2 className="font-serif text-5xl lg:text-6xl tracking-tight mb-2">
              acme.
            </h2>
            <p className="font-serif italic text-2xl text-background/50">
              workspace
            </p>
          </div>
          <div className="mt-10 lg:mt-0 space-y-4">
            <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-accent-foreground text-lg animate-[spin_8s_linear_infinite]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
              </svg>
            </div>
            <p className="text-sm leading-relaxed text-background/40 max-w-[240px]">
              Clarity for your chaotic mind. Building tools with purpose, precision, and care.
            </p>
          </div>
        </div>

        {/* Socials Column */}
        <div className="p-8 lg:p-10 border-b md:border-b-0 md:border-r border-background/10">
          <div className="flex items-center justify-between mb-8 border-b border-background/20 pb-3">
            <h4 className="font-sans text-sm font-medium uppercase tracking-widest text-background/60">
              Socials
            </h4>
            <ArrowUpRight className="text-background/40" />
          </div>
          <ul className="space-y-4">
            {socials.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-lg font-medium text-background/80 hover:text-accent hover:translate-x-2 transition-all duration-200 inline-block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Resources Column */}
        <div className="p-8 lg:p-10 border-b md:border-b-0 lg:border-r border-background/10">
          <div className="flex items-center justify-between mb-8 border-b border-background/20 pb-3">
            <h4 className="font-sans text-sm font-medium uppercase tracking-widest text-background/60">
              Resources
            </h4>
            <ArrowUpRight className="text-background/40" />
          </div>
          <ul className="space-y-4">
            {resources.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="text-lg font-medium text-background/80 hover:text-accent hover:translate-x-2 transition-all duration-200 inline-block"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Column */}
        <div className="p-8 lg:p-10">
          <div className="flex items-center justify-between mb-8 border-b border-background/20 pb-3">
            <h4 className="font-sans text-sm font-medium uppercase tracking-widest text-background/60">
              {"Let's Talk"}
            </h4>
            <ArrowUpRight className="text-background/40" />
          </div>
          <div className="space-y-5">
            <Link
              href="mailto:hello@acme.app"
              className="block text-lg font-medium text-background hover:text-accent transition-colors"
            >
              hello@acme.app
            </Link>
            <p className="text-sm text-background/40 leading-relaxed">
              Currently accepting new teams and enterprise partnerships.
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-4">
              {product.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-xs uppercase tracking-wider text-background/40 hover:text-accent transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              {/* Email button */}
              <button className="w-11 h-11 border border-background/20 rounded-full flex items-center justify-center text-background/60 hover:bg-background hover:text-foreground transition-colors cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </button>
              {/* Chat button */}
              <button className="w-11 h-11 border border-background/20 rounded-full flex items-center justify-center text-background/60 hover:bg-background hover:text-foreground transition-colors cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-background/10 px-6 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center text-xs uppercase tracking-widest text-background/30 gap-2">
        <span>2026 Acme Inc. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Built with <span className="text-accent">care</span> and intention.
        </span>
      </div>
    </footer>
  )
}
