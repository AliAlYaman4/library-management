import { prisma } from './prisma';

interface ReadingInsight {
  type: 'streak' | 'milestone' | 'genre-shift' | 'speed' | 'recommendation';
  title: string;
  description: string;
  icon: string;
  color: string;
}

/**
 * AI-powered reading insights generator
 */
export async function generateReadingInsights(userId: string): Promise<ReadingInsight[]> {
  const insights: ReadingInsight[] = [];

  // Get user's borrowing history
  const borrows = await prisma.borrowRecord.findMany({
    where: { userId },
    include: { book: true },
    orderBy: { borrowedAt: 'desc' },
  });

  if (borrows.length === 0) {
    return [{
      type: 'recommendation',
      title: 'Start Your Reading Journey',
      description: 'Borrow your first book to unlock personalized AI insights!',
      icon: 'BookOpen',
      color: 'primary',
    }];
  }

  // 1. Reading Streak Detection
  const streak = calculateReadingStreak(borrows);
  if (streak >= 3) {
    insights.push({
      type: 'streak',
      title: `🔥 ${streak}-Day Reading Streak!`,
      description: `You've been consistently reading for ${streak} days. Keep it up!`,
      icon: 'Flame',
      color: 'warning',
    });
  }

  // 2. Milestone Detection
  const totalBooks = borrows.length;
  const milestones = [5, 10, 25, 50, 100];
  const recentMilestone = milestones.find(m => totalBooks >= m && totalBooks < m + 3);
  if (recentMilestone) {
    insights.push({
      type: 'milestone',
      title: `🎉 ${recentMilestone} Books Milestone!`,
      description: `You've borrowed ${totalBooks} books. You're becoming a library expert!`,
      icon: 'Trophy',
      color: 'success',
    });
  }

  // 3. Genre Shift Detection
  const recentGenres = borrows.slice(0, 5).map(b => b.book.genre);
  const olderGenres = borrows.slice(5, 10).map(b => b.book.genre);
  const genreShift = detectGenreShift(recentGenres, olderGenres);
  if (genreShift) {
    insights.push({
      type: 'genre-shift',
      title: '📚 Exploring New Genres',
      description: `You're branching out into ${genreShift}. Expanding your horizons!`,
      icon: 'Compass',
      color: 'violet',
    });
  }

  // 4. Reading Speed Analysis
  const avgDaysToReturn = calculateAverageReadingTime(borrows);
  if (avgDaysToReturn > 0) {
    const speed = avgDaysToReturn < 7 ? 'fast' : avgDaysToReturn < 14 ? 'steady' : 'leisurely';
    insights.push({
      type: 'speed',
      title: `⚡ ${speed.charAt(0).toUpperCase() + speed.slice(1)} Reader`,
      description: `You typically finish books in ${Math.round(avgDaysToReturn)} days. ${
        speed === 'fast' ? 'Impressive pace!' : speed === 'steady' ? 'Great consistency!' : 'Taking your time to savor!'
      }`,
      icon: 'Zap',
      color: 'sky',
    });
  }

  // 5. Favorite Author Insight
  const authorCounts = new Map<string, number>();
  borrows.forEach(b => {
    authorCounts.set(b.book.author, (authorCounts.get(b.book.author) || 0) + 1);
  });
  const topAuthor = Array.from(authorCounts.entries())
    .sort((a, b) => b[1] - a[1])[0];
  if (topAuthor && topAuthor[1] >= 3) {
    insights.push({
      type: 'recommendation',
      title: `❤️ ${topAuthor[0]} Fan`,
      description: `You've borrowed ${topAuthor[1]} books by ${topAuthor[0]}. A true fan!`,
      icon: 'Heart',
      color: 'pink',
    });
  }

  return insights.slice(0, 4); // Return top 4 insights
}

/**
 * Calculate reading streak (consecutive days with active borrows)
 */
