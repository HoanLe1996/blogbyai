'use client';

import { signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function SignOutPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Đăng xuất
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Bạn có chắc chắn muốn đăng xuất?
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
          <button
            onClick={handleSignOut}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : 'Đăng xuất'}
          </button>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto text-center px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-200 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Hủy
          </Link>
        </div>
      </div>
    </div>
  );
}