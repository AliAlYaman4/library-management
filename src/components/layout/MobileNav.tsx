'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  BookOpen,
  LayoutDashboard,
  BarChart3,
  Shield,
  Library,
  Menu,
  X,
  User,
  History,
} from 'lucide-react';

interface MobileNavProps {
  user?: {
    role?: string;
    name?: string | null;
  } | null;
}

export function MobileNav({ user }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isAdmin = user?.role === 'ADMIN';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Books', href: '/books', icon: BookOpen },
    { label: 'History', href: '/history', icon: History },
    { label: 'Profile', href: '/profile', icon: User },
    ...(isAdmin
      ? [
          { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
          { label: 'Admin Panel', href: '/admin', icon: Shield },
        ]
      : []),
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden animate-fade-in"
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 z-50 w-72 border-r border-sidebar-border bg-sidebar shadow-xl lg:hidden animate-slide-in-right">
            {/* Header */}
            <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
                  <Library className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-semibold tracking-tight">LibraryOS</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Nav */}
            <nav className="space-y-0.5 px-2 py-3">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/dashboard' && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      'relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-0.5 rounded-r-full bg-primary" />
                    )}
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* User footer */}
            {user && (
              <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3">
                <div className="flex items-center gap-3 rounded-lg px-2 py-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                    {user.name
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2) ?? '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-foreground">{user.name}</p>
                    <p className="truncate text-[10px] text-muted-foreground capitalize">
                      {user.role?.toLowerCase()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
