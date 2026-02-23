import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { AIRecommendations } from '@/components/AIRecommendations';
import { AIInsights } from '@/components/AIInsights';
import { AIFeaturesTour } from '@/components/AIFeaturesTour';
import {
  BookOpen,
  BookCopy,
  BookMarked,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';

export default async function DashboardPage() {
  const user = await requireAuth();

  const [totalBooks, availableBooks, activeBorrows] = await Promise.all([
    prisma.book.count(),
    prisma.book.aggregate({ _sum: { availableCopies: true } }),
    prisma.borrowRecord.count({
      where: { userId: user.id, returnedAt: null },
    }),
  ]);

  const recentBorrows = await prisma.borrowRecord.findMany({
    where: { userId: user.id },
    take: 5,
    orderBy: { borrowedAt: 'desc' },
    include: { book: true },
  });

  const firstName = user.name?.split(' ')[0] ?? 'there';

  return (
    <div className="max-w-7xl mx-auto space-y-7 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Dashboard
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Good to see you, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s an overview of your library activity.
          </p>
        </div>
        <Link
          href="/books"
          className={[
            'hidden sm:inline-flex items-center gap-1.5 rounded-lg',
            'bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground shadow-xs',
            'hover:bg-primary/90 hover:-translate-y-px hover:shadow-glow-primary',
            'will-change-transform transition-[transform,box-shadow,background-color] duration-150 ease-smooth',
            'active:scale-[0.97] active:translate-y-0',
          ].join(' ')}
        >
          Browse Books
          <ArrowRight className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={<BookOpen className="h-4 w-4" />}
          className="stagger-1"
        />
        <StatCard
          title="Available Copies"
          value={availableBooks._sum.availableCopies ?? 0}
          icon={<BookCopy className="h-4 w-4" />}
          iconClassName="bg-success/10 text-success"
          valueClassName="text-success"
          className="stagger-2"
        />
        <StatCard
          title="Your Borrows"
          value={activeBorrows}
          icon={<BookMarked className="h-4 w-4" />}
          iconClassName={activeBorrows > 0 ? 'bg-primary/10 text-primary' : undefined}
          valueClassName={activeBorrows > 0 ? 'text-primary' : undefined}
          description={activeBorrows > 0 ? 'currently active' : 'no active borrows'}
          className="stagger-3"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left column - Recent Activity */}
        <div className="lg:col-span-2">
          {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          </div>
          <Link
            href="/books"
            className="group inline-flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors duration-100"
          >
            All books
            <ArrowRight className="h-3 w-3 transition-transform duration-150 ease-smooth group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Activity list */}
        {recentBorrows.length === 0 ? (
          <EmptyState
            title="No borrowing history yet"
            description="Start exploring the collection and borrow your first book."
            action={
              <Link
                href="/books"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Browse Books
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {recentBorrows.map((record, i) => (
              <div
                key={record.id}
                className={[
                  'group flex items-center justify-between px-5 py-3.5',
                  'hover:bg-accent/50 transition-colors duration-100',
                  'cursor-default',
                ].join(' ')}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/books/${record.book.id}`}
                    className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-100 truncate block leading-tight"
                  >
                    {record.book.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    by {record.book.author}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4 shrink-0">
                  <Badge variant={record.returnedAt ? 'success' : 'default'}>
                    {record.returnedAt ? 'Returned' : 'Active'}
                  </Badge>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {new Date(record.borrowedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
        </div>

        {/* Right column - AI Recommendations */}
        <div className="lg:col-span-1 space-y-5">
          <AIInsights />
          <AIRecommendations />
        </div>
      </div>

      {/* AI Features Tour */}
      <AIFeaturesTour />
    </div>
  );
}
