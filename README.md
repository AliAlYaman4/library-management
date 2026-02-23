# 📚 Library Management System

A modern, full-stack library management system built with Next.js, featuring role-based access control, AI-powered book recommendations, and real-time borrowing management.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/library-management)

**Live Demo:** [https://your-app.vercel.app](https://your-app.vercel.app) *(Coming Soon)*

---

## ✨ Features

### 📖 Book Management
- **CRUD Operations** - Create, read, update, and delete books
- **Advanced Search** - Multi-field search with relevance ranking
- **Real-time Availability** - Track available vs. borrowed copies
- **AI Summaries** - Auto-generated book summaries and genre recommendations

### 👥 User Roles & Permissions
- **ADMIN** - Full system access, user management, book deletion
- **LIBRARIAN** - Book management, borrowing operations
- **MEMBER** - Browse, search, borrow, and return books

### 🤖 AI-Powered Features
- **Smart Summaries** - AI-generated book descriptions
- **Genre Recommendations** - Related genre suggestions
- **Personalized Recommendations** - Based on borrowing history
- **AI-Enhanced Search** - Intelligent book ranking

### 🔐 Authentication & Security
- **Google OAuth** - Secure single sign-on
- **JWT Sessions** - Stateless authentication
- **Role-Based Access Control** - Granular permissions
- **Protected Routes** - Middleware-level security

### 📊 Borrowing System
- **Real-time Tracking** - Monitor active borrows
- **Availability Management** - Automatic copy counting
- **Borrow History** - Complete transaction records
- **Prevent Double Borrowing** - Database-level constraints

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[NextAuth.js](https://next-auth.js.org/)** - Authentication

### Backend
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless functions
- **[Prisma ORM](https://www.prisma.io/)** - Type-safe database access
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Zod](https://zod.dev/)** - Schema validation

### AI Integration
- **[OpenAI GPT-4](https://openai.com/)** - Book summaries & recommendations
- **[Anthropic Claude](https://www.anthropic.com/)** - Alternative AI provider

### Deployment
- **[Vercel](https://vercel.com/)** - Hosting & CI/CD
- **[Neon](https://neon.tech/)** / **[Supabase](https://supabase.com/)** - Production database

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ and npm
- **PostgreSQL** database
- **Google OAuth** credentials
- **OpenAI** or **Anthropic** API key (optional)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/library-management.git
cd library-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/library_management"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# AI (Optional)
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
```

### 4. Database Setup
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed database
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Environment Variables

### Required

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Session encryption key | Generate with `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `*.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | From Google Console |

### Optional (AI Features)

| Variable | Description | Example |
|----------|-------------|---------|
| `AI_PROVIDER` | AI service provider | `openai` or `claude` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `ANTHROPIC_API_KEY` | Anthropic API key | `sk-ant-...` |

See [`.env.example`](.env.example) for complete reference.

---

## 🗂️ Project Structure

```
library-management/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # API routes
│   │   ├── dashboard/        # Dashboard pages
│   │   └── books/            # Book pages
│   ├── components/           # React components
│   ├── lib/                  # Utilities
│   │   ├── ai/              # AI integration
│   │   ├── recommendations/ # Recommendation engine
│   │   └── validators/      # Zod schemas
│   └── hooks/               # Custom React hooks
├── public/                   # Static assets
├── DEPLOYMENT.md            # Deployment guide
├── ROLE_BASED_ACCESS.md     # RBAC documentation
└── README.md                # This file
```

---

## 🔑 User Roles

### ADMIN
- ✅ Full system access
- ✅ Delete books
- ✅ Manage users
- ✅ Access admin panel

### LIBRARIAN
- ✅ Create and edit books
- ✅ Manage borrowing
- ❌ Cannot delete books
- ❌ Cannot manage users

### MEMBER
- ✅ Browse and search books
- ✅ Borrow and return books
- ✅ View recommendations
- ❌ Cannot manage books

See [ROLE_BASED_ACCESS.md](ROLE_BASED_ACCESS.md) for detailed permissions.

---

## 🌐 API Endpoints

### Books
- `GET /api/books` - List all books
- `POST /api/books` - Create book (LIBRARIAN+)
- `GET /api/books/:id` - Get book details
- `PUT /api/books/:id` - Update book (LIBRARIAN+)
- `DELETE /api/books/:id` - Delete book (ADMIN only)
- `GET /api/books/search?q=query` - Search books

### Borrowing
- `POST /api/borrow/:bookId` - Borrow book
- `POST /api/return/:bookId` - Return book
- `GET /api/borrow/history` - Borrow history

### Recommendations
- `GET /api/recommendations?limit=5` - Get recommendations
- `GET /api/recommendations?ai=true` - AI-enhanced recommendations

### Authentication
- `GET /api/auth/signin` - Sign in
- `GET /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

---

## 🚢 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variables

3. **Setup Production Database**
   - Create PostgreSQL database (Neon/Supabase/Railway)
   - Add `DATABASE_URL` to Vercel

4. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   ```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 🧪 Testing

```bash
# Run linter
npm run lint

# Type checking
npx tsc --noEmit

# Database studio
npx prisma studio
```

---

## 📝 Creating First Admin User

After deployment, set your first user as ADMIN:

### Option 1: Prisma Studio
```bash
npx prisma studio
# Navigate to User table → Change role to ADMIN
```

### Option 2: SQL Query
```sql
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-email@example.com';
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vercel](https://vercel.com/) - Deployment platform

---

## 📧 Support

For support, email support@example.com or open an issue on GitHub.

---

## 🗺️ Roadmap

- [ ] Email notifications for due dates
- [ ] Book reservations system
- [ ] Fine calculation for late returns
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Book cover image uploads
- [ ] Multi-language support
- [ ] Export reports (PDF/CSV)

---

**Built with ❤️ using Next.js and TypeScript**