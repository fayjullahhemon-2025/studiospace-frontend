import { Search, Sparkles } from "lucide-react";
import StudioSkeleton from "@/components/shared/StudioSkeleton";

export default function StudiosLoading() {
  return (
    <main className="min-h-screen bg-background py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-6 border-b border-border">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand">
              <Sparkles className="size-3.5" />
              <span>Studio Catalog</span>
            </div>
            <div className="h-9 w-64 rounded-xl bg-muted animate-pulse" />
            <div className="h-4 w-96 max-w-full rounded-md bg-muted/70 animate-pulse" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-36 rounded-full bg-muted animate-pulse" />
          </div>
        </div>

        {/* Filter Bar Skeleton */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-4 shadow-2xs">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
              <div className="h-11 w-full rounded-xl bg-muted/60 animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-11 w-32 rounded-xl bg-muted/60 animate-pulse" />
              <div className="h-11 w-36 rounded-xl bg-muted/60 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Studio Cards Skeleton Grid */}
        <StudioSkeleton count={6} />
      </div>
    </main>
  );
}
