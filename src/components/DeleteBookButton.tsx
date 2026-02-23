'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

export function DeleteBookButton({ bookId }: { bookId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const { canDeleteBooks } = useUserRole();

  if (!canDeleteBooks) {
    return null;
  }

  const handleDelete = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/books/${bookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete book');
      }

      toast.success('Book deleted successfully');
      router.push('/books');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 animate-fade-in">
          <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      {showConfirm ? (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-start gap-2 rounded-lg bg-destructive/10 p-3">
            <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <p className="text-sm text-destructive">
              Are you sure? This action cannot be undone.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleDelete}
              disabled={loading}
              variant="destructive"
              className="flex-1 gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {loading ? 'Deleting…' : 'Confirm'}
            </Button>
            <Button
              onClick={() => setShowConfirm(false)}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setShowConfirm(true)}
          variant="destructive"
          className="w-full gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Delete Book
        </Button>
      )}
    </div>
  );
}
