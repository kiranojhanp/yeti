export const siteLinks = {
  github: "https://github.com/kiranojhanp/yeti",
  vscode:
    "https://marketplace.visualstudio.com/items?itemName=kiranojhanp.yeti-vscode-plugin",
  npm: "https://www.npmjs.com/package/@yeti/parse",
  buyMeCoffee: "https://buymeacoffee.com",
  email: "mailto:hello@yetiql.dev",
} as const;

export const navbarContent = {
  brand: "Yeti.",
  githubButton: {
    label: "View on GitHub",
    ariaLabel: "View on GitHub",
  },
  navLinks: [
    { label: "Features", href: "#features", id: "features" },
    { label: "Comparison", href: "#comparison", id: "comparison" },
    { label: "Testimonials", href: "#testimonials", id: "testimonials" },
    { label: "Pricing", href: "#pricing", id: "pricing" },
    { label: "FAQ", href: "#faq", id: "faq" },
  ],
} as const;

export const heroContent = {
  status: "v0.0.4 — now available",
  title: {
    prefix: "Write your schema once.",
    emphasis: "plain text.",
  },
  description:
    "Yeti is a schema definition language for databases. Describe what you want — entities, relationships, constraints — and it generates production-ready SQL. No ORM lock-in. No boilerplate. Just a",
  ctas: {
    primary: { label: "Get started", href: siteLinks.github },
    secondary: { label: "Install VS Code extension", href: siteLinks.vscode },
  },
} as const;

export type FeatureIconKey =
  | "parser"
  | "postgres"
  | "migrations"
  | "sqlite"
  | "vscode"
  | "extensible";

export const featuresSectionContent = {
  label: "Features",
  titlePrefix: "Everything in the toolchain,",
  titleEmphasis: "nothing you don't need",
  items: [
    {
      title: "Error-recovering parser",
      description:
        "The @yeti/parse package reads .yeti files and produces a fully typed AST with line and column tracking on every node. When you make a syntax mistake, it recovers and keeps parsing — you see all your errors at once, not one at a time.",
      iconKey: "parser",
    },
    {
      title: "Full PostgreSQL DDL",
      description:
        "@yeti/pg-generator converts your schema to valid PostgreSQL. Enum types, foreign key ordering, double-quoted identifiers, and SQL injection-safe defaults — all handled. You write the schema; it writes the SQL.",
      iconKey: "postgres",
    },
    {
      title: "Hash-verified migrations",
      description:
        "@yeti/migration-core validates SHA-256 hashes on every applied migration. Sequence gaps, out-of-order applies, and tampered files all stop the run before anything touches your database.",
      iconKey: "migrations",
    },
    {
      title: "SQLite adapter",
      description:
        "@yeti/sqlite-migration runs each migration as an immediate transaction, WAL-mode safe, with process-level locking to prevent concurrent runs. Works with better-sqlite3 out of the box.",
      iconKey: "sqlite",
    },
    {
      title: "VS Code extension",
      description:
        "Autocomplete, hover documentation, go to definition, rename symbol, and a Generate SQL command — all schema-aware. It only loads when a .yeti file is open.",
      iconKey: "vscode",
    },
    {
      title: "Extensible generators",
      description:
        "Adding a new database target means implementing two interfaces: SQLDialect and TemplateProvider. The base generator handles the rest. MySQL, SQLite DDL, documentation — the architecture doesn't care.",
      iconKey: "extensible",
    },
  ],
} as const;

export type CellValue = "yes" | "no" | "partial" | "note";

