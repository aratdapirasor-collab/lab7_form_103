// app/page.tsx
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'หน้าแรก',
};

interface Post {
  id: number;
  title: string;
  body: string;
}

async function getRecentPosts(): Promise<Post[]> {
  const res = await fetch(
    'https://jsonplaceholder.typicode.com/posts?_limit=3',
    { cache: 'no-store' }
  );

  return res.json();
}

export default async function Home() {
  const posts: Post[] = await getRecentPosts();

  return (
    <div>
      <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-[0_28px_70px_-30px_rgba(37,99,235,0.4)] sm:p-12">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold uppercase tracking-[0.3em] text-sky-700">
              บล็อกโพสต์
            </span>

            <h1 className="mt-6 text-5xl font-semibold tracking-tight text-slate-900 sm:text-6xl">
              บันทึกเรื่องเล่าดิจิทัลในสไตล์โมเดิร์น
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              บล็อกส่วนตัวของ <strong>อารัตฎา ปิระซอ</strong>{' '}
              ที่ออกแบบด้วยโทนสีเย็นสบายตา ฟอนต์ชัดเจน และ layout
              ที่อ่านง่ายสำหรับทุกบทความ
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/posts"
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/10 transition hover:bg-blue-700"
              >
                อ่านบทความ →
              </Link>

              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
              >
                เกี่ยวกับเรา
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-gradient-to-br from-slate-50 via-sky-50 to-white p-6 shadow-inner shadow-slate-200/50">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                บทความล่าสุด
              </h2>

              <div className="mt-6 space-y-4">
                {posts.map((post: Post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="block rounded-3xl border border-slate-200 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-white"
                  >
                    <h3 className="font-semibold text-slate-900">
                      {post.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {post.body.slice(0, 80)}...
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* L2 Preview Deployment Test */}
        <p className="mt-8 text-center text-sm font-semibold text-sky-600">
          Preview Deployment Test
        </p>
      </section>
    </div>
  );
}