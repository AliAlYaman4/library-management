# NextAuth Setup Guide

## Installation

```bash
npm install next-auth @auth/prisma-adapter @prisma/client
npm install -D prisma
```

## Database Setup

1. Initialize Prisma:
```bash
npx prisma init
```

2. Update your `.env` with your PostgreSQL connection string

3. Run migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env`

## Generate NextAuth Secret

```bash
openssl rand -base64 32
```

Add to `.env` as `NEXTAUTH_SECRET`

## Usage Examples

### Protecting Server Components (App Router)

```typescript
import { requireAuth, requireAdmin, requireLibrarian } from '@/lib/auth-utils';

// Require any authenticated user
export default async function DashboardPage() {
  const user = await requireAuth();
  return <div>Welcome {user.name}</div>;
}

// Require admin role
export default async function AdminPage() {
  const user = await requireAdmin();
  return <div>Admin Panel</div>;
}

// Require librarian or admin
export default async function LibrarianPage() {
  const user = await requireLibrarian();
  return <div>Librarian Dashboard</div>;
}
```

### Protecting API Routes

```typescript
import { requireApiAuth, requireApiAdmin, requireApiLibrarian } from '@/lib/api-auth';
import { NextRequest } from 'next/server';

// Require authentication
export async function GET(req: NextRequest) {
  const { error, user } = await requireApiAuth(req);
  if (error) return error;
  
  // Your logic here
  return Response.json({ data: 'protected' });
}

// Require admin role
export async function POST(req: NextRequest) {
  const { error, user } = await requireApiAdmin(req);
  if (error) return error;
  
  // Admin-only logic
  return Response.json({ success: true });
}

// Require librarian or admin
export async function PUT(req: NextRequest) {
  const { error, user } = await requireApiLibrarian(req);
  if (error) return error;
  
  // Librarian logic
  return Response.json({ success: true });
}
```

### Client Components (Using Session)

```typescript
'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';

export default function ClientComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Access Denied</div>;
  
  const isAdmin = session?.user?.role === UserRole.ADMIN;
  const isLibrarian = session?.user?.role === UserRole.LIBRARIAN || isAdmin;
  
  return (
    <div>
      <p>Welcome {session?.user?.name}</p>
      {isAdmin && <button>Admin Action</button>}
      {isLibrarian && <button>Librarian Action</button>}
    </div>
  );
}
```

### Conditional Rendering Based on Role

```typescript
import { getCurrentUser } from '@/lib/auth-utils';
import { isAdmin, isLibrarian } from '@/lib/auth-utils';

export default async function Page() {
  const user = await getCurrentUser();
  
  if (!user) return <div>Please sign in</div>;
  
  return (
    <div>
      <h1>Dashboard</h1>
      
      {isAdmin(user.role) && (
        <section>
          <h2>Admin Section</h2>
          {/* Admin-only content */}
        </section>
      )}
      
      {isLibrarian(user.role) && (
        <section>
          <h2>Librarian Section</h2>
          {/* Librarian and Admin content */}
        </section>
      )}
      
      <section>
        <h2>Member Section</h2>
        {/* All authenticated users */}
      </section>
    </div>
  );
}
```

## Protected Routes (Middleware)

The middleware automatically protects these routes:
- `/admin/*` - Admin only
- `/librarian/*` - Librarian and Admin
- `/dashboard/*` - All authenticated users
- `/api/admin/*` - Admin only
- `/api/librarian/*` - Librarian and Admin
- `/api/books/*` - All authenticated users
- `/api/borrow/*` - All authenticated users

## Changing User Roles

Only admins should be able to change roles. Example API route:

```typescript
import { requireApiAdmin } from '@/lib/api-auth';
import { PrismaClient, UserRole } from '@prisma/client';
import { NextRequest } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { error } = await requireApiAdmin(req);
  if (error) return error;
  
  const { role } = await req.json();
  
  const user = await prisma.user.update({
    where: { id: params.id },
    data: { role },
  });
  
  return Response.json(user);
}
```

## First Admin Setup

After first deployment, manually update a user's role in the database:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:
```bash
npx prisma studio
```