export const comparisonContent = {
  label: "Comparison",
  titlePrefix: "How Yeti stacks up against",
  titleEmphasis: "the alternatives",
  yetiColumnSubtitle: "you are here",
  tools: ["Yeti", "DBML", "Prisma", "Drizzle", "Liquibase", "Flyway", "Atlas"],
  rows: [
    {
      label: "Pure schema DSL",
      values: {
        Yeti: "yes",
        DBML: "yes",
        Prisma: "yes",
        Drizzle: "no",
        Liquibase: "no",
        Flyway: "no",
        Atlas: "yes",
      },
      notes: { Prisma: "PSL — but ORM-coupled, not standalone" },
    },
    {
      label: "ORM-free",
      values: {
        Yeti: "yes",
        DBML: "yes",
        Prisma: "no",
        Drizzle: "no",
        Liquibase: "yes",
        Flyway: "yes",
        Atlas: "yes",
      },
    },
    {
      label: "Migration engine",
      values: {
        Yeti: "yes",
        DBML: "no",
        Prisma: "yes",
        Drizzle: "yes",
        Liquibase: "yes",
        Flyway: "yes",
        Atlas: "yes",
      },
    },
    {
      label: "Hash-verified migrations",
      values: {
        Yeti: "yes",
        DBML: "no",
        Prisma: "partial",
        Drizzle: "no",
        Liquibase: "partial",
        Flyway: "partial",
        Atlas: "partial",
      },
      notes: {
        Yeti: "SHA-256 per file",
        Prisma: "Checksum only",
        Liquibase: "MD5, partial",
        Flyway: "Breaks on whitespace",
        Atlas: "Directory-level",
      },
    },
    {
      label: "VS Code autocomplete",
      values: {
        Yeti: "yes",
        DBML: "no",
        Prisma: "yes",
        Drizzle: "note",
        Liquibase: "no",
        Flyway: "no",
        Atlas: "no",
      },
      notes: { Drizzle: "TS only, not schema-aware" },
    },
    {
      label: "Go to definition",
      values: {
        Yeti: "yes",
        DBML: "no",
        Prisma: "no",
        Drizzle: "note",
        Liquibase: "no",
        Flyway: "no",
        Atlas: "no",
      },
      notes: { Drizzle: "TS only, not schema-aware" },
    },
    {
      label: "Rename symbol",
      values: {
        Yeti: "yes",
        DBML: "no",
        Prisma: "no",
        Drizzle: "note",
        Liquibase: "no",
        Flyway: "no",
        Atlas: "no",
      },
      notes: { Drizzle: "TS only, not schema-aware" },
    },
    {
      label: "No JVM or runtime required",
      values: {
        Yeti: "yes",
        DBML: "yes",
        Prisma: "yes",
        Drizzle: "yes",
        Liquibase: "no",
        Flyway: "no",
        Atlas: "yes",
      },
    },
    {
      label: "License",
      values: {
        Yeti: "yes",
        DBML: "yes",
        Prisma: "note",
        Drizzle: "note",
        Liquibase: "note",
        Flyway: "note",
        Atlas: "note",
      },
      notes: {
        Yeti: "MIT",
        DBML: "MIT",
        Prisma: "Apache 2.0",
        Drizzle: "Apache 2.0",
        Liquibase: "Open-core",
        Flyway: "Restricted (Redgate)",
        Atlas: "EULA — CE is Apache 2.0",
      },
    },
  ],
  blurbs: {
    DBML: {
      headline: "Great DSL. No migrations.",
      body: "DBML is the closest thing to what Yeti is building — clean, ORM-free schema syntax. But it stops at documentation. No migration engine, no editor tooling beyond basic highlighting. Yeti is what DBML would be if it took migrations seriously.",
    },
    Prisma: {
      headline: "Best ORM DX. Tied to Prisma.",
      body: "The schema format only exists to serve Prisma Client. Step outside what Prisma supports and you're writing raw SQL anyway — with two sources of truth. Migrate also needs a shadow database just to diff.",
    },
    Drizzle: {
      headline: "TypeScript, not a DSL.",
      body: "The schema is TypeScript code — pgTable, mysqlTable. Switching databases means rewriting the schema. The editor experience is IntelliSense, not schema-aware tooling. No go-to-definition for entities you defined in your own file.",
    },
    Liquibase: {
      headline: "Changelog, not a schema.",
      body: "60+ databases and battle-tested since 2006. But Liquibase has no schema — just a changelog of every change ever made. To understand current state you replay history or inspect a live database. Enterprise features are commercial.",
    },
    Flyway: {
      headline: "Simple model, commercial ceiling.",
      body: "Numbered SQL files applied in order — clean mental model. But no schema definition, no rollbacks without paying, and checksum validation breaks if someone edits whitespace in an applied file. Now owned by Redgate.",
    },
    Atlas: {
      headline: "Most powerful. Steepest curve.",
      body: "Declarative schema-as-code, 50+ migration linting checks, Kubernetes operator. Genuinely impressive. But HCL syntax, EULA on the default binary, and the best features are behind Atlas Cloud.",
    },
  },
  help: {
    ariaLabel: "Comparison legend and caveat help",
    capabilityLabel: "Capability",
    heading: "Quick guide",
    bodyPrefix: "Open any tool header for notes. In cells,",
    bodySuffix: "means partial support or caveats.",
    nativeSupport: "Native support",
    partialSupport: "Partial support",
    notAvailable: "Not available",
    footnote: "Snapshot from public docs (Feb 2026).",
  },
} as const satisfies {
  label: string;
  titlePrefix: string;
  titleEmphasis: string;
  yetiColumnSubtitle: string;
  tools: readonly string[];
  rows: readonly {
    label: string;
    values: Record<string, CellValue>;
    notes?: Record<string, string>;
  }[];
  blurbs: Record<string, { headline: string; body: string }>;
  help: {
    ariaLabel: string;
    capabilityLabel: string;
    heading: string;
    bodyPrefix: string;
    bodySuffix: string;
    nativeSupport: string;
    partialSupport: string;
    notAvailable: string;
    footnote: string;
  };
};

