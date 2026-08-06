// app/posts/[id]/page.tsx

import Link from "next/link";
import type { Metadata, ResolvingMetadata } from "next";

interface Post {
  id: number;
  title: string;
  body: string;
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function getPost(id: string): Promise<Post> {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("ไม่พบบทความ");
  }

  return res.json();
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);

  return {
    title: post.title,
    description: post.body.slice(0, 160),
  };
}

export default async function PostDetail({
  params,
}: Props) {
  const { id } = await params;
  const post = await getPost(id);

  return (
    <main className="p-12">
      <Link
        href="/posts"
        className="text-blue-600 hover:underline"
      >
        ← กลับหน้าบทความ
      </Link>

      <article className="mt-6">
        <p className="text-gray-500 mb-2">
          บทความ #{post.id}
        </p>

        <h1 className="text-3xl font-bold text-blue-900">
          {post.title}
        </h1>

        <p className="mt-4 text-gray-700">
          {post.body}
        </p>
      </article>
    </main>
  );
}