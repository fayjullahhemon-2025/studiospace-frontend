"use client";

import {
  ArrowRight,
  CheckCircle2,
  Clapperboard,
  Clock,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

const steps = [
  {
    step: "01",
    title: "1. Discover Spaces",
    shortTitle: "Discover Spaces",
    icon: Search,
    description:
      "Browse vetted soundstages, daylight cycloramas, podcast suites, and architectural lofts with detailed specs and high-res visuals.",
    feature: "Curated & Vetted",
  },
  {
    step: "02",
    title: "2. Select Shoot Hours",
    shortTitle: "Select Shoot Hours",
    icon: Clock,
    description:
      "Pick your exact production schedule with live availability calendar sync. Custom crew setup buffers and transparent hourly pricing.",
    feature: "Live Calendar Sync",
  },
  {
    step: "03",
    title: "3. Book Instantly",
    shortTitle: "Book Instantly",
    icon: Zap,
    description:
      "Lock in your booking immediately with zero host waiting time. Fully protected with 256-bit encrypted checkout and instant invoices.",
    feature: "Zero Waiting Time",
  },
  {
    step: "04",
    title: "4. Create & Produce",
    shortTitle: "Create & Produce",
    icon: Clapperboard,
    description:
      "Receive automated digital call sheets and contactless smart keycodes. Arrive on set, unlock the doors, and bring your vision to life.",
    feature: "Keycode Check-In",
  },
];

export function HowItWorks() {
  return (
    <section
      id="howitworks"
      className="scroll-mt-20 border-t border-border/70 bg-muted/30 py-16 sm:py-24 text-foreground transition-colors"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-brand uppercase">
            <Sparkles className="size-3.5" />
            Simple 4-Step Workflow
          </span>

          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            How Booking Works
          </h2>

          <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
            From discovering your ideal stage to final wrap time, StudioSpace
            eliminates traditional venue friction with streamlined, self-service
            production access.
          </p>
        </div>

        {/* 4-Step Cards Grid */}
        <div className="relative mt-14 sm:mt-18">
          {/* Subtle Horizontal Connector Bar (Desktop) */}
          <div
            aria-hidden="true"
            className="hidden lg:block absolute top-1/2 left-12 right-12 h-0.5 border-t-2 border-dashed border-border/80 -translate-y-16 z-0"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === steps.length - 1;

              return (
                <div
                  key={item.step}
                  className="group relative z-10 flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-neutral-800"
                >
                  {/* Top Row: Step Number & Icon */}
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black tracking-tight text-brand/30 transition-colors group-hover:text-brand">
                      {item.step}
                    </span>

                    <span className="flex size-11 items-center justify-center rounded-xl border border-brand/20 bg-brand/10 text-brand shadow-xs transition-colors group-hover:bg-brand group-hover:text-white">
                      <Icon className="size-5" />
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-brand">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed flex-1">
                    {item.description}
                  </p>

                  {/* Bottom Feature Tag & Next Indicator */}
                  <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                    <span className="font-semibold text-foreground/90">
                      {item.feature}
                    </span>

                    {isLast ? (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="size-4" />
                        <span>Ready</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-brand">
                        <ArrowRight className="size-3.5" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Action Card */}
        <div className="mt-12 sm:mt-16 rounded-2xl border border-border/80 bg-background/95 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-base sm:text-lg font-bold text-foreground">
              Ready to bring your creative vision to life?
            </h4>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Explore hundreds of verified studios with real-time keycode
              check-in.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link
              href="/studios"
              className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-strong"
            >
              <span>Explore Studios</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="/studios/new"
              className="inline-flex flex-1 sm:flex-none items-center justify-center rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
            >
              Host a Studio
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
