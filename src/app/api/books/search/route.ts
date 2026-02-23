import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const searchTerm = query.trim();

    const where = {
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          author: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          genre: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: 'insensitive' as const,
          },
        },
      ],
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          { title: 'asc' },
          { author: 'asc' },
        ],
      }),
      prisma.book.count({ where }),
    ]);

    const rankedResults = books.map((book) => {
      let relevanceScore = 0;
      const lowerQuery = searchTerm.toLowerCase();
      const lowerTitle = book.title.toLowerCase();
      const lowerAuthor = book.author.toLowerCase();
      const lowerGenre = book.genre.toLowerCase();
      const lowerDescription = book.description?.toLowerCase() || '';

      if (lowerTitle === lowerQuery) {
        relevanceScore += 100;
      } else if (lowerTitle.startsWith(lowerQuery)) {
        relevanceScore += 50;
      } else if (lowerTitle.includes(lowerQuery)) {
        relevanceScore += 25;
      }

      if (lowerAuthor === lowerQuery) {
        relevanceScore += 80;
      } else if (lowerAuthor.startsWith(lowerQuery)) {
        relevanceScore += 40;
      } else if (lowerAuthor.includes(lowerQuery)) {
        relevanceScore += 20;
      }

      if (lowerGenre === lowerQuery) {
        relevanceScore += 60;
      } else if (lowerGenre.includes(lowerQuery)) {
        relevanceScore += 15;
      }

      if (lowerDescription.includes(lowerQuery)) {
        relevanceScore += 10;
      }

      return {
        ...book,
        relevanceScore,
      };
    });

    rankedResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return NextResponse.json({
      data: rankedResults,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        query: searchTerm,
      },
    });
  } catch (err) {
    console.error('Error searching books:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
