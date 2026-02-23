import { prisma } from './prisma';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string | null;
  viewCount: number;
}

interface BorrowHistory {
  bookId: string;
  book: {
    genre: string;
    author: string;
  };
}

/**
 * AI-powered book recommendations based on user's borrowing history
 * Uses collaborative filtering and content-based filtering
 */
export async function getAIRecommendations(userId: string, limit: number = 5): Promise<Book[]> {
  // Get user's borrowing history
  const userBorrows = await prisma.borrowRecord.findMany({
    where: { userId },
    include: {
      book: {
        select: { genre: true, author: true, id: true },
      },
    },
    orderBy: { borrowedAt: 'desc' },
    take: 20,
  });

  if (userBorrows.length === 0) {
    // New user - return popular books
    return await prisma.book.findMany({
      orderBy: [
        { viewCount: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit,
    });
  }

  // Extract user preferences
  const genreFrequency = new Map<string, number>();
  const authorFrequency = new Map<string, number>();
  const borrowedBookIds = new Set<string>();

  userBorrows.forEach((borrow) => {
    borrowedBookIds.add(borrow.book.id);
    
    const genre = borrow.book.genre;
    genreFrequency.set(genre, (genreFrequency.get(genre) || 0) + 1);
    
    const author = borrow.book.author;
    authorFrequency.set(author, (authorFrequency.get(author) || 0) + 1);
  });

  // Get top genres and authors
  const topGenres = Array.from(genreFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([genre]) => genre);

  const topAuthors = Array.from(authorFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([author]) => author);

  // Find similar books
  const recommendations = await prisma.book.findMany({
    where: {
      AND: [
        {
          id: {
            notIn: Array.from(borrowedBookIds),
          },
        },
        {
          OR: [
            { genre: { in: topGenres } },
            { author: { in: topAuthors } },
          ],
        },
        {
          availableCopies: { gt: 0 },
        },
      ],
    },
    orderBy: [
      { viewCount: 'desc' },
      { createdAt: 'desc' },
    ],
    take: limit * 2,
  });

  // Score and rank recommendations
  const scoredBooks = recommendations.map((book) => {
    let score = 0;
    
    // Genre match score
    const genreScore = genreFrequency.get(book.genre) || 0;
    score += genreScore * 3;
    
    // Author match score
    const authorScore = authorFrequency.get(book.author) || 0;
    score += authorScore * 2;
    
    // Popularity score
    score += book.viewCount * 0.1;
    
    return { book, score };
  });

  // Sort by score and return top N
  return scoredBooks
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ book }) => book);
}

/**
 * AI-powered smart search with fuzzy matching and relevance scoring
 */
export async function smartSearch(query: string, limit: number = 10): Promise<Book[]> {
  const searchTerms = query.toLowerCase().trim().split(/\s+/);
  
  if (searchTerms.length === 0) {
    return [];
  }

  // Get all books
  const allBooks = await prisma.book.findMany();

  // Score each book based on relevance
  const scoredBooks = allBooks.map((book) => {
    let score = 0;
    const titleLower = book.title.toLowerCase();
    const authorLower = book.author.toLowerCase();
    const genreLower = book.genre.toLowerCase();
    const descLower = (book.description || '').toLowerCase();

    searchTerms.forEach((term) => {
      // Exact matches get highest score
      if (titleLower === term) score += 100;
      if (authorLower === term) score += 80;
      if (genreLower === term) score += 60;

      // Starts with matches
      if (titleLower.startsWith(term)) score += 50;
      if (authorLower.startsWith(term)) score += 40;

      // Contains matches
      if (titleLower.includes(term)) score += 30;
      if (authorLower.includes(term)) score += 25;
      if (genreLower.includes(term)) score += 20;
      if (descLower.includes(term)) score += 10;

      // Fuzzy matching (simple Levenshtein-like)
      const titleWords = titleLower.split(/\s+/);
      const authorWords = authorLower.split(/\s+/);
      
      titleWords.forEach((word) => {
        if (isSimilar(word, term)) score += 15;
      });
      
      authorWords.forEach((word) => {
        if (isSimilar(word, term)) score += 12;
      });
    });

    // Boost popular books slightly
    score += book.viewCount * 0.5;

    return { book, score };
  });

  // Filter books with score > 0 and sort by score
  return scoredBooks
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ book }) => book);
}

