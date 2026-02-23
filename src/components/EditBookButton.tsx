'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EditBookModal } from './EditBookModal';
import { Pencil } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';

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

interface EditBookButtonProps {
  book: Book;
}

export function EditBookButton({ book }: EditBookButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { canManageBooks } = useUserRole();

  if (!canManageBooks) {
    return null;
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="w-full gap-2"
      >
        <Pencil className="h-4 w-4" />
        Edit Book
      </Button>
      <EditBookModal isOpen={isOpen} onClose={() => setIsOpen(false)} book={book} />
    </>
  );
}
