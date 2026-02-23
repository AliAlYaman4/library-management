import { getCurrentUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { BorrowReturnButton } from '@/components/BorrowReturnButton';
import { DeleteBookButton } from '@/components/DeleteBookButton';
import { EditBookButton } from '@/components/EditBookButton';
import { GenerateSummaryButton } from '@/components/GenerateSummaryButton';
import { SimilarBooks } from '@/components/SimilarBooks';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { UserRole } from '@prisma/client';
import { estimateReadingTime, generateAIBookSummary } from '@/lib/ai-insights';
import {
  ArrowLeft,
  Calendar,
  BookOpen,
  CheckCircle2,
  XCircle,
  Info,
  Shield,
  Copy,
  Clock,
  Sparkles,
} from 'lucide-react';

export default async function BookDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();

  const book = await prisma.book.findUnique({
    where: { id: params.id },
  });

  if (!book) {
    notFound();
  }

  let hasBorrowed = false;
  if (user) {
    const activeBorrow = await prisma.borrowRecord.findFirst({
      where: { userId: user.id, bookId: params.id, returnedAt: null },
    });
    hasBorrowed = !!activeBorrow;
  }

  const isAvailable = book.availableCopies > 0;
  
  // Generate AI summary if description is missing
  const aiGeneratedSummary = !book.description ? generateAIBookSummary(book) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        Back to Books
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-card overflow-hidden">
          {/* Top color strip */}
          <div className={`h-1 w-full ${isAvailable ? 'bg-success' : 'bg-muted'}`} />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Title section */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant={isAvailable ? 'success' : 'destructive'}>
                  {isAvailable ? 'Available' : 'Unavailable'}
                </Badge>
                {hasBorrowed && (
                  <Badge variant="default">You borrowed this</Badge>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {book.title}
              </h1>
              <p className="text-base text-muted-foreground mt-1.5">
                by{' '}
                <span className="font-medium text-foreground">{book.author}</span>
              </p>
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5">
                <BookOpen className="h-3 w-3" />
                {book.genre}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Calendar className="h-3 w-3" />
                {book.publishedYear}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Clock className="h-3 w-3" />
                {estimateReadingTime(book)}
              </Badge>
            </div>

            {/* Description */}
            {book.description ? (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  About this book
                </p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {book.description}
                </p>
              </div>
            ) : aiGeneratedSummary ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                    About this book
                  </p>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Sparkles className="h-2.5 w-2.5" />
                    AI Generated
                  </Badge>
                </div>
                <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4">
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {aiGeneratedSummary}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Availability stats */}
            <div className="border-t border-border pt-5">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Availability
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/30 p-4 transition-[border-color] duration-150 hover:border-border/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">Total Copies</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground tabular-nums">
                    {book.totalCopies}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-muted/30 p-4 transition-[border-color] duration-150 hover:border-border/80">
                  <div className="flex items-center gap-2 mb-1.5">
                    {isAvailable ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-destructive" />
                    )}
                    <p className="text-xs font-medium text-muted-foreground">Available Now</p>
                  </div>
                  <p
                    className={`text-2xl font-bold tabular-nums ${
                      isAvailable ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {book.availableCopies}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar actions */}
        <div className="space-y-4">
          {/* Action card */}
          <div className="rounded-xl border border-border bg-card shadow-card p-5 space-y-4">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Actions
            </p>

            {user ? (
              <>
                <EditBookButton book={book} />
                <GenerateSummaryButton bookId={book.id} hasDescription={!!book.description} />
                
                {book.availableCopies > 0 || hasBorrowed ? (
                  <BorrowReturnButton bookId={book.id} hasBorrowed={hasBorrowed} />
                ) : (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/8 p-4 text-center">
                    <XCircle className="h-7 w-7 text-destructive mx-auto mb-2" />
                    <p className="text-sm font-semibold text-destructive">
                      Currently Unavailable
                    </p>
                    <p className="text-xs text-destructive/70 mt-0.5">
                      All copies are checked out
                    </p>
                  </div>
                )}

                {hasBorrowed && (
                  <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/8 p-3">
                    <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary">
                      You currently have this book checked out
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3 text-center">
                <p className="text-sm text-muted-foreground">
                  Sign in to borrow this book
                </p>
                <Link
                  href="/api/auth/signin"
                  className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 hover:-translate-y-px hover:shadow-glow-primary transition-[transform,box-shadow,background-color] duration-150 ease-smooth active:scale-[0.97] active:translate-y-0"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Admin actions card */}
          {user?.role === UserRole.ADMIN && (
            <div className="rounded-xl border border-destructive/20 bg-card shadow-card p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Admin Actions
                </p>
              </div>
              <DeleteBookButton bookId={book.id} />
            </div>
          )}

          {/* Similar Books - AI Powered */}
          <SimilarBooks bookId={book.id} />
        </div>
      </div>
    </div>
  );
}
