'use client';

import { useEffect } from 'react';
import { clearAuthData } from '@@agrosphere/shared';
import { useRouter } from 'next/navigation';

export default function LogoutCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear local auth data (localStorage, cookies)
    clearAuthData();

    router.replace('/');
    router.refresh();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600">Signing out...</p>
      </div>
    </div>
  );
}
