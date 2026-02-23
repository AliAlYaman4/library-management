import { requireAuth } from '@/lib/auth-utils';
import { RoleBadge } from '@/components/RoleBadge';
import { PermissionsCard } from '@/components/PermissionsCard';
import { Badge } from '@/components/ui/badge';
import { UserRole } from '@prisma/client';
import { User, Mail, Calendar, Shield, Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export default async function ProfilePage() {
  const sessionUser = await requireAuth();

  // Get full user data from database
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
  });

  if (!user) {
    throw new Error('User not found');
  }

  // Get user's borrowing stats
  const [totalBorrows, activeBorrows, overdueCount] = await Promise.all([
    prisma.borrowRecord.count({
      where: { userId: user.id },
    }),
    prisma.borrowRecord.count({
      where: { userId: user.id, returnedAt: null },
    }),
    prisma.borrowRecord.count({
      where: {
        userId: user.id,
        returnedAt: null,
        dueDate: { lt: new Date() },
      },
    }),
  ]);

  const initials = user.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <User className="h-4 w-4 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Profile
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Account Information
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          View your profile details and permissions
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Profile card */}
        <div className="lg:col-span-2 space-y-5">
          {/* User info card */}
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="border-b border-border bg-gradient-to-r from-primary/10 to-transparent px-6 py-8">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-xl font-bold text-primary ring-2 ring-primary/30 shadow-lg">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
                  <div className="mt-3">
                    <RoleBadge role={user.role} showIcon size="lg" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground mt-0.5 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Role</p>
                    <p className="text-sm text-foreground mt-0.5 capitalize">
                      {user.role.toLowerCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Member Since</p>
                    <p className="text-sm text-foreground mt-0.5">
                      {new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-muted-foreground">Account Status</p>
                    <Badge variant="success" className="mt-1">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity stats */}
          <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-sm font-semibold text-foreground">Borrowing Activity</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your library usage statistics
              </p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {totalBorrows}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Total Borrows</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary tabular-nums">
                    {activeBorrows}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Active</p>
                </div>
                <div className="text-center">
                  <p
                    className={`text-2xl font-bold tabular-nums ${
                      overdueCount > 0 ? 'text-destructive' : 'text-success'
                    }`}
                  >
                    {overdueCount}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Overdue</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Permissions sidebar */}
        <div className="lg:col-span-1">
          <PermissionsCard userRole={user.role} />
        </div>
      </div>

      {/* Role comparison table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Role Comparison</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Compare permissions across different user roles
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Permission
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <RoleBadge role={UserRole.MEMBER} size="sm" />
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <RoleBadge role={UserRole.LIBRARIAN} size="sm" />
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  <RoleBadge role={UserRole.ADMIN} size="sm" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { label: 'Browse Books', member: true, librarian: true, admin: true },
                { label: 'Borrow Books', member: true, librarian: true, admin: true },
                { label: 'Return Books', member: true, librarian: true, admin: true },
                { label: 'Add Books', member: false, librarian: true, admin: true },
                { label: 'Delete Books', member: false, librarian: false, admin: true },
                { label: 'View Analytics', member: false, librarian: false, admin: true },
                { label: 'Export Data', member: false, librarian: false, admin: true },
                { label: 'Manage Users', member: false, librarian: false, admin: true },
              ].map((perm) => (
                <tr key={perm.label} className="hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-medium text-foreground">
                    {perm.label}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {perm.member ? (
                      <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                        <Shield className="h-3 w-3 text-success" />
                      </div>
                    ) : (
                      <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                        <span className="text-xs text-muted-foreground">—</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {perm.librarian ? (
                      <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                        <Shield className="h-3 w-3 text-success" />
                      </div>
                    ) : (
                      <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                        <span className="text-xs text-muted-foreground">—</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {perm.admin ? (
                      <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                        <Shield className="h-3 w-3 text-success" />
                      </div>
                    ) : (
                      <div className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-muted">
                        <span className="text-xs text-muted-foreground">—</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
