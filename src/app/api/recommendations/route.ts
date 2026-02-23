import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/api-auth';
import {
  getBasicRecommendations,
  getAIEnhancedRecommendations,
} from '@/lib/recommendations/book-recommendations';

export async function GET(req: NextRequest) {
  const { error, user } = await requireApiAuth(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    const useAI = searchParams.get('ai') === 'true';

    if (limit < 1 || limit > 20) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 20' },
        { status: 400 }
      );
    }

    const recommendations = useAI
      ? await getAIEnhancedRecommendations(user!.id, limit)
      : await getBasicRecommendations(user!.id, limit);

    return NextResponse.json({
      recommendations,
      count: recommendations.length,
      method: useAI ? 'ai-enhanced' : 'basic',
    });
  } catch (err) {
    console.error('Error fetching recommendations:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
