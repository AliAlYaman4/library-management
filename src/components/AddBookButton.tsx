'use client';

import { useState } from 'react';
import { AddBookModal } from './AddBookModal';
import { useUserRole } from '@/hooks/useUserRole';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AddBookButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { canManageBooks } = useUserRole();

  if (!canManageBooks) {
    return null;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} size="sm" className="gap-1.5">
        <Plus className="h-3.5 w-3.5" />
        Add Book
      </Button>
      <AddBookModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
