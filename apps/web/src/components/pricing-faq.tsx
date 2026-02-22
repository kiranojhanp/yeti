"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
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
];

export function PricingFAQ() {
  return (
    <div className="max-w-2xl mx-auto mt-0">
      <div className="text-center mb-12">
        <div className="inline-block px-4 py-2 border-b border-dashed border-background/40 mb-4">
          <span className="text-sm uppercase tracking-widest font-medium text-background/60">
            FAQ
          </span>
        </div>
        <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-3 text-background">
          Frequently Asked Questions
        </h3>
        <p className="text-background/50 text-sm">
          Everything you need to know about Yeti.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-background/15"
          >
            <AccordionTrigger className="text-left font-sans text-base hover:no-underline py-5 text-background hover:text-background/80">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-background/55 leading-relaxed pb-5">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
