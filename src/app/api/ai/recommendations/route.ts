import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getPersonalizedRecommendations } from '@/lib/ai-recommendations';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    const recommendations = await getPersonalizedRecommendations(session.user.id, limit);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
}
