import { NextRequest, NextResponse } from 'next/server';
import { smartSearch } from '@/lib/ai-recommendations';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({ results: [] });
    }

    const results = await smartSearch(query, limit);

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error in smart search:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
