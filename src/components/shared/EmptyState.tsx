import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
}

interface EmptyStateProps {
  icon: LucideIcon;
  badge?: string;
  title: string;
  description: ReactNode;
  tips?: string[];
  primaryAction?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  badge,
  title,
  description,
  tips,
  primaryAction,
  secondaryAction,
  className = "",
}: EmptyStateProps) {
  function renderAction(action: EmptyStateAction, isPrimary: boolean) {
    const ActionIcon = action.icon;
    const baseClasses = isPrimary
      ? "inline-flex h-11 items-center justify-center gap-2 rounded-full bg-brand px-6 text-sm font-semibold text-white shadow-sm hover:bg-brand-strong transition-all duration-200"
      : "inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold text-foreground hover:bg-muted transition-colors shadow-2xs";

    if (action.href) {
      return (
        <Link href={action.href} className={baseClasses}>
          {ActionIcon ? <ActionIcon className="size-4" /> : null}
          <span>{action.label}</span>
        </Link>
      );
    }

    return (
      <button type="button" onClick={action.onClick} className={baseClasses}>
        {ActionIcon ? <ActionIcon className="size-4" /> : null}
        <span>{action.label}</span>
      </button>
    );
  }

  return (
    <div
      className={`rounded-3xl border border-dashed border-border/80 bg-muted/20 p-8 sm:p-14 text-center ${className}`}
    >
      {/* Top Badge */}
      {badge ? (
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
          <span>{badge}</span>
        </div>
      ) : null}

      {/* Branded Icon Container */}
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-brand/10 text-brand mb-4 shadow-2xs">
        <Icon className="size-8 stroke-[1.75]" />
      </div>

      {/* Headline & Description */}
      <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h3>
      <div className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
        {description}
      </div>

      {/* Helpful Tips (if any) */}
      {tips && tips.length > 0 ? (
        <div className="mt-5 inline-block text-left rounded-2xl border border-border/60 bg-card/60 p-4 max-w-md mx-auto">
          <p className="text-[11px] font-semibold text-foreground uppercase tracking-wider mb-2">
            Suggested tips:
          </p>
          <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
            {tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* CTA Buttons */}
      {primaryAction || secondaryAction ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {primaryAction ? renderAction(primaryAction, true) : null}
          {secondaryAction ? renderAction(secondaryAction, false) : null}
        </div>
      ) : null}
    </div>
  );
}
