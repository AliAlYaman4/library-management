import { NextRequest, NextResponse } from 'next/server';
import { requireApiLibrarian, requireApiAdmin } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { updateBookSchema } from '@/lib/validators/book.validator';
import { z } from 'zod';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!book) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (err) {
    console.error('Error fetching book:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireApiLibrarian(req);
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = updateBookSchema.parse(body);

    const existingBook = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    const totalCopies = validatedData.totalCopies ?? existingBook.totalCopies;
    const availableCopies = validatedData.availableCopies ?? existingBook.availableCopies;

    if (availableCopies > totalCopies) {
      return NextResponse.json(
        { error: 'Available copies cannot exceed total copies' },
        { status: 400 }
      );
    }

    if (validatedData.totalCopies !== undefined) {
      const difference = validatedData.totalCopies - existingBook.totalCopies;
      validatedData.availableCopies = existingBook.availableCopies + difference;

      if (validatedData.availableCopies < 0) {
        validatedData.availableCopies = 0;
      }
    }

    const book = await prisma.book.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(book);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }

    console.error('Error updating book:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error, user } = await requireApiAdmin(req);
  if (error) return error;

  try {
    const existingBook = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        borrowRecords: {
          where: { returnedAt: null },
        },
      },
    });

    if (!existingBook) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    if (existingBook.borrowRecords.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete book with active borrows' },
        { status: 400 }
      );
    }

    await prisma.book.delete({
      where: { id: params.id },
    });

    return NextResponse.json(
      { message: 'Book deleted successfully' },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error deleting book:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
