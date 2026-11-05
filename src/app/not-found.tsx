import { Clapperboard, Compass, Home } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center px-4 py-16 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Subtle Dot Matrix Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#d1d5db_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#374151_1.2px,transparent_1.2px)] [background-size:22px_22px]"
      />

      <div className="relative z-10 mx-auto max-w-2xl text-center flex flex-col items-center">
        {/* Top Production Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-brand uppercase mb-6">
          <Clapperboard className="size-3.5" />
          <span>Scene Missing • Take 404</span>
        </div>

        {/* Creative Studio Illustration */}
        <div className="relative my-4 flex items-center justify-center">
          <svg
            className="w-72 h-56 sm:w-88 sm:h-64 text-foreground drop-shadow-md"
            viewBox="0 0 360 260"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Creative film studio set with camera on tripod and spotlight"
          >
            {/* Background Soundstage Grid */}
            <rect
              x="20"
              y="20"
              width="320"
              height="200"
              rx="16"
              fill="currentColor"
              className="text-muted/40"
            />
            <path
              d="M20 70H340 M20 120H340 M20 170H340 M80 20V220 M140 20V220 M200 20V220 M260 20V220"
              stroke="currentColor"
              className="text-border/60"
              strokeDasharray="4 4"
            />

            {/* Studio Overhead Spotlight Cones */}
            <path
              d="M60 20 L20 180 L140 180 Z"
              fill="url(#spotlight-gradient)"
              opacity="0.35"
            />
            <path
              d="M300 20 L220 180 L340 180 Z"
              fill="url(#spotlight-gradient)"
              opacity="0.25"
            />

            {/* Left Studio Lamp */}
            <circle cx="60" cy="24" r="10" fill="#ff5c1a" />
            <path d="M52 24 L45 38 H75 L68 24 Z" fill="#ec4c0c" />

            {/* Right Studio Lamp */}
            <circle cx="300" cy="24" r="8" fill="#ff5c1a" opacity="0.8" />
            <path d="M294 24 L288 36 H312 L306 24 Z" fill="#ec4c0c" />

            {/* Studio Director's Chair */}
            <g transform="translate(70, 115)">
              {/* Backrest with brand star */}
              <rect x="6" y="0" width="36" height="18" rx="3" fill="#ff5c1a" />
              <circle cx="24" cy="9" r="3" fill="white" />
              {/* Seat */}
              <rect x="4" y="28" width="40" height="6" rx="2" fill="#1f2937" />
              {/* Legs (scissor X) */}
              <line
                x1="8"
                y1="34"
                x2="38"
                y2="78"
                stroke="#4b5563"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="40"
                y1="34"
                x2="10"
                y2="78"
                stroke="#4b5563"
                strokeWidth="3"
                strokeLinecap="round"
              />
              {/* Armrests */}
              <line
                x1="6"
                y1="18"
                x2="6"
                y2="28"
                stroke="#4b5563"
                strokeWidth="2.5"
              />
              <line
                x1="42"
                y1="18"
                x2="42"
                y2="28"
                stroke="#4b5563"
                strokeWidth="2.5"
              />
            </g>

            {/* Center Studio Production Camera on Tripod */}
            <g transform="translate(145, 75)">
              {/* Dual Film Reels */}
              <circle
                cx="22"
                cy="12"
                r="14"
                fill="#374151"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <circle cx="22" cy="12" r="4" fill="#ff5c1a" />
              <circle
                cx="48"
                cy="12"
                r="14"
                fill="#374151"
                stroke="#1f2937"
                strokeWidth="2"
              />
              <circle cx="48" cy="12" r="4" fill="#ff5c1a" />

              {/* Camera Body */}
              <rect
                x="12"
                y="24"
                width="46"
                height="30"
                rx="6"
                fill="#111827"
                stroke="#374151"
                strokeWidth="1.5"
              />

              {/* "404" glowing screen on camera body */}
              <rect
                x="18"
                y="30"
                width="22"
                height="12"
                rx="2"
                fill="#ff5c1a"
              />
              <text
                x="21"
                y="39"
                fontSize="8"
                fontWeight="bold"
                fill="white"
                fontFamily="sans-serif"
              >
                404
              </text>

              {/* Lens / Matte Box */}
              <polygon
                points="58,32 78,25 78,53 58,46"
                fill="#1f2937"
                stroke="#ff5c1a"
                strokeWidth="1.5"
              />
              <circle cx="78" cy="39" r="6" fill="#ff5c1a" opacity="0.6" />

              {/* Viewfinder */}
              <rect x="22" y="18" width="16" height="6" rx="2" fill="#4b5563" />

              {/* Heavy Duty Tripod Stand */}
              <circle cx="35" cy="56" r="4" fill="#374151" />
              <line
                x1="35"
                y1="58"
                x2="10"
                y2="128"
                stroke="#374151"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <line
                x1="35"
                y1="58"
                x2="35"
                y2="128"
                stroke="#4b5563"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <line
                x1="35"
                y1="58"
                x2="60"
                y2="128"
                stroke="#374151"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </g>

            {/* Production Clapperboard on floor */}
            <g transform="translate(240, 140)">
              {/* Bottom slate */}
              <rect
                x="0"
                y="16"
                width="56"
                height="40"
                rx="4"
                fill="#111827"
                stroke="#374151"
                strokeWidth="1.5"
              />
              <text
                x="6"
                y="32"
                fontSize="7"
                fontWeight="bold"
                fill="#ff5c1a"
                fontFamily="sans-serif"
              >
                TAKE 404
              </text>
              <text
                x="6"
                y="44"
                fontSize="6"
                fill="#9ca3af"
                fontFamily="sans-serif"
              >
                STUDIO LOST
              </text>

              {/* Top angled clapper stick */}
              <g transform="rotate(-15 0 16)">
                <rect
                  x="0"
                  y="4"
                  width="56"
                  height="12"
                  rx="2"
                  fill="#1f2937"
                />
                <polygon points="4,4 12,4 6,16 -2,16" fill="white" />
                <polygon points="18,4 26,4 20,16 12,16" fill="#ff5c1a" />
                <polygon points="32,4 40,4 34,16 26,16" fill="white" />
                <polygon points="46,4 54,4 48,16 40,16" fill="#ff5c1a" />
              </g>
            </g>

            {/* Gradients */}
            <defs>
              <linearGradient
                id="spotlight-gradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="0%" stopColor="#ff5c1a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ff5c1a" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Headline */}
        <h1 className="mt-3 text-3xl sm:text-5xl font-bold tracking-tight text-foreground font-serif">
          Cut! This Scene Doesn&apos;t Exist.
        </h1>

        {/* Narrative Description */}
        <p className="mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-muted-foreground">
          The soundstage or creative space you&apos;re looking for might have
          wrapped production, had its set struck, or been relocated to a
          different studio.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          {/* Direct Return to Home button as required */}
          <Link
            href="/"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-white shadow-sm hover:bg-brand-strong transition-all duration-200"
          >
            <Home className="size-4" />
            <span>Return to Home</span>
          </Link>

          {/* Secondary Explore Studios */}
          <Link
            href="/studios"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs"
          >
            <Compass className="size-4 text-brand" />
            <span>Explore Studios</span>
          </Link>
        </div>

        {/* Help Link */}
        <p className="mt-10 text-xs text-muted-foreground">
          Need assistance booking a space?{" "}
          <Link
            href="/#howitworks"
            className="text-brand font-medium hover:underline underline-offset-4"
          >
            Learn How It Works
          </Link>{" "}
          or return to{" "}
          <Link
            href="/"
            className="text-brand font-medium hover:underline underline-offset-4"
          >
            Homepage
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
