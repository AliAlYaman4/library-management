'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X, SlidersHorizontal } from 'lucide-react';

const GENRES = [
  'Fiction',
  'Science Fiction',
  'Fantasy',
  'Mystery',
  'Romance',
  'History',
  'Science',
  'Psychology',
  'Self-Help',
  'Biography',
];

const SORT_OPTIONS = [
  { value: 'title-asc', label: 'Title (A-Z)' },
  { value: 'title-desc', label: 'Title (Z-A)' },
  { value: 'author-asc', label: 'Author (A-Z)' },
  { value: 'author-desc', label: 'Author (Z-A)' },
  { value: 'year-desc', label: 'Newest First' },
  { value: 'year-asc', label: 'Oldest First' },
  { value: 'popular', label: 'Most Popular' },
];

export function AdvancedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  
  const currentGenre = searchParams.get('genre') || '';
  const currentSort = searchParams.get('sort') || '';
  const currentAvailable = searchParams.get('available') || '';
  const currentSearch = searchParams.get('search') || '';

  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete('page'); // Reset to page 1 when filtering
    
    router.push(`/books?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    if (currentSearch) {
      params.set('search', currentSearch);
    }
    router.push(`/books?${params.toString()}`);
  };

  const activeFiltersCount = [currentGenre, currentSort, currentAvailable].filter(Boolean).length;

  return (
    <div className="space-y-3">
      {/* Filter toggle button */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1 h-4 px-1.5 text-[10px]">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="gap-1.5 text-xs"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-5 shadow-card animate-slide-down space-y-4">
          {/* Sort */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Sort By
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => applyFilter('sort', option.value === currentSort ? '' : option.value)}
                  className={`
                    rounded-lg border px-3 py-2 text-xs font-medium transition-all
                    ${
                      currentSort === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border bg-background text-foreground hover:bg-accent'
                    }
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Genre
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => applyFilter('genre', genre === currentGenre ? '' : genre)}
                  className={`
                    rounded-full border px-3 py-1.5 text-xs font-medium transition-all
                    ${
                      currentGenre === genre
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-background text-foreground hover:bg-accent'
                    }
                  `}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-semibold text-foreground mb-2">
              Availability
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => applyFilter('available', currentAvailable === 'true' ? '' : 'true')}
                className={`
                  rounded-lg border px-4 py-2 text-xs font-medium transition-all
                  ${
                    currentAvailable === 'true'
                      ? 'border-success bg-success/10 text-success'
                      : 'border-border bg-background text-foreground hover:bg-accent'
                  }
                `}
              >
                Available Only
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {currentGenre && (
            <Badge variant="outline" className="gap-1.5">
              Genre: {currentGenre}
              <button
                onClick={() => applyFilter('genre', '')}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentSort && (
            <Badge variant="outline" className="gap-1.5">
              Sort: {SORT_OPTIONS.find(o => o.value === currentSort)?.label}
              <button
                onClick={() => applyFilter('sort', '')}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {currentAvailable === 'true' && (
            <Badge variant="outline" className="gap-1.5">
              Available Only
              <button
                onClick={() => applyFilter('available', '')}
                className="hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
