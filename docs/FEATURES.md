# Creative Features Documentation

## 🎯 Overview

This document describes the advanced features added to the Library Management System, including penalties, analytics, activity logging, CSV exports, and dark mode.

---

## 💰 Late Return Penalty System

### Configuration
Located in `src/lib/penalties.ts`:
- **Daily Rate**: $0.50 per day late
- **Maximum Penalty**: $25.00
- **Grace Period**: 0 days
- **Loan Period**: 14 days (2 weeks)

### How It Works
1. **Due Date Calculation**: Automatically set to 14 days from borrow date
2. **Penalty Calculation**: $0.50/day after due date, capped at $25
3. **Tracking**: Stored in `BorrowRecord` table with `daysLate` and `penalty` fields
4. **User Totals**: Accumulated in `User.totalPenalty` field

### Database Fields
```prisma
model BorrowRecord {
  dueDate    DateTime
  daysLate   Int      @default(0)
  penalty    Float    @default(0)
}

model User {
  totalPenalty Float @default(0)
}
```

### API Integration
Penalties are automatically calculated when:
- Books are returned late
- Overdue reports are generated
- User accounts are reviewed

---

## 📊 Analytics Dashboard

### Access
**URL**: `/admin/analytics`  
**Permission**: ADMIN only

### Metrics Tracked

#### Overview Statistics
- Total books in library
- Total registered users
- Total borrow transactions
- Currently active borrows
- Overdue books count
- Total penalties collected

#### Book Popularity
- **View Count**: Tracks page views per book
- **Borrow Count**: Tracks total borrows per book
- **Trending**: Top 10 most borrowed books
- **Rankings**: Sorted by popularity

#### User Activity
- Most active borrowers
- Borrow frequency
- User engagement metrics

#### Genre Distribution
- Books per genre
- Visual percentage breakdown
- Collection balance insights

### Database Fields
```prisma
model Book {
  viewCount   Int @default(0)
  borrowCount Int @default(0)
}
```

### API Endpoints
- `GET /api/analytics?type=overview` - System overview
- `GET /api/analytics?type=trends&days=30` - Borrowing trends
- `GET /api/analytics?type=penalties` - Penalty report

---

## 📝 Admin Activity Logs

### What's Logged
All administrative actions are tracked:
- `BOOK_CREATED` - New book added
- `BOOK_UPDATED` - Book details modified
- `BOOK_DELETED` - Book removed
- `BOOK_BORROWED` - Book checked out
- `BOOK_RETURNED` - Book returned
- `USER_ROLE_CHANGED` - User permissions modified
- `PENALTY_APPLIED` - Late fee assessed

### Log Structure
```prisma
model ActivityLog {
  userId      String
  action      ActivityType
  entityType  String
  entityId    String?
  details     String?
  ipAddress   String?
  createdAt   DateTime
}
```

### Viewing Logs
**URL**: `/admin/activity`  
**API**: `GET /api/activity`

**Filters**:
- By user: `?userId=xxx`
- By action: `?action=BOOK_CREATED`
- Limit results: `?limit=100`

### Implementation
```typescript
import { logActivity } from '@/lib/activity-logger';

await logActivity({
  userId: user.id,
  action: 'BOOK_CREATED',
  entityType: 'Book',
  entityId: book.id,
  details: `Created book: ${book.title}`,
  ipAddress: req.ip,
});
```

---

## 📥 CSV Export Functionality

### Available Exports

#### 1. Books Export
**Endpoint**: `GET /api/export?type=books`  
**Permission**: LIBRARIAN+  
**Fields**: id, title, author, genre, publishedYear, totalCopies, availableCopies, borrowCount, viewCount, createdAt

#### 2. Borrow Records Export
**Endpoint**: `GET /api/export?type=borrows`  
**Permission**: LIBRARIAN+  
**Fields**: id, userId, bookId, borrowedAt, dueDate, returnedAt, daysLate, penalty

#### 3. Users Export
**Endpoint**: `GET /api/export?type=users`  
**Permission**: ADMIN only  
**Fields**: id, email, name, role, totalPenalty, createdAt

