"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export type FilterState = {
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  search: string;
  sort: "rating" | "price-asc" | "price-desc" | "newest";
};

const CATEGORIES = [
  "Photo Studios",
  "Sound Stages",
  "Podcast Rooms",
  "Music Suites",
  "Art Workshops",
];

const SORT_OPTIONS: { value: FilterState["sort"]; label: string }[] = [
  { value: "rating", label: "Top Rated" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
];

const RATING_OPTIONS = [4.9, 4.8, 4.5];

type Props = {
  filters: FilterState;
  totalCount: number;
  filteredCount: number;
  onChange: (next: FilterState) => void;
};

export function StudioFilters({
  filters,
  totalCount,
  filteredCount,
  onChange,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localSearch, setLocalSearch] = useState(filters.search);

  // Sync category from URL ?category= param on first render
  useEffect(() => {
    const cat = searchParams.get("category") ?? "";
    if (cat && cat !== filters.category) {
      onChange({ ...filters, category: cat });
    }
  }, [searchParams, filters, onChange]);

  function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const next = { ...filters, [key]: value };
    onChange(next);
    // Keep URL in sync for category
    if (key === "category") {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set("category", String(value));
      } else {
        params.delete("category");
      }
      router.replace(`/studios?${params.toString()}`, { scroll: false });
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    update("search", localSearch);
  }

  function clearAll() {
    setLocalSearch("");
    onChange({
      category: "",
      minPrice: 0,
      maxPrice: 500,
      minRating: 0,
      search: "",
      sort: "rating",
    });
    router.replace("/studios", { scroll: false });
  }

  const hasActiveFilters =
    filters.category !== "" ||
    filters.minPrice > 0 ||
    filters.maxPrice < 500 ||
    filters.minRating > 0 ||
    filters.search !== "";

  return (
    <aside className="flex flex-col gap-6 text-sm">
      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">{filteredCount}</span>{" "}
          of <span className="font-semibold text-foreground">{totalCount}</span>{" "}
          studios
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-[11px] font-semibold text-brand hover:underline"
          >
            <X className="size-3" />
            Clear All
          </button>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Search within results */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col gap-1.5">
        <label
          htmlFor="filter-search-input"
          className="text-xs font-bold tracking-wider text-foreground uppercase"
        >
          Search Studios
        </label>
        <div className="flex gap-2">
          <input
            id="filter-search-input"
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="e.g. natural light…"
            className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-brand/60 focus-visible:ring-2 focus-visible:ring-brand/15"
          />
          <button
            type="submit"
            className="h-9 shrink-0 rounded-lg bg-brand px-3 text-xs font-semibold text-white hover:bg-brand-strong"
          >
            Go
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Sort */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold tracking-wider text-foreground uppercase">
          Sort By
        </span>
        <select
          value={filters.sort}
          onChange={(e) =>
            update("sort", e.target.value as FilterState["sort"])
          }
          className="h-9 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:border-brand/60 focus-visible:ring-2 focus-visible:ring-brand/15"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Category Filter */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold tracking-wider text-foreground uppercase">
          Studio Type
        </span>
        <ul className="flex flex-col gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => update("category", "")}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                filters.category === ""
                  ? "bg-brand/10 font-semibold text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <span>All Types</span>
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat}>
              <button
                type="button"
                onClick={() =>
                  update("category", filters.category === cat ? "" : cat)
                }
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                  filters.category === cat
                    ? "bg-brand/10 font-semibold text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{cat}</span>
                {filters.category === cat && (
                  <X className="size-3 text-brand" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Price / Hour
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            ${filters.minPrice} – $
            {filters.maxPrice === 500 ? "500+" : filters.maxPrice}
          </span>
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 flex-1">
            <label
              htmlFor="filter-min-price"
              className="text-[10px] text-muted-foreground"
            >
              Min
            </label>
            <input
              id="filter-min-price"
              type="number"
              min={0}
              max={filters.maxPrice - 10}
              value={filters.minPrice}
              onChange={(e) => update("minPrice", Number(e.target.value))}
              className="h-8 w-full rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none focus-visible:border-brand/60"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label
              htmlFor="filter-max-price"
              className="text-[10px] text-muted-foreground"
            >
              Max
            </label>
            <input
              id="filter-max-price"
              type="number"
              min={filters.minPrice + 10}
              max={500}
              value={filters.maxPrice}
              onChange={(e) => update("maxPrice", Number(e.target.value))}
              className="h-8 w-full rounded-lg border border-input bg-background px-2 text-xs text-foreground outline-none focus-visible:border-brand/60"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Minimum Rating */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs font-bold tracking-wider text-foreground uppercase">
          Minimum Rating
        </span>
        <ul className="flex flex-col gap-1.5">
          <li>
            <button
              type="button"
              onClick={() => update("minRating", 0)}
              className={`flex w-full items-center rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                filters.minRating === 0
                  ? "bg-brand/10 font-semibold text-brand"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              Any Rating
            </button>
          </li>
          {RATING_OPTIONS.map((r) => (
            <li key={r}>
              <button
                type="button"
                onClick={() =>
                  update("minRating", filters.minRating === r ? 0 : r)
                }
                className={`flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                  filters.minRating === r
                    ? "bg-brand/10 font-semibold text-brand"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>★ {r}+</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Filter Icon Indicator */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 rounded-xl border border-brand/30 bg-brand/5 px-3 py-2.5 text-xs font-medium text-brand">
          <SlidersHorizontal className="size-3.5" />
          <span>Filters active — results filtered</span>
        </div>
      )}
    </aside>
  );
}
