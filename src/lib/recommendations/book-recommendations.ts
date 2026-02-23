import { prisma } from '@/lib/prisma';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description?: string | null;
  publishedYear: number;
  availableCopies: number;
  aiSummary?: string | null;
  recommendedGenres?: string[];
}

interface RecommendationScore {
  book: Book;
  score: number;
  reasons: string[];
}

export async function getBasicRecommendations(
  userId: string,
  limit: number = 5
): Promise<Book[]> {
  const borrowHistory = await prisma.borrowRecord.findMany({
    where: { userId },
    include: { book: true },
    orderBy: { borrowedAt: 'desc' },
    take: 20,
  });

  if (borrowHistory.length === 0) {
    return getPopularBooks(limit);
  }

  const borrowedBooks = borrowHistory.map((record) => record.book);
  const borrowedBookIds = borrowedBooks.map((book) => book.id);

  const genreCount: Record<string, number> = {};
  const authorCount: Record<string, number> = {};

  borrowedBooks.forEach((book) => {
    genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
    authorCount[book.author] = (authorCount[book.author] || 0) + 1;
  });

  const preferredGenres = Object.entries(genreCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([genre]) => genre);

  const preferredAuthors = Object.entries(authorCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([author]) => author);

  const candidateBooks = await prisma.book.findMany({
    where: {
      id: { notIn: borrowedBookIds },
      availableCopies: { gt: 0 },
      OR: [
        { genre: { in: preferredGenres } },
        { author: { in: preferredAuthors } },
      ],
    },
    take: 50,
  });

  const scoredBooks: RecommendationScore[] = candidateBooks.map((book) => {
    let score = 0;
    const reasons: string[] = [];

    const genreMatch = preferredGenres.indexOf(book.genre);
    if (genreMatch !== -1) {
      const genreScore = (3 - genreMatch) * 10;
      score += genreScore;
      reasons.push(`Same genre: ${book.genre}`);
    }

    const authorMatch = preferredAuthors.indexOf(book.author);
    if (authorMatch !== -1) {
      const authorScore = (3 - authorMatch) * 15;
      score += authorScore;
      reasons.push(`Same author: ${book.author}`);
    }

    if (book.recommendedGenres && book.recommendedGenres.length > 0) {
      const aiGenreMatch = book.recommendedGenres.some((genre) =>
        preferredGenres.includes(genre)
      );
      if (aiGenreMatch) {
        score += 5;
        reasons.push('Related genre');
      }
    }

    return { book, score, reasons };
  });

  scoredBooks.sort((a, b) => b.score - a.score);

  return scoredBooks.slice(0, limit).map((item) => item.book);
}

async function getPopularBooks(limit: number): Promise<Book[]> {
  const popularBooks = await prisma.borrowRecord.groupBy({
    by: ['bookId'],
    _count: { bookId: true },
    orderBy: { _count: { bookId: 'desc' } },
    take: limit,
  });

  const bookIds = popularBooks.map((item) => item.bookId);

  const books = await prisma.book.findMany({
    where: {
      id: { in: bookIds },
      availableCopies: { gt: 0 },
    },
  });

  const bookMap = new Map(books.map((book) => [book.id, book]));
  return bookIds.map((id) => bookMap.get(id)).filter(Boolean) as Book[];
}

export async function getAIEnhancedRecommendations(
  userId: string,
  limit: number = 5
): Promise<Book[]> {
  const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return getBasicRecommendations(userId, limit);
  }

  const borrowHistory = await prisma.borrowRecord.findMany({
    where: { userId },
    include: { book: true },
    orderBy: { borrowedAt: 'desc' },
    take: 10,
  });

  if (borrowHistory.length === 0) {
    return getPopularBooks(limit);
  }

  const borrowedBooks = borrowHistory.map((record) => record.book);
  const borrowedBookIds = borrowedBooks.map((book) => book.id);

  const basicRecommendations = await getBasicRecommendations(userId, limit * 2);

  try {
    const bookSummaries = borrowedBooks
      .slice(0, 5)
      .map((book) => `"${book.title}" by ${book.author} (${book.genre})`)
      .join(', ');

    const candidateTitles = basicRecommendations
      .map((book) => `"${book.title}" by ${book.author}`)
      .join(', ');

    const prompt = `Based on a user who has read: ${bookSummaries}

From these available books: ${candidateTitles}

Recommend the top ${limit} books that would best match their reading preferences. Return only the book titles in order of recommendation, one per line.`;

    const provider = process.env.AI_PROVIDER || 'openai';
    let aiResponse: string;

    if (provider === 'claude' && process.env.ANTHROPIC_API_KEY) {
      aiResponse = await callClaudeAPI(prompt);
    } else if (process.env.OPENAI_API_KEY) {
      aiResponse = await callOpenAIAPI(prompt);
    } else {
      return basicRecommendations.slice(0, limit);
    }

    const recommendedTitles = aiResponse
      .split('\n')
      .map((line) => line.trim().replace(/^[0-9]+\.\s*/, '').replace(/"/g, ''))
      .filter(Boolean);

    const orderedBooks: Book[] = [];
    recommendedTitles.forEach((title) => {
      const book = basicRecommendations.find((b) =>
        b.title.toLowerCase().includes(title.toLowerCase())
      );
      if (book && !orderedBooks.includes(book)) {
        orderedBooks.push(book);
      }
    });

    basicRecommendations.forEach((book) => {
      if (!orderedBooks.includes(book) && orderedBooks.length < limit) {
        orderedBooks.push(book);
      }
    });

    return orderedBooks.slice(0, limit);
  } catch (error) {
    console.error('Error getting AI-enhanced recommendations:', error);
    return basicRecommendations.slice(0, limit);
  }
}

async function callOpenAIAPI(prompt: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a book recommendation expert.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    }),
  });

  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

async function callClaudeAPI(prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 200,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.content[0]?.text || '';
}
