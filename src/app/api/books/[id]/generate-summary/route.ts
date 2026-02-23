import { NextRequest, NextResponse } from 'next/server';
import { requireApiLibrarian } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { generateAIBookSummary } from '@/lib/ai-insights';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireApiLibrarian(req);
  if (error) return error;

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

    if (book.description) {
      return NextResponse.json(
        { error: 'Book already has a description' },
        { status: 400 }
      );
    }

    // Generate AI summary
    const aiSummary = generateAIBookSummary(book);

    // Save to database
    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: { description: aiSummary },
    });

    return NextResponse.json({
      message: 'AI summary generated successfully',
      description: aiSummary,
      book: updatedBook,
    });
  } catch (err) {
    console.error('Error generating summary:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
