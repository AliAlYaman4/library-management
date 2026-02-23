import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { calculateDaysLate, calculatePenalty } from '@/lib/penalties';
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

      const activeBorrow = await tx.borrowRecord.findFirst({
        where: {
          userId: user!.id,
          bookId: params.bookId,
          returnedAt: null,
        },
      });

      if (!activeBorrow) {
        throw new Error('NO_ACTIVE_BORROW');
      }

      const returnDate = new Date();
      const daysLate = calculateDaysLate(activeBorrow.dueDate, returnDate);
      const penalty = calculatePenalty(daysLate);

      const [returnedRecord, updatedBook, updatedUser] = await Promise.all([
        tx.borrowRecord.update({
          where: { id: activeBorrow.id },
          data: {
            returnedAt: returnDate,
            daysLate,
            penalty,
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
              increment: 1,
            },
          },
        }),
        tx.user.update({
          where: { id: user!.id },
          data: {
            totalPenalty: {
              increment: penalty,
            },
          },
        }),
      ]);

      return returnedRecord;
    });

    await logActivity({
      userId: user!.id,
      action: 'BOOK_RETURNED',
      entityType: 'Book',
      entityId: params.bookId,
      details: `Returned book. Days late: ${result.daysLate}, Penalty: $${result.penalty}`,
    });

    if (result.penalty > 0) {
      await logActivity({
        userId: user!.id,
        action: 'PENALTY_APPLIED',
        entityType: 'BorrowRecord',
        entityId: result.id,
        details: `Late return penalty: $${result.penalty} (${result.daysLate} days late)`,
      });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    if (err.message === 'BOOK_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (err.message === 'NO_ACTIVE_BORROW') {
      return NextResponse.json(
        { error: 'You have not borrowed this book or it has already been returned' },
        { status: 400 }
      );
    }

    console.error('Error returning book:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
