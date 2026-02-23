'use client';

import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="lg:pl-64">
        <TopNav />
        <main className="p-5 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
