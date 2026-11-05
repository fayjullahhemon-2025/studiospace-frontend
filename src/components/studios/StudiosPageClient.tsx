"use client";

import {
  ArrowRight,
  Heart,
  MapPin,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  SearchX,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import EmptyState from "@/components/shared/EmptyState";
import {
  type FilterState,
  StudioFilters,
} from "@/components/studios/StudioFilters";

type Studio = {
  _id: string;
  title: string;
  category: string;
  hourlyRate: number;
  rating: number;
  reviewCount?: number;
  location: string;
  image: string;
  description?: string;
};

const CATEGORIES = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

const PAGE_SIZE = 6;

function applyFilters(studios: Studio[], filters: FilterState): Studio[] {
  let list = [...studios];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    list = list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q),
    );
  }

  if (filters.category) {
    list = list.filter((s) => s.category === filters.category);
  }

  if (filters.minPrice > 0) {
    list = list.filter((s) => s.hourlyRate >= filters.minPrice);
  }
  if (filters.maxPrice < 500) {
    list = list.filter((s) => s.hourlyRate <= filters.maxPrice);
  }

  if (filters.minRating > 0) {
    list = list.filter((s) => s.rating >= filters.minRating);
  }

  switch (filters.sort) {
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "price-asc":
      list.sort((a, b) => a.hourlyRate - b.hourlyRate);
      break;
    case "price-desc":
      list.sort((a, b) => b.hourlyRate - a.hourlyRate);
      break;
  }

  return list;
}

