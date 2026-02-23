'use client';

import { useSession } from 'next-auth/react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MobileNav } from './MobileNav';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export function TopNav() {
  const { data: session } = useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-card/80 backdrop-blur-md px-4 lg:px-6">
      <MobileNav user={user} />

      <div className="flex-1" />

      <div className="flex items-center gap-1.5">
        <ThemeToggle />

        {user ? (
          <div className="flex items-center gap-2 pl-3 ml-1 border-l border-border">
            {/* Profile link with avatar and name */}
            <Link
              href="/profile"
              className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-accent transition-colors duration-150"
              title="View profile"
            >
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 select-none items-center justify-center rounded-full',
                  'bg-primary/15 text-[11px] font-bold text-primary',
                  'transition-transform duration-200 ease-spring group-hover:scale-110',
                )}
              >
                {initials}
              </div>

              {/* First name — hidden on xs */}
              <span className="hidden text-sm font-medium text-foreground sm:block">
                {firstName}
              </span>
            </Link>

            {/* Sign out */}
            <Link
              href="/auth/signout"
              className={cn(
                'flex h-7 w-7 items-center justify-center rounded-md',
                'text-muted-foreground hover:text-foreground hover:bg-accent',
                'transition-[background-color,color,transform] duration-150 ease-smooth',
                'hover:scale-105 active:scale-95',
              )}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <Link
            href="/api/auth/signin"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors duration-100"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
