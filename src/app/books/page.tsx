import { getCurrentUser } from '@/lib/auth-utils';
import { prisma } from '@/lib/prisma';
import { SearchBar } from '@/components/SearchBar';
import { AddBookButton } from '@/components/AddBookButton';
import { AdvancedFilters } from '@/components/AdvancedFilters';
import { EmptyState } from '@/components/ui/empty-state';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { UserRole, Prisma } from '@prisma/client';
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default async function BooksPage({
  searchParams,
}: {
  searchParams: { 
    search?: string; 
    page?: string;
    genre?: string;
    sort?: string;
    available?: string;
  };
}) {
  const user = await getCurrentUser();
  const searchQuery = searchParams.search || '';
  const genreFilter = searchParams.genre || '';
  const sortOption = searchParams.sort || '';
  const availableOnly = searchParams.available === 'true';
  const page = parseInt(searchParams.page || '1');
  const limit = 12;
  const skip = (page - 1) * limit;

  let books;
  let total;

  // Build where clause with filters
  const where: Prisma.BookWhereInput = {};
  
  if (genreFilter) {
    where.genre = genreFilter;
  }
  
  if (availableOnly) {
    where.availableCopies = { gt: 0 };
  }

  // Build orderBy clause
  let orderBy: Prisma.BookOrderByWithRelationInput = { createdAt: 'desc' };
  
  if (sortOption) {
    switch (sortOption) {
      case 'title-asc':
        orderBy = { title: 'asc' };
        break;
      case 'title-desc':
        orderBy = { title: 'desc' };
        break;
      case 'author-asc':
        orderBy = { author: 'asc' };
        break;
      case 'author-desc':
        orderBy = { author: 'desc' };
        break;
      case 'year-desc':
        orderBy = { publishedYear: 'desc' };
        break;
      case 'year-asc':
        orderBy = { publishedYear: 'asc' };
        break;
      case 'popular':
        orderBy = { viewCount: 'desc' };
        break;
    }
  }

  if (searchQuery) {
    // Add search to where clause
    where.OR = [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { author: { contains: searchQuery, mode: 'insensitive' } },
      { genre: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  [books, total] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: limit,
      orderBy,
    }),
    prisma.book.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const canAddBook =
    user && (user.role === UserRole.ADMIN || user.role === UserRole.LIBRARIAN);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Books</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total} book{total !== 1 ? 's' : ''} in the collection
          </p>
        </div>
        {canAddBook && <AddBookButton />}
      </div>

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <SearchBar initialQuery={searchQuery} />
          {searchQuery && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground whitespace-nowrap">
              <Search className="h-3 w-3" />
              <span>
                {total} result{total !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
              </span>
            </div>
          )}
        </div>
        <AdvancedFilters />
      </div>

      {/* Empty state */}
      {books.length === 0 ? (
        <div className="rounded-xl border border-border bg-card shadow-card">
          <EmptyState
            icon={<BookOpen className="h-7 w-7 text-muted-foreground" />}
            title={searchQuery ? 'No books match your search' : 'No books yet'}
            description={
              searchQuery
                ? 'Try different keywords or browse all books.'
                : 'The library is empty. Add the first book to get started.'
            }
            action={
              searchQuery ? (
                <Link
                  href="/books"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Clear Search
                </Link>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          {/* Book grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {books.map((book: any, i: number) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className={cn(
                  'group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden',
                  // Lift + border highlight + shadow — smooth with expo-out
                  'hover:-translate-y-1 hover:border-primary/25 hover:shadow-card-hover',
                  'will-change-transform transition-[transform,border-color,box-shadow] duration-200 ease-smooth',
                )}
                style={{ animationDelay: `${i * 25}ms` }}
              >
                {/* Top status strip — expands slightly on hover */}
                <div
                  className={cn(
                    'w-full shrink-0 transition-[height] duration-200 ease-smooth',
                    book.availableCopies > 0
                      ? 'h-0.5 group-hover:h-1 bg-success'
                      : 'h-0.5 group-hover:h-0.5 bg-muted/60'
                  )}
                />

                <div className="p-4 flex flex-col flex-1">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-150 line-clamp-1 leading-snug">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        by {book.author}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <Badge
                        variant={book.availableCopies > 0 ? 'success' : 'destructive'}
                      >
                        {book.availableCopies > 0
                          ? `${book.availableCopies} avail.`
                          : 'Out'}
                      </Badge>
                      {/* Arrow reveal — slides in from bottom-left */}
                      <ArrowUpRight
                        className={cn(
                          'h-3 w-3 text-primary/70',
                          'opacity-0 translate-y-0.5 -translate-x-0.5',
                          'group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0',
                          'transition-[opacity,transform] duration-200 ease-spring',
                        )}
                      />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <Badge variant="secondary">{book.genre}</Badge>
                    <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {book.publishedYear}
                    </span>
                  </div>

                  {/* Description */}
                  {book.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mt-auto pt-1">
                      {book.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              {page > 1 ? (
                <Link
                  href={`/books?${searchQuery ? `search=${searchQuery}&` : ''}page=${page - 1}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:border-primary/20 shadow-xs transition-[background-color,border-color] duration-150"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-muted-foreground cursor-not-allowed select-none">
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </span>
              )}

              <span className="px-3 py-1.5 text-sm text-muted-foreground tabular-nums">
                {page} / {totalPages}
              </span>

              {page < totalPages ? (
                <Link
                  href={`/books?${searchQuery ? `search=${searchQuery}&` : ''}page=${page + 1}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent hover:border-primary/20 shadow-xs transition-[background-color,border-color] duration-150"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-muted-foreground cursor-not-allowed select-none">
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
