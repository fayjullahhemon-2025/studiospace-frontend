import {
  ArrowRight,
  BadgeCheck,
  Headphones,
  HeartHandshake,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const guarantees = [
  {
    key: "verified-profiles",
    Icon: BadgeCheck,
    title: "Verified Profiles",
    description: "All booking creators undergo rigorous identity screening.",
  },
  {
    key: "equipment-shield",
    Icon: ShieldCheck,
    title: "$1M Equipment Shield",
    description:
      "Comprehensive accidental damage protection for studio fixtures.",
  },
  {
    key: "liability-coverage",
    Icon: HeartHandshake,
    title: "Liability Coverage",
    description: "General commercial liability bundled into each shoot hour.",
  },
  {
    key: "dedicated-concierge",
    Icon: Headphones,
    title: "24/7 Dedicated Concierge",
    description:
      "Direct phone support line during all ongoing studio bookings.",
  },
];

export function HostGuarantee() {
  return (
    <section
      id="about"
      className="border-t border-border/70 bg-background py-16 sm:py-24 text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* ── Left: Studio Image with Earnings Badge ── */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl aspect-[4/3] lg:aspect-auto lg:h-[480px] xl:h-[520px] bg-muted shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80"
                alt="Host welcoming a creator into her studio space"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover"
              />
            </div>

            {/* Floating Earnings Card */}
            <div className="absolute bottom-5 left-5 right-5 sm:bottom-7 sm:left-7 sm:right-auto sm:max-w-xs rounded-xl border border-border/80 bg-background/95 px-5 py-4 shadow-lg backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95">
              <p className="text-xs font-semibold text-foreground">
                Average Host Monthly Earnings
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                Based on 18 shoot hours per week
              </p>
              <p className="mt-2 text-2xl font-black tracking-tight text-brand">
                $3,400
                <span className="text-sm font-semibold text-muted-foreground">
                  /mo
                </span>
              </p>
            </div>
          </div>

          {/* ── Right: Copy & Feature Grid ── */}
          <div className="flex flex-col">
            {/* Top Badge */}
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#cce4ce] bg-[#ebf6ed] px-3.5 py-1 text-[11px] font-semibold tracking-wider text-[#2d6a4f] uppercase">
              <ShieldCheck className="size-3.5" />
              Host Guarantee &amp; Peace of Mind
            </span>

            {/* Headline */}
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-foreground leading-[1.1]">
              Share Your Space with
              <br />
              Total Confidence.
            </h2>

            {/* Subtext */}
            <p className="mt-4 text-sm sm:text-base leading-relaxed text-muted-foreground max-w-lg">
              Turn your production stage, daylight loft, or boutique creative
              room into a steady revenue engine. Every booking includes our
              comprehensive coverage shield.
            </p>

            {/* 2×2 Guarantee Feature Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {guarantees.map(({ key, Icon, title, description }) => (
                <div
                  key={key}
                  className="flex gap-3.5 rounded-xl border border-border/80 bg-muted/30 p-4 transition-colors hover:border-brand/30 hover:bg-brand/5 dark:border-neutral-800 dark:bg-neutral-900/40"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 text-brand">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/studios/new"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-strong"
              >
                Become a Host
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/host-guarantee"
                className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-muted"
              >
                Explore Host Economics
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HostGuarantee;
