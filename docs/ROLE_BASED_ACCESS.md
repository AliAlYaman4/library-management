# Role-Based Access Control (RBAC)

## Overview
The Library Management System implements comprehensive role-based access control with three user roles:

## User Roles

### 1. ADMIN
**Full System Access**
- ✅ All LIBRARIAN permissions
- ✅ Delete books (even with active borrows blocked)
- ✅ Manage system users
- ✅ Access admin panel
- ✅ View all system data

**UI Features:**
- Admin Panel link in navbar
- Delete Book button on book detail pages
- Red role badge

### 2. LIBRARIAN
**Book Management**
- ✅ Create new books
- ✅ Edit book details
- ✅ View all books
- ✅ Search books
- ✅ Borrow and return books
- ❌ Cannot delete books
- ❌ Cannot manage users

**UI Features:**
- Add Book button on books page
- Blue role badge

### 3. MEMBER
**Basic Access**
- ✅ Search and browse books
- ✅ Borrow available books
- ✅ Return borrowed books
- ✅ View borrowing history
- ✅ Get recommendations
- ❌ Cannot create/edit/delete books
- ❌ Cannot access admin features

**UI Features:**
- Green role badge
- Borrow/Return buttons only

## Implementation

### Backend Verification

**API Route Protection:**
```typescript
// Require authentication
import { requireApiAuth } from '@/lib/api-auth';
const { error, user } = await requireApiAuth(req);

// Require LIBRARIAN or ADMIN
import { requireApiLibrarian } from '@/lib/api-auth';
const { error, user } = await requireApiLibrarian(req);

// Require ADMIN only
import { requireApiAdmin } from '@/lib/api-auth';
const { error, user } = await requireApiAdmin(req);
```

**Server Component Protection:**
```typescript
import { requireAuth, requireAdmin, requireLibrarian } from '@/lib/auth-utils';

// Any authenticated user
const user = await requireAuth();

// Admin only
const user = await requireAdmin();

// Librarian or Admin
const user = await requireLibrarian();
```

### Frontend Guards

**Client Component Hook:**
```typescript
import { useUserRole } from '@/hooks/useUserRole';

const {
  isAdmin,
  isLibrarian,
  isMember,
  canManageBooks,
  canDeleteBooks,
  canManageUsers,
  canBorrowBooks,
} = useUserRole();
```

**React Components:**
```typescript
import { AdminOnly, LibrarianOrAdmin, RoleGuard } from '@/components/RoleGuard';

// Admin only content
<AdminOnly>
  <DeleteButton />
</AdminOnly>

// Librarian or Admin
<LibrarianOrAdmin>
  <AddBookButton />
</LibrarianOrAdmin>

// Custom roles
<RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.LIBRARIAN]}>
  <ManageContent />
</RoleGuard>
```

## Protected Endpoints

### ADMIN Only
- `DELETE /api/books/:id` - Delete books
- `/admin/*` - Admin panel routes

### LIBRARIAN or ADMIN
- `POST /api/books` - Create books
- `PUT /api/books/:id` - Update books

### Authenticated Users (All Roles)
- `POST /api/borrow/:bookId` - Borrow books
- `POST /api/return/:bookId` - Return books
- `GET /api/recommendations` - Get recommendations
- `GET /api/borrow/history` - View borrow history

### Public
- `GET /api/books` - List books
- `GET /api/books/:id` - View book details
- `GET /api/books/search` - Search books

## Middleware Protection

Routes automatically protected by middleware:
```typescript
// src/middleware.ts
'/admin/*'          → ADMIN only
'/librarian/*'      → LIBRARIAN + ADMIN
'/dashboard/*'      → Authenticated users
'/api/admin/*'      → ADMIN only
'/api/librarian/*'  → LIBRARIAN + ADMIN
```

## UI Visibility Rules

**Navigation:**
- Dashboard link: All authenticated users
- Books link: Everyone
- Admin Panel link: ADMIN only

**Book Management:**
- Add Book button: LIBRARIAN + ADMIN
- Edit Book: LIBRARIAN + ADMIN
- Delete Book: ADMIN only

**Borrowing:**
- Borrow/Return buttons: All authenticated users
- Active borrow indicator: Book owner

## Role Badge Colors

- **ADMIN**: Red badge (`bg-red-100 text-red-800`)
- **LIBRARIAN**: Blue badge (`bg-blue-100 text-blue-800`)
- **MEMBER**: Green badge (`bg-green-100 text-green-800`)

## Security Notes

1. **Double Verification**: All sensitive operations verified on both frontend (UX) and backend (security)
2. **Graceful Degradation**: UI elements hidden for unauthorized users
3. **Middleware Layer**: Route-level protection before reaching handlers
4. **Session-Based**: Roles stored in JWT session, verified on every request
5. **Type-Safe**: TypeScript enums ensure role consistency

## Changing User Roles

Only ADMIN can change roles via database:
```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'user@example.com';
```

Or via Prisma Studio:
```bash
npx prisma studio
```
