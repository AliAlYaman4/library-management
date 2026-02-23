import { NextRequest, NextResponse } from 'next/server';
import { requireApiAuth } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { error, user } = await requireApiAuth(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    const where: any = {
      userId: user!.id,
    };

    if (status === 'active') {
      where.returnedAt = null;
    } else if (status === 'returned') {
      where.returnedAt = { not: null };
    }

    const [borrowRecords, total] = await Promise.all([
      prisma.borrowRecord.findMany({
        where,
        skip,
        take: limit,
        orderBy: { borrowedAt: 'desc' },
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              genre: true,
            },
          },
        },
      }),
      prisma.borrowRecord.count({ where }),
    ]);

    return NextResponse.json({
      data: borrowRecords,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Error fetching borrow history:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
