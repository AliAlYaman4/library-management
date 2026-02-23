import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { UserRole } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

export async function getAuthUser(req: NextRequest) {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireApiAuth(req: NextRequest) {
  const user = await getAuthUser(req);
  
  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      ),
      user: null,
    };
  }
  
  return { error: null, user };
}

export async function requireApiRole(req: NextRequest, allowedRoles: UserRole[]) {
  const { error, user } = await requireApiAuth(req);
  
  if (error) return { error, user: null };
  
  if (!allowedRoles.includes(user!.role)) {
    return {
      error: NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      ),
      user: null,
    };
  }
  
  return { error: null, user };
}

export async function requireApiAdmin(req: NextRequest) {
  return requireApiRole(req, [UserRole.ADMIN]);
}

export async function requireApiLibrarian(req: NextRequest) {
  return requireApiRole(req, [UserRole.ADMIN, UserRole.LIBRARIAN]);
}