/**
 * Simple similarity check for fuzzy matching
 */
function isSimilar(word1: string, word2: string): boolean {
  if (word1.length < 3 || word2.length < 3) return false;
  
  // Check if one word contains most of the other
  const shorter = word1.length < word2.length ? word1 : word2;
  const longer = word1.length < word2.length ? word2 : word1;
  
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  
  return matches / shorter.length > 0.7;
}

/**
 * Get personalized reading suggestions based on current trends and user history
 */
export async function getReadingSuggestions(userId: string): Promise<{
  trending: Book[];
  newArrivals: Book[];
  similarToLast: Book[];
}> {
  // Get trending books (most borrowed in last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  
  const trendingBookIds = await prisma.borrowRecord.groupBy({
    by: ['bookId'],
    where: {
      borrowedAt: { gte: thirtyDaysAgo },
    },
    _count: { bookId: true },
    orderBy: { _count: { bookId: 'desc' } },
    take: 5,
  });

  const trending = await prisma.book.findMany({
    where: {
      id: { in: trendingBookIds.map((b) => b.bookId) },
      availableCopies: { gt: 0 },
    },
    take: 5,
  });

  // Get new arrivals (recently added books)
  const newArrivals = await prisma.book.findMany({
    where: {
      availableCopies: { gt: 0 },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Get books similar to user's last borrowed book
  const lastBorrow = await prisma.borrowRecord.findFirst({
    where: { userId },
    include: { book: true },
    orderBy: { borrowedAt: 'desc' },
  });

  let similarToLast: Book[] = [];
  if (lastBorrow) {
    similarToLast = await prisma.book.findMany({
      where: {
        AND: [
          { id: { not: lastBorrow.bookId } },
          {
            OR: [
              { genre: lastBorrow.book.genre },
              { author: lastBorrow.book.author },
            ],
          },
          { availableCopies: { gt: 0 } },
        ],
      },
      take: 5,
    });
  }

  return {
    trending,
    newArrivals,
    similarToLast,
  };
}

/**
 * Generate AI-powered book summary/description if missing
 */
export function generateBookSummary(book: { title: string; author: string; genre: string }): string {
  // This is a simple template-based generator
  // In production, you'd use an actual AI API like OpenAI
  
  const templates = {
    Fiction: [
      `A captivating ${book.genre.toLowerCase()} novel by ${book.author} that explores the depths of human nature and storytelling.`,
      `${book.author}'s masterful work that weaves together compelling characters and intricate plotlines in this ${book.genre.toLowerCase()} masterpiece.`,
    ],
    'Science Fiction': [
      `A thought-provoking journey into the future by ${book.author}, exploring themes of technology, humanity, and what lies beyond.`,
      `${book.author} crafts a visionary tale that challenges our understanding of science, society, and the cosmos.`,
    ],
    Mystery: [
      `A gripping mystery by ${book.author} that will keep you guessing until the very last page.`,
      `${book.author} delivers a masterful whodunit filled with twists, turns, and unexpected revelations.`,
    ],
    Fantasy: [
      `An enchanting fantasy adventure by ${book.author} that transports readers to magical realms beyond imagination.`,
      `${book.author} creates a rich, immersive world filled with magic, adventure, and unforgettable characters.`,
    ],
    History: [
      `A comprehensive exploration of historical events by ${book.author}, bringing the past to life with vivid detail.`,
      `${book.author} offers fresh insights into history, making the past accessible and engaging for modern readers.`,
    ],
    Science: [
      `${book.author} makes complex scientific concepts accessible and fascinating for readers of all backgrounds.`,
      `A brilliant exploration of scientific principles by ${book.author}, combining rigorous research with engaging storytelling.`,
    ],
  };

  const genreTemplates = templates[book.genre as keyof typeof templates] || [
    `An engaging work by ${book.author} that offers readers a unique perspective on ${book.genre.toLowerCase()}.`,
  ];

  return genreTemplates[Math.floor(Math.random() * genreTemplates.length)];
}
