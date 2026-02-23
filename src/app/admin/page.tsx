import { requireAdmin } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Activity, 
  TrendingUp, 
  BarChart3,
  Download,
  Shield,
  AlertTriangle,
} from 'lucide-react';

export default async function AdminPage() {
  await requireAdmin();

  // Get overview statistics
  const [totalUsers, totalBooks, totalBorrows, recentBorrows, recentActivity] = await Promise.all([
    prisma.user.count(),
    prisma.book.count(),
    prisma.borrowRecord.count(),
    prisma.borrowRecord.count({
      where: {
        borrowedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    }),
    prisma.borrowRecord.findMany({
      take: 10,
      orderBy: { borrowedAt: 'desc' },
      include: {
        user: { select: { name: true, email: true, role: true } },
        book: { select: { title: true, author: true } },
      },
    }),
  ]);

  // Calculate active users from recent borrows
  const activeUsers = await prisma.user.count({
    where: {
      id: {
        in: (await prisma.borrowRecord.findMany({
          where: {
            borrowedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            },
          },
          select: { userId: true },
          distinct: ['userId'],
        })).map(b => b.userId),
      },
    },
  });

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Admin Panel
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            System Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage users, books, and system settings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/analytics"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 hover:-translate-y-px hover:shadow-glow-primary transition-[transform,box-shadow,background-color] duration-150 ease-smooth active:scale-[0.97] active:translate-y-0"
          >
            <BarChart3 className="h-3.5 w-3.5" />
            View Analytics
          </Link>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={<Users className="h-4 w-4" />}
          iconClassName="bg-violet-500/10 text-violet-500"
        />
        <StatCard
          title="Total Books"
          value={totalBooks}
          icon={<BookOpen className="h-4 w-4" />}
          iconClassName="bg-primary/10 text-primary"
        />
        <StatCard
          title="Total Borrows"
          value={totalBorrows}
          icon={<Activity className="h-4 w-4" />}
          iconClassName="bg-sky-500/10 text-sky-500"
        />
        <StatCard
          title="Active Users"
          value={activeUsers}
          description="last 30 days"
          icon={<TrendingUp className="h-4 w-4" />}
          iconClassName="bg-success/10 text-success"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/books"
          className="group rounded-xl border border-border bg-card p-5 shadow-card hover:border-primary/25 hover:shadow-card-hover transition-[border-color,box-shadow] duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Manage Books</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Add, edit, or remove books from the catalog
          </p>
        </Link>

        <Link
          href="/admin/analytics"
          className="group rounded-xl border border-border bg-card p-5 shadow-card hover:border-primary/25 hover:shadow-card-hover transition-[border-color,box-shadow] duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
              <BarChart3 className="h-4 w-4 text-success" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Analytics</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            View detailed reports and statistics
          </p>
        </Link>

        <Link
          href="/api/export?type=books"
          className="group rounded-xl border border-border bg-card p-5 shadow-card hover:border-primary/25 hover:shadow-card-hover transition-[border-color,box-shadow] duration-200"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-500/10">
              <Download className="h-4 w-4 text-sky-500" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">Export Data</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Download books and borrow records
          </p>
        </Link>
      </div>

      {/* Recent activity */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Latest borrowing transactions
          </p>
        </div>
        <div className="divide-y divide-border">
          {recentActivity.length === 0 ? (
            <div className="p-8 text-center">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No recent activity</p>
            </div>
          ) : (
            recentActivity.map((record) => (
              <div
                key={record.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">
                    {record.book.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    by {record.book.author} • Borrowed by {record.user.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-4">
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
