interface StudioSkeletonProps {
  count?: number;
  className?: string;
}

const STATIC_SKELETON_KEYS = [
  "studio-sk-1",
  "studio-sk-2",
  "studio-sk-3",
  "studio-sk-4",
  "studio-sk-5",
  "studio-sk-6",
];

export default function StudioSkeleton({
  count = 6,
  className = "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",
}: StudioSkeletonProps) {
  const keys = STATIC_SKELETON_KEYS.slice(0, count);

  return (
    <div className={className} aria-busy="true">
      {keys.map((key) => (
        <div
          key={key}
          className="group rounded-3xl border border-border bg-card p-4 shadow-2xs overflow-hidden flex flex-col animate-pulse"
        >
          {/* Studio Image Skeleton */}
          <div className="relative aspect-[16/10] w-full rounded-2xl bg-muted/80 overflow-hidden">
            <div className="absolute top-3 left-3 h-6 w-24 rounded-full bg-background/60" />
            <div className="absolute bottom-3 right-3 h-7 w-20 rounded-lg bg-background/60" />
          </div>

          {/* Details Skeleton */}
          <div className="mt-4 flex-1 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded-full bg-muted" />
              <div className="h-3.5 w-16 rounded-full bg-muted" />
            </div>

            <div className="space-y-1.5">
              <div className="h-5 w-4/5 rounded-md bg-muted" />
              <div className="h-3.5 w-2/3 rounded-md bg-muted/70" />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-border/50">
              <div className="h-6 w-20 rounded-md bg-muted" />
              <div className="h-9 w-28 rounded-full bg-brand/20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
