'use client'; // ← บรรทัดแรกเสมอ
import { useState, useEffect } from 'react';
import type { ExternalItem } from '@/lib/external';
import { useRouter, useSearchParams } from 'next/navigation';
export default function BlogSpaPage() {
    const [items, setItems] = useState<ExternalItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [source, setSource] = useState<'products' | 'news'>('products');
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialSource = searchParams.get('source') === 'news' ? 'news' : 'products'
    function selectSource(s: 'products' | 'news') {
        setSource(s);
        router.replace(`/blog-spa?source=${s}`); // ← ไม่ reload
    }
    useEffect(() => {
        fetch(`/api/aggregate?source=${source}`)
            .then((r) => r.json())
            .then((data: { external: ExternalItem[] }) => {
                setItems(data.external);
                setIsLoading(false);
            });
    }, [source]); // ← ทํางานใหม่ทุกครั้งที่ source เปลี่ยน
    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold text-blue-900 mb-6">
                🧩 Blog Aggregator (SPA)
            </h1>
            {isLoading ? (
                <p className="text-gray-400">กําลังโหลด...</p>
            ) : (
                <>
                    <button onClick={() => setSource('products')}>Products</button>
                    <button onClick={() => setSource('news')}>News</button>
                    <div className="grid grid-cols-2 gap-4">
                        {items.map((item) => (
                            <div key={item.id} className="p-4 bg-white rounded-lg border">
                                <h2 className="font-bold text-blue-800">{item.title}</h2>
                                <p className="text-gray-500 text-sm">{item.subtitle}</p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}