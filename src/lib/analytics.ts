import { prisma } from './prisma';

export async function getSystemAnalytics() {
  const [
    totalBooks,
    totalUsers,
    totalBorrows,
    activeBorrows,
    overdueCount,
    totalPenalties,
    popularBooks,
    activeUsers,
    genreDistribution,
  ] = await Promise.all([
    // Total books
    prisma.book.count(),
    
    // Total users
    prisma.user.count(),
    
    // Total borrows
    prisma.borrowRecord.count(),
    
    // Active borrows
    prisma.borrowRecord.count({
      where: { returnedAt: null },
    }),
    
    // Overdue books
    prisma.borrowRecord.count({
      where: {
        returnedAt: null,
        dueDate: { lt: new Date() },
      },
    }),
    
    // Total penalties collected
    prisma.borrowRecord.aggregate({
      _sum: { penalty: true },
    }),
    
    // Most popular books
    prisma.book.findMany({
      take: 10,
      orderBy: { borrowCount: 'desc' },
      select: {
        id: true,
        title: true,
        author: true,
        borrowCount: true,
        viewCount: true,
      },
    }),
    
    // Most active users
    prisma.user.findMany({
      take: 10,
      orderBy: { borrowRecords: { _count: 'desc' } },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        _count: {
          select: { borrowRecords: true },
        },
      },
    }),
    
    // Genre distribution
    prisma.book.groupBy({
      by: ['genre'],
      _count: { genre: true },
      orderBy: { _count: { genre: 'desc' } },
    }),
  ]);

  return {
    overview: {
      totalBooks,
      totalUsers,
      totalBorrows,
      activeBorrows,
      overdueCount,
      totalPenalties: totalPenalties._sum.penalty || 0,
    },
    popularBooks,
    activeUsers,
    genreDistribution: genreDistribution.map((g) => ({
      genre: g.genre,
      count: g._count.genre,
    })),
  };
}

export async function getBorrowingTrends(days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const borrows = await prisma.borrowRecord.groupBy({
    by: ['borrowedAt'],
    where: {
      borrowedAt: { gte: startDate },
    },
    _count: { id: true },
  });

  return borrows.map((b) => ({
    date: b.borrowedAt.toISOString().split('T')[0],
    count: b._count.id,
  }));
}

export async function getPenaltyReport() {
  const [totalPenalties, unpaidPenalties, topDelinquents] = await Promise.all([
    prisma.borrowRecord.aggregate({
      _sum: { penalty: true },
      _count: { penalty: true },
    }),
    
    prisma.user.aggregate({
      _sum: { totalPenalty: true },
      where: { totalPenalty: { gt: 0 } },
    }),
    
    prisma.user.findMany({
      where: { totalPenalty: { gt: 0 } },
      orderBy: { totalPenalty: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        totalPenalty: true,
        role: true,
      },
    }),
  ]);

  return {
    totalCollected: totalPenalties._sum.penalty || 0,
    totalRecords: totalPenalties._count.penalty,
    unpaidTotal: unpaidPenalties._sum.totalPenalty || 0,
    topDelinquents,
  };
}

export async function getBookPopularity(bookId: string) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      borrowRecords: {
        select: {
          borrowedAt: true,
          returnedAt: true,
          user: {
            select: { name: true, email: true },
          },
        },
        orderBy: { borrowedAt: 'desc' },
        take: 20,
      },
    },
  });

  if (!book) return null;

  return {
    bookId: book.id,
    title: book.title,
    author: book.author,
    viewCount: book.viewCount,
    borrowCount: book.borrowCount,
    currentlyBorrowed: book.totalCopies - book.availableCopies,
    recentBorrows: book.borrowRecords,
  };
}
