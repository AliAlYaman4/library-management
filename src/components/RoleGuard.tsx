'use client';

import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children, fallback = null }: RoleGuardProps) {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (!session?.user) {
    return <>{fallback}</>;
  }

  if (!allowedRoles.includes(session.user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

export function AdminOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function LibrarianOrAdmin({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN, UserRole.LIBRARIAN]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

export function MemberOnly({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <RoleGuard allowedRoles={[UserRole.MEMBER]} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}
