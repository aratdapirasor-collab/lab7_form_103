// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: {
    template: "%s | My Blog",
    default: "My Blog",
  },
  description: "บล็อกส่วนตัว สร้างด้วย Next.js + TypeScript",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),_transparent_30%),_var(--background)]">
          <Navbar />

          <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </main>

          <footer className="border-t border-slate-200 bg-white/90 py-6 text-center text-sm text-slate-500 backdrop-blur-sm">
            <p>© 2026 My Blog — สร้างด้วย Next.js + TypeScript</p>
            <p className="mt-1">0214321 Web App Design & Development · <span className="text-emerald-600 font-medium">✓ Vercel Preview Verified (Lab 12)</span></p>
          </footer>
        </div>
      </body>
    </html>
  );
}