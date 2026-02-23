import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth-utils';
import { UserRole } from '@prisma/client';
import { ThemeToggle } from './ThemeToggle';

export async function Navbar() {
  const user = await getCurrentUser();

  const isAdmin = user?.role === UserRole.ADMIN;
  const isLibrarian = user?.role === UserRole.LIBRARIAN || user?.role === UserRole.ADMIN;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900"
            >
              Library System
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Dashboard
            </Link>
            <Link
              href="/books"
              className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Books
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-900"
              >
                Admin Panel
              </Link>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">{user.name}</span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  user.role === UserRole.ADMIN
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : user.role === UserRole.LIBRARIAN
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {user.role}
                </span>
              </>
            ) : (
              <Link
                href="/api/auth/signin"
                className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
