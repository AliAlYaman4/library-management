'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { AIFeatureExplainer } from '@/components/AIFeatureExplainer';
import { Sparkles, TrendingUp, Calendar, BookMarked, Loader2 } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  availableCopies: number;
}

interface Suggestions {
  trending: Book[];
  newArrivals: Book[];
  similarToLast: Book[];
}

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestions | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAIData() {
      try {
        const [recRes, sugRes] = await Promise.all([
          fetch('/api/ai/recommendations?limit=5'),
          fetch('/api/ai/suggestions'),
        ]);

        if (recRes.ok) {
          const recData = await recRes.json();
          setRecommendations(recData.recommendations || []);
        }

        if (sugRes.ok) {
          const sugData = await sugRes.json();
          setSuggestions(sugData);
        }
      } catch (error) {
        console.error('Error fetching AI data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAIData();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border border-border bg-card shadow-card p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="ml-2 text-sm text-muted-foreground">Loading AI recommendations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-card overflow-hidden">
          <div className="border-b border-border bg-primary/5 px-5 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">AI Recommendations For You</h3>
              <AIFeatureExplainer feature="recommendations" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Based on your reading history
            </p>
          </div>
          <div className="p-5 space-y-3">
            {recommendations.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="group flex items-start gap-3 rounded-lg border border-border bg-card p-3 hover:border-primary/25 hover:bg-accent transition-all"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {book.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    by {book.author}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
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
      )}

      {/* Trending Books */}
      {suggestions?.trending && suggestions.trending.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <h3 className="text-sm font-semibold text-foreground">Trending Now</h3>
              <AIFeatureExplainer feature="trending" />
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Most borrowed this month
            </p>
          </div>
          <div className="divide-y divide-border">
            {suggestions.trending.slice(0, 3).map((book, index) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/10 text-xs font-bold text-success">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground truncate">by {book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* New Arrivals */}
      {suggestions?.newArrivals && suggestions.newArrivals.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sky-500" />
              <h3 className="text-sm font-semibold text-foreground">New Arrivals</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recently added to the collection
            </p>
          </div>
          <div className="divide-y divide-border">
            {suggestions.newArrivals.slice(0, 3).map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground truncate">by {book.author}</p>
                </div>
                <Badge variant="secondary" className="shrink-0 ml-2">New</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Similar to Last Read */}
      {suggestions?.similarToLast && suggestions.similarToLast.length > 0 && (
        <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <BookMarked className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">More Like Your Last Read</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Similar books you might enjoy
            </p>
          </div>
          <div className="divide-y divide-border">
            {suggestions.similarToLast.slice(0, 3).map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground truncate">by {book.author}</p>
                </div>
                <Badge variant="outline" className="shrink-0 ml-2">{book.genre}</Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
