'use client';

import { useState, useEffect, useRef } from 'react';
import { Info, X, Sparkles, Zap, Clock, Code } from 'lucide-react';

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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const info = FEATURE_INFO[feature];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  const closePopover = () => setIsOpen(false);

  return (
    <div className="relative inline-block">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="group inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 hover:scale-110 transition-all duration-200 shrink-0"
        aria-label="How this AI feature works"
        aria-expanded={isOpen}
      >
        <Info className="h-3 w-3 group-hover:rotate-12 transition-transform" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={closePopover}
            aria-hidden="true"
          />

          <div 
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ai-feature-title"
            className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] sm:w-96 rounded-2xl border border-border/50 bg-card shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-violet-500/5 pointer-events-none" />
            
            <div className="relative flex flex-col max-h-[80vh] sm:max-h-[500px]">
              <div className="flex items-start gap-3 p-4 border-b border-border/50 shrink-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 shrink-0 ring-1 ring-primary/20">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 id="ai-feature-title" className="text-sm font-semibold text-foreground leading-snug">
                    {info.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">AI-powered feature</p>
                </div>

                <button
                  onClick={closePopover}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-200 shrink-0"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 shrink-0">
                      <Zap className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <h5 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      How it works
                    </h5>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.how}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10 shrink-0">
                      <Clock className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h5 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      When it updates
                    </h5>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.when}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-500/10 shrink-0">
                      <Code className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <h5 className="text-xs font-semibold text-foreground uppercase tracking-wide">
                      Algorithm
                    </h5>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {info.algorithm}
                  </p>
                </div>
              </div>

              <div className="border-t border-border/50 bg-muted/30 px-4 py-2.5 shrink-0">
                <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Updates automatically</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
