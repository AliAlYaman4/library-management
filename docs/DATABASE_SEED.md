# Database Seeding Guide

This document explains how to seed the Library Management System database with demo data for testing.

## 🌱 What's Included in the Seed

### Users (6 accounts)
| Role | Email | Password | Name |
|------|-------|----------|------|
| **Admin** | admin@library.com | admin123 | System Administrator |
| **Librarian** | librarian@library.com | librarian123 | Sarah Johnson |
| **Member** | member@library.com | member123 | John Smith |
| **Member** | alice@library.com | member123 | Alice Chen |
| **Member** | bob@library.com | member123 | Bob Wilson |
| **Member** | emma@library.com | member123 | Emma Davis |

### Books (15 books across 6 genres)
- **Fiction**: The Great Gatsby, To Kill a Mockingbird, The Catcher in the Rye
- **Science Fiction**: 1984
- **Romance**: Pride and Prejudice
- **History**: Sapiens: A Brief History of Humankind
- **Psychology**: Thinking, Fast and Slow
- **Self-Help**: The Power of Habit
- **Science**: A Brief History of Time, The Selfish Gene
- **Mystery**: The Girl with the Dragon Tattoo, Gone Girl
- **Fantasy**: The Hobbit, Harry Potter and the Sorcerer's Stone, The Name of the Wind

### Borrow Records (6 records)
- **Active borrows**: 3 (Alice, Bob, Emma)
- **Returned books**: 2 (Alice, Bob)
- **Overdue books**: 1 (Emma with $5.50 penalty)

## 🚀 Quick Start

### Option 1: Fresh Setup (Recommended)
```bash
# Install dependencies
npm install

# Reset database and seed with demo data
npm run db:reset

# Start the development server
npm run dev
```

### Option 2: Seed Only (if database exists)
```bash
# Seed the database with demo data
npm run db:seed

# Start the development server
npm run dev
```

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run db:seed` | Seed the database with demo data |
| `npm run db:reset` | Reset database (clear + seed) |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |

## 🧪 Testing Different Roles

After seeding, you can test the different user roles:

1. **Navigate to** `/auth/signin`
2. **Use quick login buttons** or manual credentials
3. **Test permissions** on the `/profile` page

### What to Test

**Admin (admin@library.com):**
- Full access to all features
- Can view analytics at `/admin/analytics`
- Can add/delete books
- Can export data
- Can manage users

**Librarian (librarian@library.com):**
- Can add books (but not delete)
- Can manage book inventory
- Cannot access admin analytics
- Cannot export data

**Member (member@library.com):**
- Can browse and borrow books
- Cannot add/delete books
- Cannot access admin features

## 🔧 Customization

### Adding More Books
Edit `prisma/seed.ts` and add more books to the books array:

```typescript
prisma.book.create({
  data: {
    title: 'Your Book Title',
    author: 'Author Name',
    genre: 'Genre',
    publishedYear: 2024,
    totalCopies: 3,
    availableCopies: 3,
    description: 'Book description here...',
  },
}),
```

### Adding More Users
Edit `prisma/seed.ts` and add more users:

```typescript
prisma.user.create({
  data: {
    email: 'newuser@library.com',
    name: 'New User Name',
    role: 'MEMBER', // or 'LIBRARIAN', 'ADMIN'
    password: await bcrypt.hash('password123', 10),
  },
}),
```

### Creating Borrow Records
Add sample borrowing history:

```typescript
prisma.borrowRecord.create({
  data: {
    userId: users[0].id, // Reference a user
    bookId: books[0].id, // Reference a book
    borrowedAt: new Date('2024-01-15'),
    dueDate: new Date('2024-02-15'),
    returnedAt: new Date('2024-02-10'), // Omit if still borrowed
    penalty: 2.50, // Optional: for overdue books
  },
}),
```

## 🚨 Important Notes

- **Passwords are hashed** using bcrypt for security
- **Database is cleared** before seeding (no duplicates)
- **All dates are realistic** for testing purposes
- **Email addresses are unique** and follow a pattern
- **Books have varying availability** to test different scenarios

## 🐛 Troubleshooting

### "Database not found" error
```bash
# Make sure you've run migrations first
npx prisma migrate dev --name init
# Then seed
npm run db:seed
```

### "Permission denied" error
```bash
# Make sure your database server is running
# For PostgreSQL, check connection string in .env
```

### "Module not found" error
```bash
# Install missing dependencies
npm install
# Specifically install tsx if missing
npm install -D tsx
```

---

**Happy testing! 🎉**
