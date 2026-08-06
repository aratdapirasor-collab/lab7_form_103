'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!res.ok) {
        setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
        setLoading(false);
        return;
      }

      router.replace('/dashboard');
      router.refresh();
    } catch (err) {
      setError('เกิดข้อผิดพลาด');
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.16),_transparent_45%)] px-4 py-10">
      <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 shadow-[0_30px_80px_-35px_rgba(37,99,235,0.45)] backdrop-blur-sm">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-7 text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
            My Blog
          </p>
          <h1 className="mt-2 text-3xl font-semibold">
            เข้าสู่ระบบ
          </h1>
          <p className="mt-2 text-sm text-blue-100">
            ใช้บัญชีของคุณเพื่อดู Dashboard และจัดการข้อมูล
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-8">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              อีเมล
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              รหัสผ่าน
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </main>
  );
}