export const testimonialsSectionContent = {
  label: "What developers say",
  titlePrefix: "The conversations that happen",
  titleEmphasis: "every week",
  titleSuffix: "in every engineering team.",
  items: [
    {
      quote:
        "I've written the same CREATE TABLE users migration so many times I could do it in my sleep. And I still always forget to add the index until after I've already run it.",
      boldParts: ["CREATE TABLE users", "forget to add the index"],
      name: "Every backend developer",
      title: "every new project",
      avatarColors: "from-[#DBE3E9] to-[#E1E5AC]",
    },
    {
      quote:
        "We had three different engineers touch the same migration file after it was already applied in staging. The migration system didn't notice. Production noticed.",
      boldParts: ["migration system didn't notice", "Production noticed"],
      name: "Common story",
      title: "teams without hash verification",
      avatarColors: "from-[#C5CFD6] to-[#DBE3E9]",
    },
    {
      quote:
        "The ORM schema looked great until we had to do something the ORM didn't support. Then we were writing raw SQL anyway, but now we had two sources of truth for the database structure.",
      boldParts: ["two sources of truth"],
      name: "The moment",
      title: "people start questioning their ORM choice",
      avatarColors: "from-[#E1E5AC] to-[#C5CFD6]",
    },
    {
      quote:
        "I just want to write down what the database should look like, in a file, that I can read, that I can diff, that doesn't require me to remember which version of the ORM syntax I'm on.",
      boldParts: ["that I can read", "that I can diff"],
      name: "The reason",
      title: "schema languages exist",
      avatarColors: "from-[#DBE3E9] to-[#C5CFD6]",
    },
    {
      quote:
        "Switching databases required rewriting the schema to use different table constructors. It wasn't a schema — it was just ORM config that happened to describe a database.",
      boldParts: ["just ORM config"],
      name: "On ORM-coupled schemas",
      title: "a common realization",
      avatarColors: "from-[#C5CFD6] to-[#E1E5AC]",
    },
  ],
} as const;

export const pricingSectionContent = {
  label: "Pricing",
  plan: {
    badge: "Open Source",
    title: "Free. All of it.",
    description:
      'Every package. The VS Code extension. Future adapters. MIT licensed. No account, no usage limits, no "community tier."',
    ctaText: "Get Started",
    ctaHref: siteLinks.github,
    features: [
      "@yeti/parse — the parser",
      "@yeti/generator — base SQL generator",
      "@yeti/pg-generator — PostgreSQL DDL",
      "@yeti/migration-core — migration engine",
      "@yeti/sqlite-migration — SQLite adapter",
      "VS Code extension",
      "MIT licensed",
    ],
  },
  support: {
    text: "Yeti is built by one person, in the open, for free.",
    ctaLabel: "☕ Buy me a coffee",
    ctaHref: siteLinks.buyMeCoffee,
  },
} as const;

export const faqSectionContent = {
  label: "FAQ",
  title: "Frequently Asked Questions",
  description: "Everything you need to know about Yeti.",
  items: [
    {
      question: "What databases does Yeti support?",
      answer:
        "PostgreSQL is the primary target today, with a full generator and migration system. SQLite is supported for migrations via @yeti/sqlite-migration. More adapters are planned — the generator architecture was designed specifically to make adding new targets straightforward.",
    },
    {
      question: "Is this an ORM?",
      answer:
        "No. Yeti only deals with schema definition and migrations. It doesn't touch queries, models, or your application code. You can use it alongside any ORM, alongside raw SQL, or alongside nothing at all.",
    },
    {
      question: "Does Yeti generate TypeScript types?",
      answer:
        "Not yet. It's on the roadmap. The AST has all the information needed to generate types — it just hasn't been built yet.",
    },
    {
      question: "What version is this?",
      answer:
        "v0.0.4. The project is early. The language syntax is mostly stable, but the APIs are not guaranteed to stay the same between minor versions. Check the changelog before upgrading in production.",
    },
    {
      question: "Can I use Yeti without VS Code?",
      answer:
        "Yes. The editor extension is optional. The parser, generator, and migration system are all standalone npm packages you can use in any Node.js or Bun project.",
    },
    {
      question: "Who maintains this?",
      answer:
        "kiranojhanp — one person, open source, MIT licensed. If it's useful to you, buying a coffee is the best way to support continued development.",
    },
    {
      question: "Can I contribute?",
      answer:
        "Yes. The project is on GitHub. Issues and pull requests are open. If you're building a new database adapter, reach out first so the work doesn't duplicate what's already in progress.",
    },
    {
      question: "What's the license?",
      answer: "MIT. Use it however you want.",
    },
  ],
} as const;

export const footerContent = {
  titlePrefix: "Write it",
  titleEmphasis: "once.",
  description:
    "Yeti is open source, MIT licensed, and built by one person. No accounts, no tiers, no lock-in — just a",
  primaryCta: { label: "Get started", href: siteLinks.github },
  secondaryCta: { label: "Get in touch", href: siteLinks.email },
  stats: [
    { value: "MIT", label: "Licensed" },
    { value: "5+", label: "Packages" },
    { value: "100%", label: "Free" },
  ],
  copyright: "© 2026 Yeti. MIT licensed.",
  links: [
    { name: "GitHub", href: siteLinks.github },
    { name: "npm", href: siteLinks.npm },
    { name: "VS Code", href: siteLinks.vscode },
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ],
  arrowCardHref: siteLinks.github,
} as const;
