'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';
import { BookOpen, LayoutDashboard, BarChart3, Shield, Library, User, History } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import { Badge } from '@/components/ui/badge';

export function Sidebar() {
  const { data: session } = useSession();
  const user = session?.user;

  const isAdmin = user?.role === UserRole.ADMIN;

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Books',
      href: '/books',
      icon: BookOpen,
    },
    {
      label: 'History',
      href: '/history',
      icon: History,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: User,
    },
    ...(isAdmin
      ? [
          {
            label: 'Analytics',
            href: '/admin/analytics',
            icon: BarChart3,
          },
          {
            label: 'Admin Panel',
            href: '/admin',
            icon: Shield,
          },
        ]
      : []),
  ];

  const roleBadgeVariant =
    user?.role === UserRole.ADMIN
      ? 'admin'
      : user?.role === UserRole.LIBRARIAN
      ? 'librarian'
      : 'member';

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary shadow-xs">
          <Library className="h-4 w-4 text-primary-foreground" />
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-semibold tracking-tight text-foreground hover:text-primary transition-colors"
        >
          LibraryOS
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-3 px-2">
        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/70">
          Navigation
        </p>
        <SidebarNav items={navItems} />
      </div>

      {/* User section */}
      {user && (
        <div className="border-t border-sidebar-border p-3">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/50 transition-colors"
            title="View profile and permissions"
          >
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary select-none">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-foreground leading-tight">
                {user.name}
              </p>
              <p className="truncate text-[10px] text-muted-foreground leading-tight mt-0.5">
                {user.email}
              </p>
            </div>
            <Badge variant={roleBadgeVariant as any} className="shrink-0">
              {user.role}
            </Badge>
          </Link>
        </div>
      )}
    </aside>
  );
}
