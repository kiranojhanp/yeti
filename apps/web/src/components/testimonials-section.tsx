"use client";

import { useEffect, useRef, useState } from "react";
import { testimonialsSectionContent } from "@/content/site-content";

function highlightBoldParts(quote: string, boldParts: readonly string[]) {
  let result: (string | React.ReactElement)[] = [quote];

  boldParts.forEach((part, partIndex) => {
    const newResult: (string | React.ReactElement)[] = [];
    result.forEach((segment) => {
      if (typeof segment !== "string") {
        newResult.push(segment);
        return;
      }
      const parts = segment.split(part);
      parts.forEach((p, i) => {
        newResult.push(p);
        if (i < parts.length - 1) {
          newResult.push(
            <strong key={`${partIndex}-${i}`} className="font-bold">
              {part}
            </strong>
          );
        }
      });
    });
    result = newResult;
  });

  return result;
}

const processedTestimonials = testimonialsSectionContent.items.map((t) => ({
  ...t,
  highlightedQuote: highlightBoldParts(t.quote, t.boldParts),
}));
const allCards = [...processedTestimonials, ...processedTestimonials];

function TestimonialCard({
  highlightedQuote,
  name,
  title,
  avatarColors,
}: Omit<(typeof processedTestimonials)[0], "quote" | "boldParts">) {
  return (
    <div className="testimonial-card">
      <p className="font-serif text-lg leading-snug tracking-tight sm:text-xl">
        {highlightedQuote}
      </p>
      <div className="mt-5 flex items-center gap-3 sm:mt-6">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${avatarColors} rounded-full flex-shrink-0`}
        />
        <div>
          <div className="text-xs font-bold">{name}</div>
          <div className="text-xs text-ink-soft">{title}</div>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="section-shell overflow-hidden bg-surface-2 text-foreground"
    >
      <div className="section-inner">
        <div
          className={`mb-14 text-center md:mb-20 ${
            isVisible ? "reveal-up-visible" : "reveal-up-soft-init"
          }`}
        >
          <div className="section-label mb-5">
            <span className="section-label-text">
              {testimonialsSectionContent.label}
            </span>
          </div>
          <p className="mx-auto max-w-3xl text-balance font-serif text-2xl leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
            {testimonialsSectionContent.titlePrefix}{" "}
            <em className="premium-gradient-testimonials italic">
              {testimonialsSectionContent.titleEmphasis}
            </em>{" "}
            {testimonialsSectionContent.titleSuffix}
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div
        className={`relative delay-200 ${
          isVisible ? "reveal-up-visible" : "reveal-up-soft-init"
        }`}
      >
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-testimonial-scroll flex w-max gap-4 will-change-transform [transform:translate3d(0,0,0)] sm:gap-6">
            {allCards.map((testimonial, index) => (
              <TestimonialCard key={String(index)} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
