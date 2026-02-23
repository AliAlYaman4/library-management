'use client';

import { useState } from 'react';
import { Info, X, Sparkles } from 'lucide-react';

interface AIFeatureExplainerProps {
  feature: 'recommendations' | 'insights' | 'similar' | 'trending' | 'search' | 'summary' | 'reading-time';
}

const FEATURE_INFO = {
  recommendations: {
    title: 'AI Personalized Recommendations',
    how: 'Analyzes your borrowing history to find books you\'ll love',
    when: 'Updates every time you borrow or return a book',
    algorithm: 'Tracks your favorite genres and authors, scores books by similarity, filters for availability',
  },
  insights: {
    title: 'AI Reading Insights',
    how: 'Detects patterns in your reading habits',
    when: 'Updates daily based on your borrowing activity',
    algorithm: 'Tracks streaks, milestones, genre exploration, reading speed, and favorite authors',
  },
  similar: {
    title: 'AI Similar Books',
    how: 'Finds books similar to the one you\'re viewing',
    when: 'Calculated instantly for each book',
    algorithm: 'Matches by author (+10 pts), genre (+5 pts), publication year (+2 pts), and popularity',
  },
  trending: {
    title: 'Trending Books',
    how: 'Shows most borrowed books in the last 30 days',
    when: 'Updates in real-time as users borrow books',
    algorithm: 'Counts borrows, ranks by frequency, shows top 3',
  },
  search: {
    title: 'Smart Search',
    how: 'Intelligent search with typo tolerance',
    when: 'Searches as you type',
    algorithm: 'Fuzzy matching, relevance scoring, multi-field search (title, author, genre, description)',
  },
  summary: {
    title: 'AI-Generated Summary',
    how: 'Creates book descriptions when missing',
    when: 'Generated instantly for books without descriptions',
    algorithm: 'Uses genre-specific templates, considers author and publication year',
  },
  'reading-time': {
    title: 'Reading Time Estimator',
    how: 'Estimates how long to read a book',
    when: 'Calculated for every book',
    algorithm: 'Based on genre reading speeds (Romance: 60 pgs/hr, Science: 30 pgs/hr) and estimated page count',
  },
};

export function AIFeatureExplainer({ feature }: AIFeatureExplainerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const info = FEATURE_INFO[feature];

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        title="How this AI feature works"
      >
        <Info className="h-2.5 w-2.5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover */}
          <div className="absolute left-0 top-6 z-50 w-80 rounded-lg border border-border bg-card shadow-lg animate-scale-in">
            <div className="flex items-start justify-between border-b border-border bg-gradient-to-r from-primary/5 to-transparent px-4 py-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">{info.title}</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  How it works
                </p>
                <p className="text-sm text-foreground">{info.how}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  When it updates
                </p>
                <p className="text-sm text-foreground">{info.when}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Algorithm
                </p>
                <p className="text-sm text-foreground">{info.algorithm}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
