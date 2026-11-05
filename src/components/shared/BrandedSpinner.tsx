import { Aperture } from "lucide-react";

interface BrandedSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function BrandedSpinner({
  label = "Setting up creative stage…",
  size = "md",
  className = "",
}: BrandedSpinnerProps) {
  const sizeMap = {
    sm: {
      outer: "size-8",
      inner: "size-4",
      icon: "size-3.5",
      text: "text-xs",
    },
    md: {
      outer: "size-14",
      inner: "size-8",
      icon: "size-5",
      text: "text-sm",
    },
    lg: {
      outer: "size-20",
      inner: "size-11",
      icon: "size-7",
      text: "text-base",
    },
  };

  const currentSize = sizeMap[size];

  return (
    <div
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-3.5 ${className}`}
    >
      <div className="relative flex items-center justify-center">
        {/* Outer glowing orbital ring */}
        <div
          aria-hidden="true"
          className={`${currentSize.outer} rounded-full border-2 border-brand/20 border-t-brand border-r-brand/50 animate-spin`}
          style={{ animationDuration: "1.1s" }}
        />

        {/* Inner ambient pulse */}
        <div
          aria-hidden="true"
          className={`absolute ${currentSize.inner} rounded-full bg-brand/15 blur-xs animate-ping opacity-60`}
          style={{ animationDuration: "2s" }}
        />

        {/* Centered Brand Icon */}
        <div
          aria-hidden="true"
          className={`absolute flex items-center justify-center rounded-full bg-background shadow-xs`}
        >
          <Aperture
            className={`${currentSize.icon} text-brand animate-pulse`}
          />
        </div>
      </div>

      {label ? (
        <div className="flex items-center gap-1.5 text-center">
          <p
            className={`${currentSize.text} font-medium text-foreground tracking-tight`}
          >
            {label}
          </p>
        </div>
      ) : null}
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
