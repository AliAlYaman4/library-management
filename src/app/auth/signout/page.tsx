'use client';

import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Library, LogOut, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SignOutPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'confirming' | 'signing-out' | 'success'>('confirming');

  const handleSignOut = async () => {
    setStatus('signing-out');
    
    try {
      await signOut({ redirect: false });
      setStatus('success');
      
      // Redirect after a brief delay to show success state
      setTimeout(() => {
        router.push('/auth/signin');
      }, 1500);
    } catch (error) {
      console.error('Sign out error:', error);
      // Still redirect even if there's an error
      router.push('/auth/signin');
    }
  };

  const handleCancel = () => {
    router.back();
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
          <h1 className="text-xl font-bold text-foreground tracking-tight">
            {status === 'success' ? 'See you soon!' : 'Sign Out'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {status === 'confirming' && 'Are you sure you want to sign out?'}
            {status === 'signing-out' && 'Signing you out...'}
            {status === 'success' && 'You have been signed out successfully'}
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          {status === 'confirming' && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                <LogOut className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-foreground font-medium">
                  You'll need to sign in again to access your account
                </p>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleSignOut}
                  variant="destructive"
                  className="w-full gap-2"
                  size="lg"
                >
                  <LogOut className="h-4 w-4" />
                  Yes, Sign Out
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {status === 'signing-out' && (
            <div className="py-8 text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Signing you out securely...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="py-8 text-center animate-scale-in">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
                <CheckCircle2 className="h-8 w-8 text-success" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Successfully signed out
              </p>
              <p className="text-xs text-muted-foreground">
                Redirecting to sign in page...
              </p>
            </div>
          )}
        </div>

        {/* Footer message */}
        {status === 'confirming' && (
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Your session will be ended and you'll be redirected to the sign in page
          </p>
        )}
      </div>
    </div>
  );
}
