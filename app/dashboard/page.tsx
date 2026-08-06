'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function handleLogout() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
    } catch {
      // ignore
    }

    router.replace('/login');
    router.refresh();
  }

  async function loadMessages() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('โหลดข้อมูลไม่สำเร็จ');
      }

      const data = await res.json();

      setMessages(data.messages ?? []);
    } catch {
      setError('ไม่สามารถโหลดข้อความได้');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMessages();
  }, []);

  return (
    <main className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 p-6 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-100">
              Administrator
            </p>
            <h1 className="mt-2 text-3xl font-bold">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-blue-100">
              จัดการข้อความที่ผู้ใช้ส่งเข้ามาในระบบ
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadMessages}
              className="rounded-xl border border-white/30 bg-white/15 px-4 py-2 font-semibold backdrop-blur transition hover:bg-white/25"
            >
              โหลดข้อมูลใหม่
            </button>
          </div>
        </div>

        <div className="mb-6 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              จำนวนข้อความที่ได้รับ
            </p>
            <p className="mt-2 text-4xl font-bold text-slate-900">
              {messages.length}
            </p>
          </div>
          <div className="rounded-xl bg-blue-600 p-4 text-white">
            <p className="text-sm font-semibold text-blue-100">
              สถานะระบบ
            </p>
            <p className="mt-2 font-semibold">
              พร้อมรับข้อความใหม่
            </p>
          </div>
        </div>

        {loading && (
          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-700">
            กำลังโหลดข้อความ...
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
            ยังไม่มีข้อความที่ส่งเข้ามา
          </div>
        )}

        {!loading && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="mb-3 flex flex-wrap justify-between gap-2">
                  <div>
                    <h2 className="font-bold text-slate-900">
                      {item.name}
                    </h2>

                    <p className="text-sm text-slate-600">
                      {item.email}
                    </p>
                  </div>

                  <p className="text-sm text-slate-500">
                    {new Date(item.createdAt).toLocaleString('th-TH')}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4 text-slate-700 whitespace-pre-wrap">
                  {item.message}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}