import { NextRequest, NextResponse } from 'next/server';
import { findSimilarBooks } from '@/lib/ai-insights';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    const similarBooks = await findSimilarBooks(params.id, limit);

    return NextResponse.json({ books: similarBooks });
  } catch (error) {
    console.error('Error finding similar books:', error);
    return NextResponse.json(
      { error: 'Failed to find similar books' },
      { status: 500 }
    );
  }
}
