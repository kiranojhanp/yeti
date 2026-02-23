"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqSectionContent } from "@/content/site-content";

export function PricingFAQ() {
  return (
    <div className="max-w-2xl mx-auto mt-0">
      <div className="section-header mb-12">
        <div className="section-label">
          <span className="section-label-text">{faqSectionContent.label}</span>
        </div>
        <h3 className="mb-3 font-serif text-2xl tracking-tight text-foreground sm:text-3xl md:text-4xl">
          {faqSectionContent.title}
        </h3>
        <p className="text-sm text-ink-soft">{faqSectionContent.description}</p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqSectionContent.items.map((faq) => (
          <AccordionItem
            key={faq.question}
            value={faq.question}
            className="border-line-soft"
          >
            <AccordionTrigger className="py-4 text-left text-[15px] text-foreground hover:no-underline hover:text-foreground/80 sm:py-5 sm:text-base">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-sm leading-relaxed text-ink-soft sm:pb-5 sm:text-base">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
