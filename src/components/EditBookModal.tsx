'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { X, Loader2, BookPlus } from 'lucide-react';

const inputClass = [
  'w-full h-9 px-3 rounded-lg text-sm',
  'border border-input bg-background text-foreground placeholder:text-muted-foreground/50',
  'focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-transparent',
  'shadow-xs focus:shadow-ring-focus',
  'transition-[border-color,box-shadow] duration-200 ease-smooth',
].join(' ');

const labelClass = 'block text-xs font-medium text-foreground mb-1.5';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  genre: string;
  publishedYear: number;
  totalCopies: number;
  availableCopies: number;
}

interface EditBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
}

export function EditBookModal({ isOpen, onClose, book }: EditBookModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    description: book.description || '',
    genre: book.genre,
    publishedYear: book.publishedYear,
    totalCopies: book.totalCopies,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: book.title,
        author: book.author,
        description: book.description || '',
        genre: book.genre,
        publishedYear: book.publishedYear,
        totalCopies: book.totalCopies,
      });
      setError('');
    }
  }, [isOpen, book]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update book');
      }

      toast.success('Book updated successfully!');
      router.refresh();
      onClose();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-card shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
              <BookPlus className="h-3.5 w-3.5 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground">Edit Book</h2>
          </div>
          <button
            onClick={onClose}
            className={[
              'flex h-7 w-7 items-center justify-center rounded-md',
              'text-muted-foreground hover:text-foreground hover:bg-accent',
              'transition-[background-color,color] duration-100',
            ].join(' ')}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {error && (
            <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 text-xs text-destructive animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className={labelClass}>
                  Title <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={inputClass}
                  placeholder="Book title"
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>
                  Author <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className={inputClass}
                  placeholder="Author name"
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>
                  Genre <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.genre}
                  onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                  className={inputClass}
                  placeholder="e.g. Fiction, Science, History"
                />
              </div>
              <div className="col-span-2">
                <label className={labelClass}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className={[
                    'w-full px-3 py-2 rounded-lg text-sm resize-none',
                    'border border-input bg-background text-foreground placeholder:text-muted-foreground/50',
                    'focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-transparent',
                    'shadow-xs focus:shadow-ring-focus',
                    'transition-[border-color,box-shadow] duration-200 ease-smooth',
                  ].join(' ')}
                  placeholder="Brief description (optional)"
                />
              </div>
              <div>
                <label className={labelClass}>
                  Year <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1000"
                  max={new Date().getFullYear() + 1}
                  value={formData.publishedYear}
                  onChange={(e) =>
                    setFormData({ ...formData, publishedYear: parseInt(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Copies <span className="text-destructive">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.totalCopies}
                  onChange={(e) =>
                    setFormData({ ...formData, totalCopies: parseInt(e.target.value) })
                  }
                  className={inputClass}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading}>
                {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                {loading ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
