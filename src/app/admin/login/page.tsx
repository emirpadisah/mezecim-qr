'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDummyJwt, saveToken } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // Basit demo kontrolü: admin / 1234
    if (username === 'admin' && password === '1234') {
      const token = createDummyJwt(username);
      saveToken(token);
      router.replace('/admin');
      return;
    }
    setError('Kullanıcı adı veya şifre hatalı.');
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
      >
        <h1 className="text-2xl font-black text-primary mb-2">Admin Girişi</h1>
        <p className="text-sm text-gray-500 mb-6">Mezecim yönetim paneline giriş.</p>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-primary/50">
              Kullanıcı Adı
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              placeholder="admin"
              autoComplete="username"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase tracking-widest text-primary/50">
              Şifre
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm"
              placeholder="••••"
              autoComplete="current-password"
            />
          </div>
          {error && <div className="text-xs text-red-500">{error}</div>}
          <button className="w-full bg-primary text-white rounded-full py-3 text-xs font-black uppercase tracking-[0.3em]">
            Giriş Yap
          </button>
        </div>
      </form>
    </main>
  );
}