function calculateReadingStreak(borrows: any[]): number {
  if (borrows.length === 0) return 0;

  const today = new Date();
  let streak = 0;
  let currentDate = new Date(today);

  // Check each day going backwards
  for (let i = 0; i < 30; i++) {
    const hasActiveBook = borrows.some(borrow => {
      const borrowDate = new Date(borrow.borrowedAt);
      const returnDate = borrow.returnedAt ? new Date(borrow.returnedAt) : today;
      return borrowDate <= currentDate && currentDate <= returnDate;
    });

    if (hasActiveBook) {
      streak++;
    } else if (streak > 0) {
      break; // Streak broken
    }

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

/**
 * Detect if user is exploring new genres
 */
function detectGenreShift(recentGenres: string[], olderGenres: string[]): string | null {
  if (recentGenres.length === 0) return null;

  const recentSet = new Set(recentGenres);
  const olderSet = new Set(olderGenres);

  // Find genres in recent that weren't in older
  const newGenres = Array.from(recentSet).filter(g => !olderSet.has(g));

  return newGenres.length > 0 ? newGenres[0] : null;
}

/**
 * Calculate average days to return books
 */
function calculateAverageReadingTime(borrows: any[]): number {
  const returnedBooks = borrows.filter(b => b.returnedAt);
  if (returnedBooks.length === 0) return 0;

  const totalDays = returnedBooks.reduce((sum, borrow) => {
    const borrowed = new Date(borrow.borrowedAt);
    const returned = new Date(borrow.returnedAt);
    const days = Math.floor((returned.getTime() - borrowed.getTime()) / (1000 * 60 * 60 * 24));
    return sum + days;
  }, 0);

  return totalDays / returnedBooks.length;
}

/**
 * Estimate reading time for a book based on page count or genre
 */
export function estimateReadingTime(book: {
  genre: string;
  publishedYear: number;
}): string {
  // Average reading speeds by genre (pages per hour)
  const genreSpeed: Record<string, number> = {
    'Fiction': 50,
    'Science Fiction': 45,
    'Fantasy': 45,
    'Mystery': 55,
    'Romance': 60,
    'History': 35,
    'Science': 30,
    'Psychology': 35,
    'Self-Help': 40,
    'Biography': 40,
  };

  // Estimate page count based on genre and era
  const avgPages = book.publishedYear > 2000 ? 350 : 400;
  const speed = genreSpeed[book.genre] || 45;
  const hours = Math.round(avgPages / speed);

  if (hours < 5) return '3-5 hours';
  if (hours < 8) return '5-8 hours';
  if (hours < 12) return '8-12 hours';
  return '12+ hours';
}

/**
 * Generate AI-powered book summary if missing
 */
export function generateAIBookSummary(book: {
  title: string;
  author: string;
  genre: string;
  publishedYear: number;
}): string {
  const templates: Record<string, string[]> = {
    'Fiction': [
      `A compelling ${book.genre} novel by ${book.author} that explores the human condition through masterful storytelling and rich character development.`,
      `${book.author} weaves an unforgettable tale in this ${book.publishedYear} classic, blending emotional depth with narrative brilliance.`,
    ],
    'Science Fiction': [
      `A visionary exploration of future possibilities by ${book.author}, challenging our understanding of technology, society, and what it means to be human.`,
      `${book.author} crafts a thought-provoking journey into tomorrow, where science meets imagination in spectacular fashion.`,
    ],
    'Fantasy': [
      `An epic fantasy adventure by ${book.author} that transports readers to magical realms filled with wonder, danger, and unforgettable characters.`,
      `${book.author} creates a richly imagined world where magic and destiny intertwine in this captivating tale.`,
    ],
    'Mystery': [
      `A gripping mystery by ${book.author} that keeps readers guessing until the final page with clever twists and compelling detective work.`,
      `${book.author} delivers a masterclass in suspense, weaving clues and red herrings into an irresistible puzzle.`,
    ],
    'History': [
      `An illuminating historical account by ${book.author} that brings the past to life with meticulous research and engaging narrative.`,
      `${book.author} offers fresh perspectives on historical events, making the past accessible and relevant to modern readers.`,
    ],
    'Science': [
      `${book.author} makes complex scientific concepts accessible and fascinating, bridging the gap between expert knowledge and curious minds.`,
      `A brilliant exploration of scientific principles by ${book.author}, combining rigorous research with clear, engaging explanations.`,
    ],
    'Psychology': [
      `An insightful examination of the human mind by ${book.author}, offering practical wisdom backed by psychological research.`,
      `${book.author} delves into the complexities of human behavior, providing readers with valuable insights into how we think and act.`,
    ],
    'Self-Help': [
      `A transformative guide by ${book.author} offering practical strategies for personal growth and positive change.`,
      `${book.author} shares actionable advice and inspiring insights to help readers achieve their goals and live more fulfilling lives.`,
    ],
  };

  const genreTemplates = templates[book.genre] || [
    `An engaging work by ${book.author} that offers readers a unique perspective and thought-provoking insights.`,
  ];

  return genreTemplates[Math.floor(Math.random() * genreTemplates.length)];
}

/**
 * Find similar books using AI-powered matching
 */
export async function findSimilarBooks(bookId: string, limit: number = 5) {
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) return [];

  // Find books with same genre or author
  const similarBooks = await prisma.book.findMany({
    where: {
      AND: [
        { id: { not: bookId } },
        {
          OR: [
            { genre: book.genre },
            { author: book.author },
          ],
        },
        { availableCopies: { gt: 0 } },
      ],
    },
    take: limit * 2,
  });

  // Score and rank by similarity
  const scored = similarBooks.map(similar => {
    let score = 0;
    
    // Same author = high score
    if (similar.author === book.author) score += 10;
    
    // Same genre = medium score
    if (similar.genre === book.genre) score += 5;
    
    // Similar publication year = small bonus
    const yearDiff = Math.abs(similar.publishedYear - book.publishedYear);
    if (yearDiff < 5) score += 2;
    if (yearDiff < 10) score += 1;
    
    // Popularity bonus
    score += similar.viewCount * 0.1;
    
    return { book: similar, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(s => s.book);
}
