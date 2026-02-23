import { UserRole } from '@prisma/client';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureIndicatorProps {
  requiredRole: UserRole[];
  userRole?: UserRole;
  icon?: LucideIcon;
  label: string;
  description?: string;
  className?: string;
}

export function FeatureIndicator({
  requiredRole,
  userRole,
  icon: Icon,
  label,
  description,
  className,
}: FeatureIndicatorProps) {
  const hasAccess = userRole ? requiredRole.includes(userRole) : false;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
        hasAccess
          ? 'border-success/20 bg-success/5 text-success'
          : 'border-border bg-muted/30 text-muted-foreground opacity-60',
        className
      )}
      title={description}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      <span className="font-medium">{label}</span>
      {!hasAccess && (
        <span className="text-xs opacity-70">
          (Requires {requiredRole.map((r) => r.toLowerCase()).join(' or ')})
        </span>
      )}
    </div>
  );
}
