import Link from 'next/link';
import { ShieldX, LayoutDashboard, BookOpen } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(hsl(var(--primary)/0.04)_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="max-w-sm w-full text-center animate-slide-up">
        <div className="mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20 mb-5">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <p className="text-5xl font-black text-destructive/20 tracking-tighter mb-2">403</p>
          <h1 className="text-xl font-bold text-foreground">Access Denied</h1>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            You don&apos;t have permission to access this page. Contact an administrator if you
            think this is a mistake.
          </p>
        </div>

        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <LayoutDashboard className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <Link
            href="/books"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-all active:scale-[0.98]"
          >
            <BookOpen className="h-4 w-4" />
            Browse Books
          </Link>
        </div>
      </div>
    </div>
  );
}
