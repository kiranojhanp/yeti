"use client"

import { useEffect, useRef, useState } from "react"

const testimonials = [
  {
    quote:
      'Transformed how we organize and support our distributed team across 3 continents. We\'ve rapidly streamlined project workflows that used to take weeks.',
    boldParts: ["distributed team", "3 continents"],
    name: "Sarah Martinez",
    title: "Director of Operations",
    avatarColors: "from-[#DBE3E9] to-[#E1E5AC]",
  },
  {
    quote:
      'Vantage has been a game changer for us. What took 5-6 hours of planning is now down to 3-4 mins \u2014 the focus features are incredible.',
    boldParts: ["game changer", "3-4 mins"],
    name: "Michael Chen",
    title: "VP of Product",
    avatarColors: "from-[#C5CFD6] to-[#DBE3E9]",
  },
  {
    quote:
      'Saved us $125k in tooling costs. Vantage helped us pull off our smoothest ever product launch across 100+ stakeholders.',
    boldParts: ["$125k", "100+ stakeholders"],
    name: "Emily Rodriguez",
    title: "Head of Marketing",
    avatarColors: "from-[#E1E5AC] to-[#C5CFD6]",
  },
  {
    quote:
      'The clarity it brings is mind-blowing. Our entire leadership team can now stay aligned on priorities without endless status meetings.',
    boldParts: ["mind-blowing", "entire leadership team"],
    name: "Alex Johnson",
    title: "Engineering Manager",
    avatarColors: "from-[#DBE3E9] to-[#C5CFD6]",
  },
  {
    quote:
      'We onboarded 12 departments simultaneously and everyone was productive from day one. Truly a game-changer for company-wide adoption.',
    boldParts: ["12 departments simultaneously", "day one"],
    name: "Lisa Wang",
    title: "VP of People Ops",
    avatarColors: "from-[#C5CFD6] to-[#E1E5AC]",
  },
]

function highlightBoldParts(quote: string, boldParts: string[]) {
  let result: (string | JSX.Element)[] = [quote]

  boldParts.forEach((part, partIndex) => {
    const newResult: (string | JSX.Element)[] = []
    result.forEach((segment) => {
      if (typeof segment !== "string") {
        newResult.push(segment)
        return
      }
      const parts = segment.split(part)
      parts.forEach((p, i) => {
        newResult.push(p)
        if (i < parts.length - 1) {
          newResult.push(
            <strong key={`${partIndex}-${i}`} className="font-bold">
              {part}
            </strong>
          )
        }
      })
    })
    result = newResult
  })

  return result
}

function TestimonialCard({
  quote,
  boldParts,
  name,
  title,
  avatarColors,
}: (typeof testimonials)[0]) {
  return (
    <div className="flex-none w-[340px] bg-background text-foreground rounded-2xl border border-foreground/10 p-7 flex flex-col justify-between h-[340px]">
      <p className="font-serif text-xl leading-snug tracking-tight">
        {highlightBoldParts(quote, boldParts)}
      </p>
      <div className="flex items-center gap-3 mt-6">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${avatarColors} rounded-full flex-shrink-0`}
        />
        <div>
          <div className="font-sans font-bold text-xs">{name}</div>
          <div className="text-xs text-muted-foreground">{title}</div>
        </div>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const allCards = [...testimonials, ...testimonials]

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="py-16 md:py-28 bg-foreground text-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div
          className={`text-center mb-14 md:mb-20 transition-all duration-700 ${
            isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-block px-3 py-1.5 bg-background/10 rounded-full text-xs font-sans font-medium uppercase tracking-widest mb-5">
            Customer Stories
          </div>
          <p className="font-serif text-3xl md:text-5xl lg:text-6xl leading-tight max-w-3xl mx-auto text-balance">
            Powering the{" "}
            <em className="italic text-accent">productivity</em> stack for
            teams around the world.
          </p>
        </div>
      </div>

      {/* Carousel */}
      <div
        className={`relative transition-all duration-700 delay-200 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-r from-foreground to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-40 bg-gradient-to-l from-foreground to-transparent z-10 pointer-events-none" />

        {/* Scrolling container */}
        <div className="overflow-hidden">
          <div
            className="flex gap-6 animate-testimonial-scroll"
            style={{ width: "fit-content" }}
          >
            {allCards.map((testimonial, index) => (
              <TestimonialCard key={`${testimonial.name}-${index}`} {...testimonial} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
