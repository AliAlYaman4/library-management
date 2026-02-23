import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { calculateDueDate } from '@/lib/penalties';
import { logActivity } from '@/lib/activity-logger';

export async function POST(
  req: NextRequest,
  { params }: { params: { bookId: string } }
) {
  const { error, user } = await requireApiAuth(req);
  if (error) return error;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({
        where: { id: params.bookId },
      });

      if (!book) {
        throw new Error('BOOK_NOT_FOUND');
      }

      if (book.availableCopies <= 0) {
        throw new Error('NO_COPIES_AVAILABLE');
      }

      const activeBorrow = await tx.borrowRecord.findFirst({
        where: {
          userId: user!.id,
          bookId: params.bookId,
          returnedAt: null,
        },
      });

      if (activeBorrow) {
        throw new Error('ALREADY_BORROWED');
      }

      const dueDate = calculateDueDate();

      const [borrowRecord, updatedBook] = await Promise.all([
        tx.borrowRecord.create({
          data: {
            userId: user!.id,
            bookId: params.bookId,
            dueDate,
          },
          include: {
            book: {
              select: {
                id: true,
                title: true,
                author: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        tx.book.update({
          where: { id: params.bookId },
          data: {
            availableCopies: {
              decrement: 1,
            },
            borrowCount: {
              increment: 1,
            },
          },
        }),
      ]);

      return borrowRecord;
    });

    await logActivity({
      userId: user!.id,
      action: 'BOOK_BORROWED',
      entityType: 'Book',
      entityId: params.bookId,
      details: `Borrowed book: ${result.book.title}`,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (err: any) {
    if (err.message === 'BOOK_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (err.message === 'NO_COPIES_AVAILABLE') {
      return NextResponse.json(
        { error: 'No copies available for borrowing' },
        { status: 400 }
      );
    }

    if (err.message === 'ALREADY_BORROWED') {
      return NextResponse.json(
        { error: 'You have already borrowed this book. Please return it first.' },
        { status: 400 }
      );
    }

    console.error('Error borrowing book:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
