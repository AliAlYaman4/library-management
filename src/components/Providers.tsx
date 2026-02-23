'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
      <ThemeProvider>
        {children}
        <Toaster
          position="bottom-right"
          richColors
          toastOptions={{
            className:
              'font-sans text-sm border border-border bg-card text-card-foreground shadow-card rounded-xl',
            duration: 3500,
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
