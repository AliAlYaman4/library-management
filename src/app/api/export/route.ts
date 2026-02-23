import { NextRequest, NextResponse } from 'next/server';
import { requireApiLibrarian } from '@/lib/api-auth';
import { prisma } from '@/lib/prisma';
import {
  exportBooksToCSV,
  exportBorrowRecordsToCSV,
  exportUsersToCSV,
  exportActivityLogsToCSV,
} from '@/lib/csv-export';

export async function GET(req: NextRequest) {
  const { error, user } = await requireApiLibrarian(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    if (!type) {
      return NextResponse.json(
        { error: 'Export type is required' },
        { status: 400 }
      );
    }

    let csv: string;
    let filename: string;

    switch (type) {
      case 'books':
        const books = await prisma.book.findMany({
          orderBy: { createdAt: 'desc' },
        });
        csv = exportBooksToCSV(books);
        filename = `books_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'borrows':
        const borrows = await prisma.borrowRecord.findMany({
          orderBy: { borrowedAt: 'desc' },
        });
        csv = exportBorrowRecordsToCSV(borrows);
        filename = `borrow_records_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'users':
        if (user!.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }
        const users = await prisma.user.findMany({
          orderBy: { createdAt: 'desc' },
        });
        csv = exportUsersToCSV(users);
        filename = `users_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'activity':
        if (user!.role !== 'ADMIN') {
          return NextResponse.json(
            { error: 'Admin access required' },
            { status: 403 }
          );
        }
        const logs = await prisma.activityLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 1000,
        });
        csv = exportActivityLogsToCSV(logs);
        filename = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid export type' },
          { status: 400 }
        );
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('Error exporting data:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
