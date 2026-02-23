import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/api/auth/signin');
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  
  if (!allowedRoles.includes(user.role)) {
    redirect('/unauthorized');
  }
  
  return user;
}

export async function requireAdmin() {
  return requireRole([UserRole.ADMIN]);
}

export async function requireLibrarian() {
  return requireRole([UserRole.ADMIN, UserRole.LIBRARIAN]);
}

export function hasRole(userRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(userRole);
}

export function isAdmin(userRole: UserRole): boolean {
  return userRole === UserRole.ADMIN;
}

export function isLibrarian(userRole: UserRole): boolean {
  return userRole === UserRole.LIBRARIAN || userRole === UserRole.ADMIN;
}

export function isMember(userRole: UserRole): boolean {
  return userRole === UserRole.MEMBER;
}
