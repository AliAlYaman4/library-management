'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AIFeatureExplainer } from '@/components/AIFeatureExplainer';
import { Sparkles, Loader2, BookOpen } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  availableCopies: number;
}

interface SimilarBooksProps {
  bookId: string;
}

export function SimilarBooks({ bookId }: SimilarBooksProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSimilarBooks() {
      try {
        const res = await fetch(`/api/ai/similar-books/${bookId}?limit=4`);
        if (res.ok) {
          const data = await res.json();
          setBooks(data.books || []);
        }
      } catch (error) {
        console.error('Error fetching similar books:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchSimilarBooks();
  }, [bookId]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-card p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Finding similar books...</span>
        </div>
      </div>
    );
  }

  if (books.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
      <div className="border-b border-border px-5 py-4 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Similar Books</h3>
          <AIFeatureExplainer feature="similar" />
        </div>
        <p className="text-xs text-muted-foreground mt-0.5">
          AI-powered recommendations based on this book
        </p>
      </div>
      <div className="divide-y divide-border">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="flex items-start gap-3 px-5 py-4 hover:bg-muted/30 transition-colors group"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                {book.title}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                by {book.author}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <Badge variant="secondary" className="text-[10px]">
                  {book.genre}
                </Badge>
                {book.availableCopies > 0 && (
                  <Badge variant="success" className="text-[10px]">
                    Available
                  </Badge>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
