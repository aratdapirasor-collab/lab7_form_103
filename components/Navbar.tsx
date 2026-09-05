'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const links = [
  { href: '/posts', label: 'บทความ' },
  { href: '/users', label: 'ผู้ใช้' },
  { href: '/about', label: 'เกี่ยวกับ' },
  { href: '/contact', label: 'ติดต่อ' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  async function fetchSession() {
    try {
      const res = await fetch('/api/session', {
        method: 'GET',
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('ไม่สามารถอ่านสถานะเซสชัน');
      }

      const data = await res.json();
      setLoggedIn(Boolean(data.loggedIn));
    } catch {
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchSession();
  }, [pathname]);

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, []);

  async function handleLogout() {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
    } catch {
      // ถ้า API logout มีปัญหา ก็ยังเปลี่ยนสถานะหน้าเว็บ
    }

    setLoggedIn(false);
    router.push('/');
    router.refresh();
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-4 py-4 shadow-sm backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/"
            className="text-xl font-semibold tracking-wide text-slate-900 transition-colors hover:text-blue-600"
          >
            My Blog
          </Link>

          <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
            {links.map((link) => {
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-blue-600 ${isActive ? 'text-blue-600' : 'text-slate-600'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            Login
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}