"use client";

import {
  Aperture,
  ArrowRight,
  CheckCircle2,
  Mail,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="X (formerly Twitter)"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="Instagram"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="YouTube"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="LinkedIn"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76m1.39 9.74v-8.37H5.07v8.37h2.78z" />
    </svg>
  );
}

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
  { href: "/studios/new", label: "List Your Studio" },
  { href: "/pricing", label: "Pricing & Plans" },
];

const studioCategories = [
  {
    href: "/studios?category=photo-cyclorama",
    label: "Photo & Cyclorama Studios",
  },
  { href: "/studios?category=daylight-lofts", label: "Daylight & Loft Spaces" },
  {
    href: "/studios?category=film-sound-stages",
    label: "Film & Sound Stages",
  },
  {
    href: "/studios?category=podcast-audio",
    label: "Podcast & Audio Booths",
  },
  {
    href: "/studios?category=rooftop-outdoor",
    label: "Rooftop & Outdoor Sets",
  },
  {
    href: "/studios?category=creative-warehouses",
    label: "Industrial & Warehouses",
  },
];

const resourceLinks = [
  { href: "/support", label: "Help & Support Center" },
  { href: "/host-guarantee", label: "Host Protection Guarantee" },
  { href: "/community", label: "Creator Community" },
  { href: "/cancellation", label: "Cancellation & Refund Policy" },
  { href: "/contact", label: "Contact Production Team" },
];

const socialLinks = [
  {
    name: "X",
    href: "https://x.com/studiospace",
    Icon: XIcon,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/studiospace",
    Icon: InstagramIcon,
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@studiospace",
    Icon: YouTubeIcon,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/studiospace",
    Icon: LinkedInIcon,
  },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/cookies", label: "Cookie Preferences" },
  { href: "/security", label: "Security & Trust" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isPending, setIsPending] = useState(false);

  async function handleNewsletterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email || isPending) return;

    setIsPending(true);
    // Simulate brief network dispatch
    await new Promise((resolve) => setTimeout(resolve, 600));

    setIsPending(false);
    setIsSubscribed(true);
    toast.success(
      "Welcome aboard! You're subscribed to the StudioSpace dispatch.",
    );
  }

  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-border bg-card/60 text-foreground transition-colors">
      {/* Top Banner / Newsletter Section */}
      <div className="border-b border-border/80 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-background/95 p-6 shadow-xs sm:p-10 lg:flex lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-semibold tracking-wide text-brand">
                <Sparkles className="size-3.5" />
                The Call Sheet Dispatch
              </span>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Stay on the cutting edge of creative spaces.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Get curated studio launches, production equipment spotlights,
                and exclusive creator discounts delivered directly to your inbox
                every week.
              </p>
            </div>

            <div className="mt-6 w-full lg:mt-0 lg:max-w-md">
              {isSubscribed ? (
                <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="font-semibold">You&apos;re on the list!</p>
                    <p className="text-xs opacity-90">
                      Check {email} shortly for your welcome guide and studio
                      perks.
                    </p>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleNewsletterSubmit}
                  className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
                >
                  <div className="relative flex-1">
                    <Mail className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="producer@production.co"
                      aria-label="Email address for newsletter"
                      className="h-11 w-full rounded-lg border border-input bg-background pr-3.5 pl-10 text-sm outline-none placeholder:text-muted-foreground/60 transition-colors focus-visible:border-brand/60 focus-visible:ring-3 focus-visible:ring-brand/15"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-strong focus-visible:ring-3 focus-visible:ring-brand/40 disabled:opacity-60"
                  >
                    {isPending ? "Subscribing…" : "Subscribe"}
                    <ArrowRight className="size-4" />
                  </button>
                </form>
              )}
              <p className="mt-2 text-[11px] text-muted-foreground">
                No spam, ever. Unsubscribe with a single click at any time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation Columns */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand & Mission Statement */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 w-fit"
              aria-label="StudioSpace home"
            >
              <span className="flex size-9 items-center justify-center rounded-xl bg-brand/10 border border-brand/20">
                <Aperture className="size-5 text-brand" />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-bold tracking-[0.14em] text-foreground">
                  STUDIOSPACE
                </span>
                <span className="text-[9px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
                  CONVERTING SPACES INTO STAGES
                </span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-muted-foreground">
              StudioSpace converts architectural marvels, industrial lofts, and
              acoustically treated soundstages into turn-key production stages.
              Empowering directors, photographers, and spatial creators
              globally.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 font-medium">
                <ShieldCheck className="size-3.5 text-brand" />
                Verified Space Host
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-2.5 py-1 font-medium">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                Instant Check-in Ready
              </span>
            </div>

            {/* Social Links with new X logo */}
            <div className="pt-2">
              <p className="text-xs font-semibold tracking-wider text-foreground uppercase">
                Connect with our community
              </p>
              <div className="mt-3 flex items-center gap-2.5">
                {socialLinks.map(({ name, href, Icon }) => (
                  <a
                    key={name}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Follow StudioSpace on ${name}`}
                    className="flex size-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-all hover:border-brand/40 hover:bg-brand/10 hover:text-brand focus-visible:ring-2 focus-visible:ring-brand/40"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 md:col-span-1">
            <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Studio Categories */}
          <div className="lg:col-span-3 md:col-span-1">
            <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
              Studio Categories
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {studioCategories.map((category) => (
                <li key={category.href}>
                  <Link
                    href={category.href}
                    className="text-muted-foreground transition-colors hover:text-brand"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources & Support */}
          <div className="lg:col-span-3 md:col-span-1">
            <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
              Support & Host Trust
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {resourceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-brand"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal, Terms, and Copyright Notice */}
      <div className="border-t border-border bg-background/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground text-center sm:text-left">
            &copy; {currentYear} StudioSpace, Inc. All rights reserved.
            Converting Spaces Into Stages.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground hover:underline underline-offset-4"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
