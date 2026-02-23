import { AppLayout } from '@/components/layout/AppLayout';

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
