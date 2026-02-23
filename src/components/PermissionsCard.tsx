import { UserRole } from '@prisma/client';
import { Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Permission {
  label: string;
  description: string;
  roles: UserRole[];
}

const permissions: Permission[] = [
  {
    label: 'Browse Books',
    description: 'View and search the book catalog',
    roles: [UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.MEMBER],
  },
  {
    label: 'Borrow Books',
    description: 'Check out available books',
    roles: [UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.MEMBER],
  },
  {
    label: 'Return Books',
    description: 'Return borrowed books',
    roles: [UserRole.ADMIN, UserRole.LIBRARIAN, UserRole.MEMBER],
  },
  {
    label: 'Add Books',
    description: 'Add new books to the catalog',
    roles: [UserRole.ADMIN, UserRole.LIBRARIAN],
  },
  {
    label: 'Delete Books',
    description: 'Remove books from the system',
    roles: [UserRole.ADMIN],
  },
  {
    label: 'View Analytics',
    description: 'Access system analytics and reports',
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Export Data',
    description: 'Export books and borrow records',
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Manage Users',
    description: 'View and manage user accounts',
    roles: [UserRole.ADMIN],
  },
];

interface PermissionsCardProps {
  userRole: UserRole;
  className?: string;
}

export function PermissionsCard({ userRole, className }: PermissionsCardProps) {
  return (
    <div className={cn('rounded-xl border border-border bg-card shadow-card overflow-hidden', className)}>
      <div className="border-b border-border bg-muted/40 px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Your Permissions</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          What you can do with your current role
        </p>
      </div>
      <div className="p-5">
        <div className="space-y-3">
          {permissions.map((permission) => {
            const hasPermission = permission.roles.includes(userRole);
            return (
              <div
                key={permission.label}
                className={cn(
                  'flex items-start gap-3 rounded-lg border p-3 transition-colors',
                  hasPermission
                    ? 'border-success/20 bg-success/5'
                    : 'border-border bg-muted/30 opacity-60'
                )}
              >
                <div
                  className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                    hasPermission ? 'bg-success/20 text-success' : 'bg-muted text-muted-foreground'
                  )}
                >
                  {hasPermission ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      'text-sm font-medium leading-tight',
                      hasPermission ? 'text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {permission.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {permission.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
