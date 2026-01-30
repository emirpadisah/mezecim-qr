'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { clearToken } from '@/lib/auth';
import AdminGuard from '@/components/AdminGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/admin/login';

  if (isLogin) {
    return <div className="min-h-screen bg-cream">{children}</div>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-cream">
        <header className="bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="font-black text-primary">Mezecim Admin</div>
            <nav className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-primary/60">
              <Link href="/admin" className="px-3 py-2 rounded-full border border-gray-200">
                Ürünler
              </Link>
              <Link href="/admin/analytics" className="px-3 py-2 rounded-full border border-gray-200">
                Analitik
              </Link>
              <Link href="/kitchen" className="px-3 py-2 rounded-full border border-gray-200">
                Mutfak
              </Link>
              <button
                onClick={() => {
                  clearToken();
                  window.location.href = '/admin/login';
                }}
                className="px-3 py-2 rounded-full border border-gray-200"
              >
                Çıkış
              </button>
            </nav>
          </div>
        </header>
        {children}
      </div>
    </AdminGuard>
  );
}
