'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-0.5">
      {items.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              // Base layout
              'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium',
              // Specific transition props for performance
              'transition-[background-color,color] duration-150 ease-smooth',
              isActive
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {/* Active left indicator — slides in */}
            <span
              className={cn(
                'absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full bg-primary',
                'transition-[height,opacity] duration-200 ease-spring',
                isActive ? 'h-4 w-0.5 opacity-100' : 'h-0 w-0.5 opacity-0'
              )}
            />

            {/* Icon: nudges right on hover when inactive, stays put when active */}
            <item.icon
              className={cn(
                'h-4 w-4 shrink-0',
                'transition-[transform,color] duration-150 ease-smooth',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground/60 group-hover:translate-x-0.5 group-hover:text-foreground'
              )}
            />

            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
