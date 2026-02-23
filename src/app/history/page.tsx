import { requireAuth } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { Badge } from '@/components/ui/badge';
import { StatCard } from '@/components/ui/stat-card';
import Link from 'next/link';
import { 
  History, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Calendar,
  TrendingUp,
  Download,
} from 'lucide-react';

export default async function HistoryPage() {
  const user = await requireAuth();

  // Get user's complete borrowing history
  const [allBorrows, stats] = await Promise.all([
    prisma.borrowRecord.findMany({
      where: { userId: user.id },
      include: { book: true },
      orderBy: { borrowedAt: 'desc' },
    }),
    prisma.borrowRecord.aggregate({
      where: { userId: user.id },
      _count: { id: true },
      _sum: { penalty: true },
    }),
  ]);

  // Calculate statistics
  const totalBorrows = stats._count.id;
  const activeBorrows = allBorrows.filter(b => !b.returnedAt).length;
  const completedBorrows = allBorrows.filter(b => b.returnedAt).length;
  const overdueBorrows = allBorrows.filter(
    b => !b.returnedAt && new Date(b.dueDate) < new Date()
  ).length;
  const totalPenalties = stats._sum.penalty || 0;

  // Get genre preferences
  const genreCount = new Map<string, number>();
  allBorrows.forEach(borrow => {
    const genre = borrow.book.genre;
    genreCount.set(genre, (genreCount.get(genre) || 0) + 1);
  });
  const topGenres = Array.from(genreCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Get favorite authors
  const authorCount = new Map<string, number>();
  allBorrows.forEach(borrow => {
    const author = borrow.book.author;
    authorCount.set(author, (authorCount.get(author) || 0) + 1);
  });
  const topAuthors = Array.from(authorCount.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-7 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Reading History
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Your Library Journey
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Track your reading habits and borrowing history
          </p>
        </div>
        <Link
          href="/api/export/history"
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-accent hover:border-primary/25 transition-all"
        >
          <Download className="h-3.5 w-3.5" />
          Export History
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCard
          title="Total Borrows"
          value={totalBorrows}
          icon={<BookOpen className="h-4 w-4" />}
        />
        <StatCard
          title="Active"
          value={activeBorrows}
          icon={<Clock className="h-4 w-4" />}
          iconClassName="bg-primary/10 text-primary"
          valueClassName={activeBorrows > 0 ? 'text-primary' : undefined}
        />
        <StatCard
          title="Completed"
          value={completedBorrows}
          icon={<CheckCircle2 className="h-4 w-4" />}
          iconClassName="bg-success/10 text-success"
          valueClassName="text-success"
        />
        <StatCard
          title="Overdue"
          value={overdueBorrows}
          icon={<AlertTriangle className="h-4 w-4" />}
          iconClassName="bg-destructive/10 text-destructive"
          valueClassName={overdueBorrows > 0 ? 'text-destructive' : undefined}
        />
        <StatCard
          title="Penalties"
          value={`$${totalPenalties.toFixed(2)}`}
          icon={<TrendingUp className="h-4 w-4" />}
          iconClassName="bg-warning/10 text-warning"
        />
      </div>

      {/* Reading Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Top Genres */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Favorite Genres</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your most borrowed genres
            </p>
          </div>
          <div className="p-5 space-y-3">
            {topGenres.length > 0 ? (
              topGenres.map(([genre, count], index) => (
                <div key={genre} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground">{genre}</span>
                  </div>
                  <Badge variant="secondary">{count} books</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No borrowing history yet
              </p>
            )}
          </div>
        </div>

        {/* Top Authors */}
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-sm font-semibold text-foreground">Favorite Authors</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Your most borrowed authors
            </p>
          </div>
          <div className="p-5 space-y-3">
            {topAuthors.length > 0 ? (
              topAuthors.map(([author, count], index) => (
                <div key={author} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-xs font-bold text-success">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">{author}</span>
                  </div>
                  <Badge variant="secondary">{count} books</Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No borrowing history yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Borrowing History */}
      <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Complete History</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            All your borrowing records
          </p>
        </div>
        <div className="divide-y divide-border">
          {allBorrows.length > 0 ? (
            allBorrows.map((record) => {
              const isOverdue = !record.returnedAt && new Date(record.dueDate) < new Date();
              const daysOverdue = isOverdue
                ? Math.floor((Date.now() - new Date(record.dueDate).getTime()) / (1000 * 60 * 60 * 24))
                : 0;

              return (
                <div
                  key={record.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/books/${record.book.id}`}
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors truncate block"
                    >
                      {record.book.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      by {record.book.author} • {record.book.genre}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        Borrowed: {new Date(record.borrowedAt).toLocaleDateString()}
                      </div>
                      {record.returnedAt && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          • Returned: {new Date(record.returnedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isOverdue && (
                      <Badge variant="destructive" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {daysOverdue}d overdue
                      </Badge>
                    )}
                    {record.returnedAt ? (
                      <Badge variant="success">Returned</Badge>
                    ) : (
                      <Badge variant="default">Active</Badge>
                    )}
                    {record.penalty > 0 && (
                      <Badge variant="warning">${record.penalty.toFixed(2)}</Badge>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">No borrowing history</p>
              <p className="text-xs text-muted-foreground mt-1">
                Start borrowing books to build your reading history
              </p>
              <Link
                href="/books"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors mt-4"
              >
                Browse Books
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
