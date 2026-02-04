'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, isTokenValid } from '@/lib/auth';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthed =
    typeof window !== 'undefined' && isTokenValid(getToken());

  useEffect(() => {
    if (!isAuthed) {
      router.replace('/admin/login');
      return;
    }
  }, [router, isAuthed]);

  if (!isAuthed) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-sm text-gray-500">Yükleniyor...</div>
      </div>
    );
  }

  return <>{children}</>;
}
