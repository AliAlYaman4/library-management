import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/api-auth';
import { getSystemAnalytics, getBorrowingTrends, getPenaltyReport } from '@/lib/analytics';

export async function GET(req: NextRequest) {
  const { error } = await requireApiAdmin(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') || 'overview';
    const days = parseInt(searchParams.get('days') || '30');

    switch (type) {
      case 'overview':
        const analytics = await getSystemAnalytics();
        return NextResponse.json(analytics);

      case 'trends':
        const trends = await getBorrowingTrends(days);
        return NextResponse.json({ trends });

      case 'penalties':
        const penalties = await getPenaltyReport();
        return NextResponse.json(penalties);

      default:
        return NextResponse.json(
          { error: 'Invalid analytics type' },
          { status: 400 }
        );
    }
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
