"use client";

import {
  ArrowRight,
  Camera,
  Film,
  Mic,
  Music2,
  Palette,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ComponentType, useEffect, useState } from "react";

type CategoryItem = {
  name: string;
  count: number;
  image: string;
  minPrice?: number;
  tagline: string;
  description: string;
  Icon: ComponentType<{ className?: string }>;
};

const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    name: "Photo Studios",
    count: 4,
    image:
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    minPrice: 90,
    tagline: "Natural Light & Cycloramas",
    description:
      "High-key daylight lofts, white cyc walls, and editorial sets.",
    Icon: Camera,
  },
  {
    name: "Sound Stages",
    count: 4,
    image:
      "https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=1200&q=80",
    minPrice: 120,
    tagline: "Grid Rigging & Isolation",
    description: "Certified soundproof stages with drive-in roll-up bays.",
    Icon: Film,
  },
  {
    name: "Podcast Rooms",
    count: 1,
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    minPrice: 65,
    tagline: "Broadcast & Multi-Mic",
    description: "4K live switcher rigs, Shure SM7B mics, and acoustic booths.",
    Icon: Mic,
  },
  {
    name: "Music Suites",
    count: 1,
    image:
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    minPrice: 110,
    tagline: "Mixing & Analog Consoles",
    description: "Neve pre-amps, isolated vocal tracking, and tuned acoustics.",
    Icon: Music2,
  },
  {
    name: "Art Workshops",
    count: 2,
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    minPrice: 75,
    tagline: "High Ceilings & Industrial",
    description: "Messy-friendly industrial lofts for spatial installations.",
    Icon: Palette,
  },
];

const ICONS_BY_CATEGORY: Record<
  string,
  {
    Icon: ComponentType<{ className?: string }>;
    tagline: string;
    description: string;
  }
> = {
  "Photo Studios": {
    Icon: Camera,
    tagline: "Natural Light & Cycloramas",
    description:
      "High-key daylight lofts, white cyc walls, and editorial sets.",
  },
  "Sound Stages": {
    Icon: Film,
    tagline: "Grid Rigging & Isolation",
    description: "Certified soundproof stages with drive-in roll-up bays.",
  },
  "Podcast Rooms": {
    Icon: Mic,
    tagline: "Broadcast & Multi-Mic",
    description: "4K live switcher rigs, Shure SM7B mics, and acoustic booths.",
  },
  "Music Suites": {
    Icon: Music2,
    tagline: "Mixing & Analog Consoles",
    description: "Neve pre-amps, isolated vocal tracking, and tuned acoustics.",
  },
  "Art Workshops": {
    Icon: Palette,
    tagline: "High Ceilings & Industrial",
    description: "Messy-friendly industrial lofts for spatial installations.",
  },
};

type ApiStudio = {
  _id: string;
  category: string;
  image: string;
  hourlyRate?: number;
};

export function BrowseCategories() {
  const [categories, setCategories] =
    useState<CategoryItem[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    let isMounted = true;

    async function loadDynamicCategories() {
      try {
        const response = await fetch("http://localhost:5000/studios");
        if (!response.ok) return;

        const json: unknown = await response.json();
        const studios: ApiStudio[] = Array.isArray(json)
          ? json
          : typeof json === "object" &&
              json !== null &&
              Array.isArray((json as { data?: unknown[] }).data)
            ? ((json as { data: ApiStudio[] }).data ?? [])
            : [];

        if (!isMounted || studios.length === 0) return;

        // Group counts, images, and minimum prices by category
        const groupMap = new Map<
          string,
          { count: number; image: string; minPrice: number }
        >();

        for (const studio of studios) {
          if (!studio.category) continue;
          const trimmedCat = studio.category.trim();
          const existing = groupMap.get(trimmedCat);

          if (existing) {
            existing.count += 1;
            if (studio.hourlyRate && studio.hourlyRate < existing.minPrice) {
              existing.minPrice = studio.hourlyRate;
            }
          } else {
            groupMap.set(trimmedCat, {
              count: 1,
              image: studio.image,
              minPrice: studio.hourlyRate || 75,
            });
          }
        }

        // Build merged category list based on expected ordering
        const orderedNames = [
          "Photo Studios",
          "Sound Stages",
          "Podcast Rooms",
          "Music Suites",
          "Art Workshops",
        ];

        const updated: CategoryItem[] = orderedNames.map((name) => {
          const apiGroup = groupMap.get(name);
          const fallback =
            DEFAULT_CATEGORIES.find((c) => c.name === name) ??
            DEFAULT_CATEGORIES[0];
          const meta = ICONS_BY_CATEGORY[name] ?? {
            Icon: Sparkles,
            tagline: "Creative Space",
            description: "Specialized studio ready for booking.",
          };

          return {
            name,
            count: apiGroup?.count ?? fallback.count,
            image: apiGroup?.image || fallback.image,
            minPrice: apiGroup?.minPrice ?? fallback.minPrice,
            tagline: meta.tagline,
            description: meta.description,
            Icon: meta.Icon,
          };
        });

        setCategories(updated);
      } catch (err) {
        console.warn("Using default category showcase data:", err);
      }
    }

    loadDynamicCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="border-t border-border/80 bg-muted/20 py-14 sm:py-20 text-foreground transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10">
          <div>
            <span className="text-xs font-semibold tracking-wider text-brand uppercase">
              Explore by Discipline
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Browse by Studio Categories
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Find purpose-built production environments tailored to your
              medium. Filter directly into instant availability and curated
              equipment.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-brand transition-colors shrink-0"
          >
            <span>All Categories</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 5 Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6">
          {categories.map((category) => {
            const { Icon } = category;
            const targetHref = `/studios?category=${encodeURIComponent(category.name)}`;

            return (
              <Link
                key={category.name}
                href={targetHref}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-neutral-800"
              >
                {/* Visual Image Backdrop */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 20vw"
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Subtle dark gradient scrim for icon contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

                  {/* Top Icon Badge */}
                  <div className="absolute top-3 left-3 z-10 flex size-9 items-center justify-center rounded-xl border border-white/25 bg-black/45 text-white shadow-xs backdrop-blur-md transition-colors group-hover:border-brand/60 group-hover:bg-brand">
                    <Icon className="size-4.5" />
                  </div>

                  {/* Studio Count Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-0.5 text-[10px] font-semibold text-white/90 backdrop-blur-md">
                      {category.count}{" "}
                      {category.count === 1 ? "Space" : "Spaces"}
                    </span>
                  </div>

                  {/* Tagline on image bottom */}
                  <div className="absolute bottom-2.5 left-3 right-3 z-10">
                    <span className="text-[10px] font-medium tracking-wide text-white/80 uppercase truncate block">
                      {category.tagline}
                    </span>
                  </div>
                </div>

                {/* Card Text Content */}
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground tracking-tight transition-colors group-hover:text-brand">
                      {category.name}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
                    <span className="font-semibold text-foreground">
                      From ${category.minPrice}
                      <span className="font-normal text-muted-foreground">
                        /hr
                      </span>
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-brand transition-transform group-hover:translate-x-1">
                      <span>Explore</span>
                      <ArrowRight className="size-3" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default BrowseCategories;
