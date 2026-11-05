"use client";

import { ArrowRight, Heart, RefreshCw, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/api";

export type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  rating: number;
  reviewCount?: number;
  location: string;
  image: string;
  description?: string;
  featured?: boolean;
};

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  async function loadStudios() {
    try {
      setLoading(true);
      setError(null);

      // Fetch dynamic studio list with limit=6
      const response = await fetch(`${API_BASE_URL}/studios?limit=6`);
      if (!response.ok) {
        throw new Error(`Failed to load studios (Status ${response.status})`);
      }

      const json: unknown = await response.json();
      const rawList: Studio[] = Array.isArray(json)
        ? json
        : typeof json === "object" &&
          json !== null &&
          Array.isArray((json as { data?: unknown[] }).data)
          ? ((json as { data: Studio[] }).data ?? [])
          : [];

      // Sort by rating (top-rated) and ensure exactly 6 items
      const topStudios = rawList
        .slice()
        .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        .slice(0, 6);

      setStudios(topStudios);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the studio service.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudios();
  }, []);

  function toggleFavorite(id: string) {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <section className="py-14 sm:py-20 bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-10">
          <div>
            <span className="text-xs font-semibold tracking-wider text-brand uppercase">
              Curated Catalog
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Spaces Worth Creating In
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
              Hand-picked spaces vetted for production quality, clean natural
              light, professional acoustics, and reliable hosts.
            </p>
          </div>

          <Link
            href="/studios"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-brand transition-colors shrink-0"
          >
            <span>View All 140+ Spaces</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="flex flex-col rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs"
              >
                <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-muted" />
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-3 w-28 animate-pulse rounded-md bg-muted" />
                  <div className="h-3 w-14 animate-pulse rounded-md bg-muted" />
                </div>
                <div className="mt-3 h-5 w-3/4 animate-pulse rounded-md bg-muted" />
                <div className="mt-2 h-3 w-5/6 animate-pulse rounded-md bg-muted" />
                <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-3">
                  <div className="h-6 w-20 animate-pulse rounded-md bg-muted" />
                  <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center max-w-md mx-auto my-6">
            <p className="text-sm font-medium text-destructive">{error}</p>
            <button
              type="button"
              onClick={loadStudios}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/20"
            >
              <RefreshCw className="size-3.5" />
              <span>Retry Loading</span>
            </button>
          </div>
        )}

        {/* Studio Cards Grid */}
        {!loading && !error && studios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {studios.map((studio) => (
              <div
                key={studio._id}
                className="group flex flex-col rounded-2xl border border-border/80 bg-card p-3.5 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:border-neutral-700"
              >
                {/* Studio Image Container */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={studio.image}
                    alt={studio.title}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-1.5">
                    {Number(studio.rating) >= 4.93 && (
                      <span className="rounded-full bg-emerald-500/90 text-white px-2.5 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur-md shadow-xs">
                        Featured
                      </span>
                    )}
                    <span className="rounded-full bg-black/60 text-white/95 px-2.5 py-0.5 text-[10px] font-medium tracking-wide backdrop-blur-md border border-white/20 shadow-xs">
                      {studio.category}
                    </span>
                  </div>

                  {/* Heart / Favorite Button */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(studio._id)}
                    aria-label={`Save ${studio.title} to favorites`}
                    className="absolute top-3 right-3 z-10 flex size-8 items-center justify-center rounded-full bg-white/85 dark:bg-black/70 backdrop-blur-md shadow-xs transition-transform hover:scale-110 active:scale-95"
                  >
                    <Heart
                      className={`size-4 transition-colors ${favorites[studio._id]
                        ? "fill-red-500 text-red-500"
                        : "text-neutral-700 dark:text-neutral-300"
                        }`}
                    />
                  </button>
                </div>

                {/* Card Content */}
                <div className="mt-3.5 flex flex-1 flex-col">
                  {/* Location & Rating */}
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="truncate font-semibold tracking-wider text-muted-foreground uppercase text-[11px]">
                      {studio.location}
                    </span>
                    <div className="flex items-center gap-1 shrink-0 font-semibold text-foreground">
                      <Star className="size-3.5 fill-amber-500 text-amber-500" />
                      <span>{Number(studio.rating).toFixed(2)}</span>
                      {studio.reviewCount ? (
                        <span className="font-normal text-muted-foreground text-[11px]">
                          ({studio.reviewCount})
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="mt-1.5 text-base sm:text-lg font-bold text-foreground tracking-tight line-clamp-1 group-hover:text-brand transition-colors">
                    <Link href={`/studios/${studio._id}`}>{studio.title}</Link>
                  </h3>

                  {/* Description / Features */}
                  {studio.description ? (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                      {studio.description}
                    </p>
                  ) : null}

                  {/* Price & View Details Action */}
                  <div className="mt-4 pt-3 border-t border-border/70 flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold tracking-tight text-foreground">
                        ${studio.hourlyRate}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        / hour
                      </span>
                    </div>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="inline-flex items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 text-neutral-800 dark:text-neutral-200 px-4 py-2 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedStudios;
