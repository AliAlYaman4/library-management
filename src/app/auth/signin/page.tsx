'use client';

import { signIn } from 'next-auth/react';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Library, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const inputClass = [
  'w-full h-10 px-3 rounded-lg text-sm',
  'border border-input bg-background text-foreground placeholder:text-muted-foreground/50',
  'focus:outline-none focus:ring-2 focus:ring-ring/60 focus:border-transparent',
  'shadow-xs focus:shadow-ring-focus',
  'transition-[border-color,box-shadow] duration-200 ease-smooth',
].join(' ');

function SignInForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [email, setEmail] = useState('admin@library.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  const handleQuickLogin = async (role: 'admin' | 'librarian' | 'member') => {
    const credentials = {
      admin: { email: 'admin@library.com', password: 'admin123' },
      librarian: { email: 'librarian@library.com', password: 'librarian123' },
      member: { email: 'member@library.com', password: 'member123' },
    };

    const { email: quickEmail, password: quickPassword } = credentials[role];
    setEmail(quickEmail);
    setPassword(quickPassword);
    setError('');
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: quickEmail,
        password: quickPassword,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        window.location.href = callbackUrl;
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      {/* Dot-grid background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/0.07)_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="w-full max-w-sm animate-slide-up">
        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary shadow-xs mb-4 transition-transform duration-300 ease-spring hover:scale-105">
            <Library className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to your LibraryOS account</p>
        </div>

        {/* Quick login demo buttons */}
        <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-xs font-semibold text-primary mb-3 flex items-center gap-1.5">
            <AlertCircle className="h-3 w-3" />
            Demo Quick Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('admin')}
              disabled={loading}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:border-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Admin
            </button>
            <button
              onClick={() => handleQuickLogin('librarian')}
              disabled={loading}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:border-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Librarian
            </button>
            <button
              onClick={() => handleQuickLogin('member')}
              disabled={loading}
              className="rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:border-primary/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Member
            </button>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2.5 animate-fade-in">
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={inputClass}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-3 text-[11px] text-muted-foreground">or continue with</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            type="button"
            variant="outline"
            className="w-full gap-2.5"
          >
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google
          </Button>
        </div>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/auth/signup"
            className="font-medium text-primary hover:text-primary/80 transition-colors duration-100"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
