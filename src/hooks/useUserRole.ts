'use client';

import { useSession } from 'next-auth/react';
import { UserRole } from '@prisma/client';

export function useUserRole() {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = !!session?.user;
  const role = session?.user?.role;

  const isAdmin = role === UserRole.ADMIN;
  const isLibrarian = role === UserRole.LIBRARIAN || role === UserRole.ADMIN;
  const isMember = role === UserRole.MEMBER;

  const canManageBooks = isAdmin || role === UserRole.LIBRARIAN;
  const canDeleteBooks = isAdmin;
  const canManageUsers = isAdmin;
  const canBorrowBooks = isAuthenticated;

  return {
    isLoading,
    isAuthenticated,
    role,
    isAdmin,
    isLibrarian,
    isMember,
    canManageBooks,
    canDeleteBooks,
    canManageUsers,
    canBorrowBooks,
  };
}
