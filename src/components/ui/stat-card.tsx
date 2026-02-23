import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
  valueClassName?: string;
  iconClassName?: string;
}

export function StatCard({
  title,
  value,
  icon,
  description,
  className,
  valueClassName,
  iconClassName,
}: StatCardProps) {
  return (
    <div
      className={cn(
        // Layout & base appearance
        'group relative rounded-xl border border-border bg-card p-5 overflow-hidden',
        // Entrance
        'animate-slide-up',
        // Hover: sharpen border + grow shadow — avoid transform (conflicts with forwards-fill animation)
        'hover:border-primary/20 shadow-card hover:shadow-card-hover',
        'transition-[border-color,box-shadow] duration-200 ease-smooth',
        className
      )}
    >
      {/* Ambient hover gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </p>
          <p className={cn('text-2xl font-bold tracking-tight tabular-nums', valueClassName)}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {icon && (
          <div
            className={cn(
              // Base
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary',
              // Spring-pop on parent hover — icon bounces slightly
              'transition-transform duration-300 ease-spring group-hover:scale-110',
              iconClassName
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
