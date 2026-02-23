import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await prisma.borrowRecord.deleteMany();
  await prisma.book.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const users = await Promise.all([
    // Admin user
    prisma.user.create({
      data: {
        email: 'admin@library.com',
        name: 'System Administrator',
        role: 'ADMIN',
        password: await bcrypt.hash('admin123', 10),
      },
    }),
    // Librarian user
    prisma.user.create({
      data: {
        email: 'librarian@library.com',
        name: 'Sarah Johnson',
        role: 'LIBRARIAN',
        password: await bcrypt.hash('librarian123', 10),
      },
    }),
    // Member users
    prisma.user.create({
      data: {
        email: 'member@library.com',
        name: 'John Smith',
        role: 'MEMBER',
        password: await bcrypt.hash('member123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'alice@library.com',
        name: 'Alice Chen',
        role: 'MEMBER',
        password: await bcrypt.hash('member123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob@library.com',
        name: 'Bob Wilson',
        role: 'MEMBER',
        password: await bcrypt.hash('member123', 10),
      },
    }),
    prisma.user.create({
      data: {
        email: 'emma@library.com',
        name: 'Emma Davis',
        role: 'MEMBER',
        password: await bcrypt.hash('member123', 10),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create books
  const books = await Promise.all([
    // Fiction books
    prisma.book.create({
      data: {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        publishedYear: 1925,
        totalCopies: 3,
        availableCopies: 2,
        description: 'A classic American novel set in the Jazz Age, exploring themes of wealth, love, and the American Dream.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        publishedYear: 1960,
        totalCopies: 4,
        availableCopies: 1,
        description: 'A powerful story of racial injustice and childhood innocence in the American South.',
      },
    }),
    prisma.book.create({
      data: {
        title: '1984',
        author: 'George Orwell',
        genre: 'Science Fiction',
        publishedYear: 1949,
        totalCopies: 5,
        availableCopies: 3,
        description: 'A dystopian social science fiction novel and cautionary tale about totalitarianism.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        genre: 'Romance',
        publishedYear: 1813,
        totalCopies: 2,
        availableCopies: 0,
        description: 'A romantic novel of manners that charts the emotional development of Elizabeth Bennet.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'The Catcher in the Rye',
        author: 'J.D. Salinger',
        genre: 'Fiction',
        publishedYear: 1951,
        totalCopies: 3,
        availableCopies: 2,
        description: 'A controversial novel featuring the teenage protagonist Holden Caulfield.',
      },
    }),
    // Non-fiction books
    prisma.book.create({
      data: {
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        genre: 'History',
        publishedYear: 2011,
        totalCopies: 4,
        availableCopies: 2,
        description: 'A groundbreaking narrative of humanity\'s creation and evolution.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        genre: 'Psychology',
        publishedYear: 2011,
        totalCopies: 2,
        availableCopies: 1,
        description: 'An exploration of the two systems that drive the way we think and make decisions.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'The Power of Habit',
        author: 'Charles Duhigg',
        genre: 'Self-Help',
        publishedYear: 2012,
        totalCopies: 3,
        availableCopies: 3,
        description: 'An exploration of the science behind habit creation and reformation.',
      },
    }),
    // Science books
    prisma.book.create({
      data: {
        title: 'A Brief History of Time',
        author: 'Stephen Hawking',
        genre: 'Science',
        publishedYear: 1988,
        totalCopies: 2,
        availableCopies: 1,
        description: 'A landmark volume in science writing that explores the universe\'s origins.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'The Selfish Gene',
        author: 'Richard Dawkins',
        genre: 'Science',
        publishedYear: 1976,
        totalCopies: 3,
        availableCopies: 2,
        description: 'A revolutionary book on evolution that introduced the concept of the meme.',
      },
    }),
    // Mystery books
    prisma.book.create({
      data: {
        title: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        genre: 'Mystery',
        publishedYear: 2005,
        totalCopies: 4,
        availableCopies: 1,
        description: 'A gripping psychological thriller featuring the hacker Lisbeth Salander.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        genre: 'Mystery',
        publishedYear: 2012,
        totalCopies: 3,
        availableCopies: 0,
        description: 'A psychological thriller about a marriage gone terribly wrong.',
      },
    }),
    // Fantasy books
    prisma.book.create({
      data: {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        publishedYear: 1937,
        totalCopies: 5,
        availableCopies: 3,
        description: 'A fantasy novel about the adventures of hobbit Bilbo Baggins.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        genre: 'Fantasy',
        publishedYear: 1997,
        totalCopies: 6,
        availableCopies: 4,
        description: 'The first book in the beloved Harry Potter series about a young wizard.',
      },
    }),
    prisma.book.create({
      data: {
        title: 'The Name of the Wind',
        author: 'Patrick Rothfuss',
        genre: 'Fantasy',
        publishedYear: 2007,
        totalCopies: 3,
        availableCopies: 2,
        description: 'The first book in the Kingkiller Chronicle series about a legendary arcanist.',
      },
    }),
  ]);

  console.log(`✅ Created ${books.length} books`);

  // Create comprehensive borrow records for AI features
  const now = new Date();
  const borrowRecords = await Promise.all([
    // === MEMBER USER (member@library.com) - Diverse reading history ===
    // Recent active borrows
    prisma.borrowRecord.create({
      data: {
        userId: users[2].id,
        bookId: books[0].id, // The Great Gatsby (Fiction)
        borrowedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        dueDate: new Date(now.getTime() + 9 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[2].id,
        bookId: books[12].id, // The Hobbit (Fantasy)
        borrowedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        dueDate: new Date(now.getTime() + 11 * 24 * 60 * 60 * 1000),
      },
    }),
    // Returned books - Fiction lover pattern
    prisma.borrowRecord.create({
      data: {
        userId: users[2].id,
        bookId: books[1].id, // To Kill a Mockingbird (Fiction)
        borrowedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000), // Returned 8 days ago
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[2].id,
        bookId: books[4].id, // The Catcher in the Rye (Fiction)
        borrowedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[2].id,
        bookId: books[13].id, // Harry Potter (Fantasy)
        borrowedAt: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 26 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[2].id,
        bookId: books[14].id, // The Name of the Wind (Fantasy)
        borrowedAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 36 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 38 * 24 * 60 * 60 * 1000),
      },
    }),

    // === ALICE CHEN - Science Fiction enthusiast ===
    prisma.borrowRecord.create({
      data: {
        userId: users[3].id,
        bookId: books[2].id, // 1984 (Sci-Fi)
        borrowedAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[3].id,
        bookId: books[9].id, // The Selfish Gene (Science)
        borrowedAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[3].id,
        bookId: books[8].id, // A Brief History of Time (Science)
        borrowedAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 11 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 13 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[3].id,
        bookId: books[5].id, // Sapiens (History)
        borrowedAt: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 23 * 24 * 60 * 60 * 1000),
      },
    }),

    // === BOB WILSON - Mystery lover ===
    prisma.borrowRecord.create({
      data: {
        userId: users[4].id,
        bookId: books[10].id, // The Girl with the Dragon Tattoo (Mystery)
        borrowedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[4].id,
        bookId: books[11].id, // Gone Girl (Mystery)
        borrowedAt: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[4].id,
        bookId: books[3].id, // Pride and Prejudice (Romance)
        borrowedAt: new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 16 * 24 * 60 * 60 * 1000),
      },
    }),

    // === EMMA DAVIS - Self-improvement reader ===
    prisma.borrowRecord.create({
      data: {
        userId: users[5].id,
        bookId: books[7].id, // The Power of Habit (Self-Help)
        borrowedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[5].id,
        bookId: books[6].id, // Thinking, Fast and Slow (Psychology)
        borrowedAt: new Date(now.getTime() - 19 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.borrowRecord.create({
      data: {
        userId: users[5].id,
        bookId: books[5].id, // Sapiens (History)
        borrowedAt: new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 18 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
      },
    }),
    // Overdue book with penalty
    prisma.borrowRecord.create({
      data: {
        userId: users[5].id,
        bookId: books[8].id, // A Brief History of Time
        borrowedAt: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 31 * 24 * 60 * 60 * 1000),
        penalty: 7.00,
      },
    }),
  ]);

  console.log(`✅ Created ${borrowRecords.length} borrow records`);

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📚 Demo Accounts with AI-Ready Data:');
  console.log('   Admin: admin@library.com / admin123');
  console.log('   Librarian: librarian@library.com / librarian123');
  console.log('   Member: member@library.com / member123 (6 borrows - Fiction/Fantasy lover)');
  console.log('   Alice: alice@library.com / member123 (4 borrows - Science enthusiast)');
  console.log('   Bob: bob@library.com / member123 (3 borrows - Mystery lover)');
  console.log('   Emma: emma@library.com / member123 (4 borrows - Self-improvement reader)');
  console.log('\n📖 Books created: 15 books across 8 genres');
  console.log('📊 Borrow records: 17 records with realistic patterns');
  console.log('\n🤖 AI Features Ready:');
  console.log('   ✓ Personalized Recommendations (based on genre preferences)');
  console.log('   ✓ Reading Insights (streaks, milestones, reading speed)');
  console.log('   ✓ Similar Books (genre and author matching)');
  console.log('   ✓ Trending Books (most borrowed)');
  console.log('   ✓ Reading patterns for each user type');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