#### 4. Activity Logs Export
**Endpoint**: `GET /api/export?type=activity`  
**Permission**: ADMIN only  
**Fields**: id, userId, action, entityType, entityId, details, createdAt  
**Limit**: Last 1000 records

### Usage
```typescript
// Client-side download
const downloadCSV = async (type: string) => {
  const response = await fetch(`/api/export?type=${type}`);
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}_${new Date().toISOString()}.csv`;
  a.click();
};
```

### File Naming
Format: `{type}_{YYYY-MM-DD}.csv`  
Example: `books_2026-02-23.csv`

---

## 🌓 Dark Mode

### Features
- **System Preference Detection**: Automatically detects OS theme
- **Manual Toggle**: User can override with theme switcher
- **Persistent**: Choice saved in localStorage
- **Smooth Transitions**: CSS transitions for theme changes
- **Full Coverage**: All pages and components support dark mode

### Implementation

#### Tailwind Configuration
```typescript
// tailwind.config.ts
{
  darkMode: 'class',
  // ...
}
```

#### Theme Provider
```typescript
// src/contexts/ThemeContext.tsx
const [theme, setTheme] = useState<'light' | 'dark'>('light');

useEffect(() => {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(stored || (prefersDark ? 'dark' : 'light'));
}, []);
```

#### Usage in Components
```tsx
// Dark mode classes
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
```

### Theme Toggle
Located in Navbar, accessible to all users.

**Icon States**:
- Light mode: Moon icon
- Dark mode: Sun icon

---

## 🔄 Database Migration

After adding these features, run:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_creative_features

# Or for production
npx prisma migrate deploy
```

---

## 📈 Performance Considerations

### Indexing
New indexes added for performance:
- `Book.borrowCount` - For popularity sorting
- `Book.viewCount` - For analytics
- `BorrowRecord.dueDate` - For overdue queries
- `ActivityLog.action` - For filtering logs
- `ActivityLog.createdAt` - For chronological sorting

### Caching Recommendations
Consider caching:
- Analytics overview (5-15 minutes)
- Popular books list (1 hour)
- Genre distribution (1 hour)

### Query Optimization
- Use `select` to fetch only needed fields
- Implement pagination for large datasets
- Use database aggregations for counts

---

## 🔐 Security & Privacy

### Activity Logging
- IP addresses stored for audit trail
- Logs accessible only to ADMIN
- Consider GDPR compliance for user data

### CSV Exports
- Role-based access control enforced
- Sensitive data (passwords) never exported
- Audit log entry created for exports

### Penalties
- Calculations server-side only
- Cannot be manually edited by users
- Admin override capability (future feature)

---

## 🎨 UI/UX Enhancements

### Dark Mode Benefits
- Reduced eye strain
- Battery savings on OLED screens
- Modern aesthetic
- Accessibility improvement

### Analytics Dashboard
- Visual data representation
- Color-coded metrics
- Responsive grid layout
- Export buttons prominently placed

### Activity Logs
- Chronological timeline
- Filterable by type
- User-friendly action names
- Detailed context in tooltips

---

## 🚀 Future Enhancements

### Penalties
- [ ] Email notifications for overdue books
- [ ] Payment integration
- [ ] Penalty waivers/adjustments
- [ ] Automatic reminders before due date

### Analytics
- [ ] Interactive charts (Chart.js/Recharts)
- [ ] Date range filtering
- [ ] Comparison periods
- [ ] Predictive analytics

### Activity Logs
- [ ] Real-time updates (WebSockets)
- [ ] Advanced filtering
- [ ] Export to JSON
- [ ] Retention policies

### Dark Mode
- [ ] Custom color themes
- [ ] Scheduled auto-switching
- [ ] Per-page theme override
- [ ] High contrast mode

---

## 📚 Related Documentation

- [ROLE_BASED_ACCESS.md](ROLE_BASED_ACCESS.md) - Permission system
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production setup
- [README.md](README.md) - General documentation

---

**Last Updated**: February 23, 2026  
**Version**: 1.0.0
