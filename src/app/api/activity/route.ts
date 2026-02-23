import { NextRequest, NextResponse } from 'next/server';
import { requireApiAdmin } from '@/lib/api-auth';
import { getRecentActivity, getUserActivity, getActivityByType } from '@/lib/activity-logger';
import { ActivityType } from '@prisma/client';

export async function GET(req: NextRequest) {
  const { error } = await requireApiAdmin(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const action = searchParams.get('action') as ActivityType | null;
    const limit = parseInt(searchParams.get('limit') || '50');

    let activities;

    if (userId) {
      activities = await getUserActivity(userId, limit);
    } else if (action) {
      activities = await getActivityByType(action, limit);
    } else {
      activities = await getRecentActivity(limit);
    }

    return NextResponse.json({ activities, count: activities.length });
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
