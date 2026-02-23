'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Loader2, BookUp, Undo2, AlertCircle } from 'lucide-react';

export function BorrowReturnButton({
  bookId,
  hasBorrowed,
}: {
  bookId: string;
  hasBorrowed: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAction = async () => {
    setLoading(true);
    setError('');

    try {
      const endpoint = hasBorrowed ? `/api/return/${bookId}` : `/api/borrow/${bookId}`;
      const response = await fetch(endpoint, { method: 'POST' });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Action failed');
      }

      toast.success(hasBorrowed ? 'Book returned successfully' : 'Book borrowed successfully');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 animate-fade-in">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}
      <Button
        onClick={handleAction}
        disabled={loading}
        variant={hasBorrowed ? 'secondary' : 'default'}
        className="w-full gap-2"
        size="lg"
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : hasBorrowed ? (
          <Undo2 className="h-4 w-4" />
        ) : (
          <BookUp className="h-4 w-4" />
        )}
        {loading ? 'Processing…' : hasBorrowed ? 'Return Book' : 'Borrow Book'}
      </Button>
    </div>
  );
}
