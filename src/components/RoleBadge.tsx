import { UserRole } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Shield, BookKey, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoleBadgeProps {
  role: UserRole;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const roleConfig = {
  [UserRole.ADMIN]: {
    label: 'Admin',
    icon: Shield,
    variant: 'admin' as const,
    description: 'Full system access',
  },
  [UserRole.LIBRARIAN]: {
    label: 'Librarian',
    icon: BookKey,
    variant: 'librarian' as const,
    description: 'Manage books & users',
  },
  [UserRole.MEMBER]: {
    label: 'Member',
    icon: User,
    variant: 'member' as const,
    description: 'Browse & borrow books',
  },
};

export function RoleBadge({ role, showIcon = false, size = 'md', className }: RoleBadgeProps) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={cn(
        showIcon && 'gap-1.5',
        size === 'sm' && 'text-[10px] px-2 py-0.5',
        size === 'lg' && 'text-sm px-3 py-1',
        className
      )}
      title={config.description}
    >
      {showIcon && <Icon className={cn(size === 'sm' ? 'h-2.5 w-2.5' : 'h-3 w-3')} />}
      {config.label}
    </Badge>
  );
}
