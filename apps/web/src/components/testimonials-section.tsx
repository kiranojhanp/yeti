"use client";

import { useEffect, useRef, useState } from "react";

const testimonials = [
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
];

function highlightBoldParts(quote: string, boldParts: string[]) {
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

const processedTestimonials = testimonials.map((t) => ({
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
            <span className="section-label-text">What developers say</span>
          </div>
          <p className="mx-auto max-w-3xl text-balance font-serif text-2xl leading-tight sm:text-3xl md:text-5xl lg:text-6xl">
            The conversations that happen{" "}
            <em className="premium-gradient-testimonials italic">every week</em>{" "}
            in every engineering team.
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