export function StudiosPageClient() {
  const [allStudios, setAllStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    minPrice: 0,
    maxPrice: 500,
    minRating: 0,
    search: "",
    sort: "rating",
  });
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [headerCategory, setHeaderCategory] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    void reloadKey;
    async function fetchStudios() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("http://localhost:5000/studios");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const json: unknown = await res.json();
        const list: Studio[] = Array.isArray(json)
          ? json
          : Array.isArray((json as { data?: Studio[] }).data)
            ? ((json as { data: Studio[] }).data ?? [])
            : [];
        if (isMounted) {
          setAllStudios(list);
        }
      } catch (e) {
        if (isMounted) {
          setError(e instanceof Error ? e.message : "Failed to load studios.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchStudios();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  function handleFilterChange(nextFilters: FilterState) {
    setFilters(nextFilters);
    setPage(1);
  }

  const filtered = applyFilters(allStudios, filters);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleHeaderSearch(e: React.FormEvent) {
    e.preventDefault();
    setFilters((f) => ({
      ...f,
      search: headerSearch,
      category: headerCategory || f.category,
    }));
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Page Header ── */}
      <div className="border-b border-border/80 bg-muted/20 py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Explore Creative Spaces
          </h1>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-2xl">
            Find the perfect production environment for your next photo
            production, cinema shoot, or recording session.
          </p>

          {/* Top Search & Filter Bar */}
          <form
            onSubmit={handleHeaderSearch}
            className="mt-6 flex flex-wrap items-center gap-3"
          >
            {/* Location/Keyword */}
            <div className="relative flex-1 min-w-48">
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Keyword, title, or location…"
                className="h-11 w-full rounded-xl border border-input bg-background pr-4 pl-10 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand/60 focus-visible:ring-2 focus-visible:ring-brand/15"
              />
            </div>

            {/* Category Quick Select */}
            <select
              value={headerCategory}
              onChange={(e) => setHeaderCategory(e.target.value)}
              className="h-11 rounded-xl border border-input bg-background px-3.5 pr-9 text-sm text-foreground outline-none focus-visible:border-brand/60"
            >
              <option value="">All Studio Types</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-brand px-6 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-strong"
            >
              <Search className="size-4" />
              Search Spaces
            </button>
          </form>
        </div>
      </div>

      {/* ── Layout: Sidebar + Grid ── */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex gap-8 items-start">
          {/* ── Sidebar Filters (desktop) ── */}
          <div className="hidden lg:block w-60 xl:w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-border/80 bg-card p-5 shadow-2xs">
              <Suspense>
                <StudioFilters
                  filters={filters}
                  totalCount={allStudios.length}
                  filteredCount={filtered.length}
                  onChange={handleFilterChange}
                />
              </Suspense>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Toggle + Sort Row */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground shadow-2xs hover:bg-muted lg:hidden"
              >
                <SlidersHorizontal className="size-4 text-brand" />
                Filters
              </button>

              <div className="hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {filtered.length}
                </span>
                <span>studios found</span>
              </div>

              <div className="flex items-center gap-2 ml-auto text-xs">
                <span className="text-muted-foreground hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={filters.sort}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      sort: e.target.value as FilterState["sort"],
                    }))
                  }
                  className="h-9 rounded-lg border border-input bg-background px-2.5 text-xs text-foreground outline-none focus-visible:border-brand/60"
                >
                  <option value="rating">Rating ↓</option>
                  <option value="price-asc">Price ↑</option>
                  <option value="price-desc">Price ↓</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"].map((k) => (
                  <div
                    key={k}
                    className="rounded-2xl border border-border/80 bg-card p-3 shadow-2xs"
                  >
                    <div className="aspect-[16/10] w-full animate-pulse rounded-xl bg-muted" />
                    <div className="mt-3 h-4 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="mt-2 h-3 w-5/6 animate-pulse rounded bg-muted" />
                    <div className="mt-4 h-8 w-full animate-pulse rounded-lg bg-muted" />
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {!loading && error && (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-10 text-center">
                <p className="text-sm text-destructive font-medium">{error}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-xs font-semibold text-destructive hover:bg-destructive/20"
                >
                  <RefreshCw className="size-3.5" />
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && filtered.length === 0 && (
              <EmptyState
                icon={SearchX}
                badge={
                  filters.search
                    ? `Query: "${filters.search}"`
                    : filters.category
                      ? `Category: ${filters.category}`
                      : "0 Matches Found"
                }
                title={
                  filters.search
                    ? `No Studios Matching "${filters.search}"`
                    : filters.category
                      ? `No ${filters.category} Available`
                      : "No Studios Match Your Criteria"
                }
                description={
                  filters.search
                    ? "We couldn't find any production stages matching your search keywords. Try adjusting your search term, checking for typos, or broadening your criteria."
                    : "No spaces matched the current combination of category, price, and rating filters. Try broadening your criteria or reset all filters to view our full catalog."
                }
                tips={
                  filters.search
                    ? [
                        "Check for spelling errors or alternative terms (e.g., 'photo' instead of 'photographer')",
                        "Search by city, neighborhood, or specific equipment",
                        "Clear active filters to expand your search across all categories",
                      ]
                    : [
                        "Widen your hourly rate range to view more options",
                        "Lower the minimum rating filter",
                        "Explore other creative disciplines like Sound Stages or Music Suites",
                      ]
                }
                primaryAction={{
                  label: "Clear All Filters",
                  icon: RotateCcw,
                  onClick: () =>
                    setFilters({
                      category: "",
                      minPrice: 0,
                      maxPrice: 500,
                      minRating: 0,
                      search: "",
                      sort: "rating",
                    }),
                }}
                secondaryAction={{
                  label: "Host Your Space",
                  icon: Plus,
                  href: "/add-studio",
                }}
              />
            )}

            {/* Studio Cards Grid */}
            {!loading && !error && paged.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                  {paged.map((studio) => (
                    <div
                      key={studio._id}
                      className="group flex flex-col rounded-2xl border border-border/80 bg-card p-3 shadow-2xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800"
                    >
                      {/* Image */}
                      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
                        <Image
                          src={studio.image}
                          alt={studio.title}
                          fill
                          unoptimized
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />

                        {/* Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
                          {studio.rating >= 4.93 && (
                            <span className="rounded-full bg-emerald-500/90 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                              Featured
                            </span>
                          )}
                          <span className="rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white/90 backdrop-blur-sm border border-white/15">
                            {studio.category}
                          </span>
                        </div>

                        {/* Favorite */}
                        <button
                          type="button"
                          onClick={() => toggleFavorite(studio._id)}
                          aria-label={`Favorite ${studio.title}`}
                          className="absolute top-2.5 right-2.5 z-10 flex size-8 items-center justify-center rounded-full bg-white/85 shadow-xs backdrop-blur-md transition-transform hover:scale-110 active:scale-95 dark:bg-black/70"
                        >
                          <Heart
                            className={`size-4 transition-colors ${favorites[studio._id] ? "fill-red-500 text-red-500" : "text-neutral-700 dark:text-neutral-300"}`}
                          />
                        </button>
                      </div>

                      {/* Card Body */}
                      <div className="mt-3 flex flex-1 flex-col px-0.5">
                        {/* Location + Rating Row */}
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="flex items-center gap-1 truncate text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            <MapPin className="size-3 shrink-0" />
                            {studio.location}
                          </span>
                          <div className="flex items-center gap-1 shrink-0 font-semibold text-foreground">
                            <Star className="size-3.5 fill-amber-500 text-amber-500" />
                            <span>{studio.rating.toFixed(2)}</span>
                            {studio.reviewCount ? (
                              <span className="font-normal text-muted-foreground">
                                ({studio.reviewCount})
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="mt-1.5 text-base font-bold tracking-tight text-foreground line-clamp-1 transition-colors group-hover:text-brand">
                          {studio.title}
                        </h3>

                        {/* Description */}
                        {studio.description && (
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                            {studio.description}
                          </p>
                        )}

                        {/* Price + CTA */}
                        <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-border/60 pt-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black tracking-tight text-foreground">
                              ${studio.hourlyRate}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              / hr
                            </span>
                          </div>

                          <Link
                            href={`/studios/${studio._id}`}
                            className="inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-brand dark:bg-neutral-700 dark:hover:bg-brand"
                          >
                            View Details
                            <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                    >
                      ← Prev
                    </button>

                    <div className="flex gap-1.5">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (p) => (
                          <button
                            key={`page-${p}`}
                            type="button"
                            onClick={() => setPage(p)}
                            className={`flex size-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors ${
                              p === page
                                ? "border-brand bg-brand text-white shadow-xs"
                                : "border-border bg-card text-foreground hover:bg-muted"
                            }`}
                          >
                            {p}
                          </button>
                        ),
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={page === totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 text-xs font-semibold text-foreground shadow-2xs transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Bottom CTA Banner */}
            {!loading && !error && (
              <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-border/70 bg-muted/30 px-6 py-7 sm:px-8">
                <div>
                  <p className="text-base font-bold text-foreground">
                    Can&apos;t find your ideal space?
                  </p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    Our production concierge curates a shortlist of 100+ private
                    off-market studios.
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-brand-strong"
                >
                  Request Custom Booking
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            aria-hidden
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-sm flex-col overflow-y-auto bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-base font-bold text-foreground">
                Filters
              </span>
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted"
              >
                <X className="size-4" />
              </button>
            </div>
            <Suspense>
              <StudioFilters
                filters={filters}
                totalCount={allStudios.length}
                filteredCount={filtered.length}
                onChange={(next) => {
                  handleFilterChange(next);
                  setSidebarOpen(false);
                }}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
