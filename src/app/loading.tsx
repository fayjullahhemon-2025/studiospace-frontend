import BrandedSpinner from "@/components/shared/BrandedSpinner";

export default function Loading() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Subtle Dot Matrix Background matching studio brand */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 bg-[radial-gradient(#d1d5db_1.2px,transparent_1.2px)] dark:bg-[radial-gradient(#374151_1.2px,transparent_1.2px)] [background-size:22px_22px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <BrandedSpinner
          size="lg"
          label="Preparing creative workspace…"
          className="scale-110"
        />

        <div className="mt-6 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-brand animate-ping" />
          <span className="text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
            Converting spaces into stages
          </span>
        </div>
      </div>
    </div>
  );
}
