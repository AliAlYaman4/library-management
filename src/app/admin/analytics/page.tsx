import { requireAdmin } from '@/lib/auth-utils';
import { getSystemAnalytics, getPenaltyReport } from '@/lib/analytics';
import Link from 'next/link';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  BookMarked,
  Clock,
  AlertTriangle,
  DollarSign,
  Download,
  TrendingUp,
} from 'lucide-react';

export default async function AnalyticsPage() {
  await requireAdmin();

  const [analytics, penalties] = await Promise.all([
    getSystemAnalytics(),
    getPenaltyReport(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Analytics
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            System Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Library-wide statistics and reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/api/export?type=books"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 hover:-translate-y-px hover:shadow-glow-primary transition-[transform,box-shadow,background-color] duration-150 ease-smooth active:scale-[0.97] active:translate-y-0"
          >
            <Download className="h-3.5 w-3.5" />
            Export Books
          </Link>
          <Link
            href="/api/export?type=borrows"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-accent hover:border-primary/25 transition-[background-color,border-color] duration-150 ease-smooth"
          >
            <Download className="h-3.5 w-3.5" />
            Export Borrows
          </Link>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
        <StatCard
          title="Total Books"
          value={analytics.overview.totalBooks}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          title="Total Users"
          value={analytics.overview.totalUsers}
          icon={<Users className="h-4 w-4" />}
          iconClassName="bg-violet-500/10 text-violet-500"
        />
        <StatCard
          title="Total Borrows"
          value={analytics.overview.totalBorrows}
          icon={<BookMarked className="h-4 w-4" />}
          iconClassName="bg-sky-500/10 text-sky-500"
        />
        <StatCard
          title="Active Borrows"
          value={analytics.overview.activeBorrows}
          icon={<Clock className="h-4 w-4" />}
          iconClassName="bg-primary/10 text-primary"
          valueClassName="text-primary"
        />
        <StatCard
          title="Overdue Books"
          value={analytics.overview.overdueCount}
          icon={<AlertTriangle className="h-4 w-4" />}
          iconClassName="bg-destructive/10 text-destructive"
          valueClassName={analytics.overview.overdueCount > 0 ? 'text-destructive' : undefined}
        />
        <StatCard
          title="Total Penalties"
          value={`$${analytics.overview.totalPenalties.toFixed(2)}`}
          icon={<DollarSign className="h-4 w-4" />}
          iconClassName="bg-success/10 text-success"
          valueClassName="text-success"
        />
      </div>

      {/* Popular Books table */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Most Popular Books</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Ranked by borrow count</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Title
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Author
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Borrows
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Views
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {analytics.popularBooks.map((book: any, i: number) => (
                <tr
                  key={book.id}
                  className="hover:bg-muted/30 transition-[background-color] duration-100"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-medium text-muted-foreground tabular-nums w-4 shrink-0">
                        {i + 1}
                      </span>
                      <Link
                        href={`/books/${book.id}`}
                        className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {book.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {book.author}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm font-semibold text-foreground tabular-nums">
                      {book.borrowCount}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-sm text-muted-foreground tabular-nums">
                      {book.viewCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Genre Distribution */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Genre Distribution</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Books by genre across the library
          </p>
        </div>
        <div className="p-5 space-y-3.5">
          {analytics.genreDistribution.map((genre: any) => {
            const pct = analytics.overview.totalBooks > 0
              ? (genre.count / analytics.overview.totalBooks) * 100
              : 0;
            return (
              <div key={genre.genre}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{genre.genre}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {genre.count} book{genre.count !== 1 ? 's' : ''}
                    </span>
                    <span className="text-xs font-medium text-muted-foreground tabular-nums w-8 text-right">
                      {pct.toFixed(0)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-700"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Penalty Report */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Penalty Report</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Overdue fines and collections</p>
        </div>
        <div className="p-5 space-y-5">
          {/* Summary stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-success/20 bg-success/8 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Total Collected</p>
              <p className="text-xl font-bold text-success tabular-nums">
                ${penalties.totalCollected.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-destructive/20 bg-destructive/8 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Unpaid Penalties</p>
              <p className="text-xl font-bold text-destructive tabular-nums">
                ${penalties.unpaidTotal.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Total Records</p>
              <p className="text-xl font-bold text-foreground tabular-nums">
                {penalties.totalRecords}
              </p>
            </div>
          </div>

          {/* Top delinquents */}
          {penalties.topDelinquents.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Top Delinquents
              </p>
              <div className="divide-y divide-border rounded-lg border border-border overflow-hidden">
                {penalties.topDelinquents.map((u: any) => (
                  <div
                    key={u.id}
                    className="flex items-center justify-between px-4 py-3 bg-card hover:bg-muted/30 transition-[background-color] duration-100"
                  >
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                    <Badge variant="destructive" className="font-semibold tabular-nums">
                      ${u.totalPenalty.toFixed(2)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
