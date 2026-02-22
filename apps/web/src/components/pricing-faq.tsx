"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.",
  },
  {
    question: "Is there a free trial for Pro?",
    answer:
      "Absolutely! All paid plans come with a 14-day free trial. No credit card required to start.",
  },
  {
    question: "What happens when I exceed my project limit?",
    answer:
      "On the Free plan, you'll need to upgrade to create more projects. On paid plans, you can create unlimited projects without any restrictions.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes, you can save up to 20% by choosing annual billing. Contact our sales team for custom enterprise pricing.",
  },
]

export function PricingFAQ() {
  return (
    <div className="max-w-2xl mx-auto mt-24">
      <div className="text-center mb-12">
        <h3 className="font-serif text-3xl md:text-4xl tracking-tight mb-3">
          Frequently Asked Questions
        </h3>
        <p className="text-muted-foreground text-sm">
          Everything you need to know about the plans.
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-foreground/15"
          >
            <AccordionTrigger className="text-left font-sans text-base hover:no-underline py-5">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
