import { AppLayout } from '@/components/layout/AppLayout';
import { SessionRefresh } from '@/components/SessionRefresh';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
      <SessionRefresh />
      {children}
    </AppLayout>
  );
}
