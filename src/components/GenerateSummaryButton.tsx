'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useUserRole } from '@/hooks/useUserRole';

interface GenerateSummaryButtonProps {
  bookId: string;
  hasDescription: boolean;
}

export function GenerateSummaryButton({ bookId, hasDescription }: GenerateSummaryButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { canManageBooks } = useUserRole();

  if (!canManageBooks || hasDescription) {
    return null;
  }

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/books/${bookId}/generate-summary`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      toast.success('AI summary generated and saved!');
      router.refresh();
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleGenerate}
      disabled={loading}
      variant="outline"
      size="sm"
      className="gap-2 border-primary/20 hover:bg-primary/5"
    >
      {loading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-3.5 w-3.5" />
          Generate AI Summary
        </>
      )}
    </Button>
  );
}
