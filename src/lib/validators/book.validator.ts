import { z } from 'zod';

export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  author: z.string().min(1, 'Author is required').max(255, 'Author too long'),
  description: z.string().optional(),
  genre: z.string().min(1, 'Genre is required').max(100, 'Genre too long'),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear() + 1),
  totalCopies: z.number().int().min(1, 'Must have at least 1 copy').default(1),
  availableCopies: z.number().int().min(0).optional(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  author: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  genre: z.string().min(1).max(100).optional(),
  publishedYear: z.number().int().min(1000).max(new Date().getFullYear() + 1).optional(),
  totalCopies: z.number().int().min(1).optional(),
  availableCopies: z.number().int().min(0).optional(),
});

export type CreateBookDto = z.infer<typeof createBookSchema>;
export type UpdateBookDto = z.infer<typeof updateBookSchema>;
