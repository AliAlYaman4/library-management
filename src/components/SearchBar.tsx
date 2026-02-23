'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

export function SearchBar({ initialQuery = '' }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/books?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/books');
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/books');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground/60 transition-colors duration-150" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author, or genre…"
          className={[
            'w-full h-9 pl-9 pr-9 rounded-lg text-sm',
            'border border-input bg-card text-foreground placeholder:text-muted-foreground/50',
            // Focus: ring + glow (glow applied via globals.css, ring via Tailwind)
            'focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-transparent',
            // Subtle shadow at rest, sharper on focus
            'shadow-xs focus:shadow-ring-focus',
            // Smooth all focus changes
            'transition-[border-color,box-shadow] duration-200 ease-smooth',
          ].join(' ')}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={[
              'absolute right-2.5 top-1/2 -translate-y-1/2',
              'flex h-5 w-5 items-center justify-center rounded-md',
              'text-muted-foreground hover:text-foreground',
              'hover:bg-accent transition-[background-color,color] duration-100',
            ].join(' ')}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
