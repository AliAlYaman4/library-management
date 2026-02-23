import { NextRequest, NextResponse } from 'next/server';
import { requireApiLibrarian } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import { createBookSchema } from '@/lib/validators/book.validator';
import { generateBookAI } from '@/lib/ai/book-ai';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  const { error, user } = await requireApiLibrarian(req);
  if (error) return error;

  try {
    const body = await req.json();
    const validatedData = createBookSchema.parse(body);

    const availableCopies = validatedData.availableCopies ?? validatedData.totalCopies;

    if (availableCopies > validatedData.totalCopies) {
      return NextResponse.json(
        { error: 'Available copies cannot exceed total copies' },
        { status: 400 }
      );
    }

    const aiData = await generateBookAI({
      title: validatedData.title,
      author: validatedData.author,
      description: validatedData.description,
      genre: validatedData.genre,
      publishedYear: validatedData.publishedYear,
    });

    const book = await prisma.book.create({
      data: {
        ...validatedData,
        availableCopies,
        aiSummary: aiData.aiSummary,
        recommendedGenres: aiData.recommendedGenres,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: err.errors },
        { status: 400 }
      );
    }

    console.error('Error creating book:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    const where: any = {};

    if (genre) {
      where.genre = genre;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.book.count({ where }),
    ]);

    return NextResponse.json({
      data: books,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching books:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
