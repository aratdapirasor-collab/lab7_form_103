'use client';

import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react';

import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import type { ExternalItem } from '@/lib/external';

type Source = 'products' | 'news';

function BlogSpaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sourceFromUrl: Source =
    searchParams.get('source') === 'news'
      ? 'news'
      : 'products';

  const keywordFromUrl =
    searchParams.get('q') ?? '';

  const selectedIdFromUrl =
    searchParams.get('item');

  const [source, setSource] =
    useState<Source>(sourceFromUrl);

  const [keyword, setKeyword] =
    useState<string>(keywordFromUrl);

  const [selectedId, setSelectedId] =
    useState<string | null>(selectedIdFromUrl);

  const [items, setItems] =
    useState<ExternalItem[]>([]);

  const [isLoading, setIsLoading] =
    useState<boolean>(true);

  const [error, setError] =
    useState<string>('');

  const [retryCount, setRetryCount] =
    useState<number>(0);

  /*
   * เปลี่ยนข้อมูลในหน้าให้ตรงกับ URL
   * เมื่อกดย้อนกลับหรือเดินหน้าในเบราว์เซอร์
   */
  useEffect(() => {
    setSource(sourceFromUrl);
    setKeyword(keywordFromUrl);
    setSelectedId(selectedIdFromUrl);
  }, [
    sourceFromUrl,
    keywordFromUrl,
    selectedIdFromUrl,
  ]);

  /*
   * โหลดข้อมูลเมื่อเปลี่ยนหมวด
   * หรือเมื่อกดปุ่มลองใหม่
   */
  useEffect(() => {
    const controller = new AbortController();

    async function loadItems() {
      setIsLoading(true);
      setError('');
      setItems([]);

      try {
        const response = await fetch(
          `/api/aggregate?source=${source}`,
          {
            signal: controller.signal,
          },
        );

        const data: {
          source?: Source;
          external?: ExternalItem[];
          error?: string;
        } = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              'ไม่สามารถโหลดข้อมูลได้',
          );
        }

        setItems(data.external ?? []);
      } catch (fetchError) {
        if (
          fetchError instanceof Error &&
          fetchError.name === 'AbortError'
        ) {
          return;
        }

        console.error(fetchError);

        setError(
          fetchError instanceof Error
            ? fetchError.message
            : 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
        );

        setItems([]);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadItems();

    return () => {
      controller.abort();
    };
  }, [source, retryCount]);

  /*
   * กรองข้อมูลจากรายการที่โหลดมาแล้ว
   * จึงไม่เรียก API ใหม่ตอนพิมพ์ค้นหา
   */
  const filteredItems = useMemo(() => {
    const searchText =
      keyword.trim().toLowerCase();

    if (searchText === '') {
      return items;
    }

    return items.filter((item) => {
      const title =
        item.title?.toLowerCase() ?? '';

      const subtitle =
        item.subtitle?.toLowerCase() ?? '';

      return (
        title.includes(searchText) ||
        subtitle.includes(searchText)
      );
    });
  }, [items, keyword]);

  /*
   * หารายการที่ผู้ใช้กดเลือก
   */
  const selectedItem = useMemo(() => {
    if (selectedId === null) {
      return null;
    }

    return (
      items.find(
        (item) =>
          String(item.id) === selectedId,
      ) ?? null
    );
  }, [items, selectedId]);

  /*
   * สร้าง URL จากค่าปัจจุบัน
   */
  function createUrl(
    nextSource: Source,
    nextKeyword: string,
    nextSelectedId: string | null,
  ) {
    const params = new URLSearchParams();

    params.set('source', nextSource);

    if (nextKeyword.trim() !== '') {
      params.set('q', nextKeyword);
    }

    if (nextSelectedId !== null) {
      params.set('item', nextSelectedId);
    }

    return `/blog-spa?${params.toString()}`;
  }

  /*
   * เปลี่ยนหมวดสินค้าและข่าว
   */
  function selectSource(nextSource: Source) {
    setSource(nextSource);
    setSelectedId(null);

    router.push(
      createUrl(nextSource, keyword, null),
    );
  }

  /*
   * ค้นหาข้อมูล
   */
  function handleSearch(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const nextKeyword = event.target.value;

    setKeyword(nextKeyword);
    setSelectedId(null);

    router.replace(
      createUrl(source, nextKeyword, null),
    );
  }

  /*
   * เปิดรายละเอียด
   */
  function openDetail(itemId: string) {
    setSelectedId(itemId);

    router.push(
      createUrl(source, keyword, itemId),
    );
  }

  /*
   * ปิดรายละเอียด
   */
  function closeDetail() {
    setSelectedId(null);

    router.push(
      createUrl(source, keyword, null),
    );
  }

  /*
   * ล้างคำค้นหา
   */
  function clearSearch() {
    setKeyword('');
    setSelectedId(null);

    router.replace(
      createUrl(source, '', null),
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-blue-900">
          Blog Aggregator
        </h1>

        <p className="mb-6 text-gray-500">
          ค้นหาและดูรายละเอียดโดยไม่ต้องโหลดหน้าใหม่
        </p>

        {/* ปุ่มเลือกหมวด */}
        <div className="mb-6 flex gap-3">
          <button
            type="button"
            onClick={() =>
              selectSource('products')
            }
            className={`rounded-lg px-5 py-2 font-medium transition ${
              source === 'products'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 shadow-sm hover:bg-gray-100'
            }`}
          >
            สินค้า
          </button>

          <button
            type="button"
            onClick={() =>
              selectSource('news')
            }
            className={`rounded-lg px-5 py-2 font-medium transition ${
              source === 'news'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 shadow-sm hover:bg-gray-100'
            }`}
          >
            ข่าว
          </button>
        </div>

        {/* ช่องค้นหา */}
        <div className="mb-6">
          <label
            htmlFor="search"
            className="mb-2 block font-medium text-gray-700"
          >
            ค้นหารายการ
          </label>

          <input
            id="search"
            type="search"
            value={keyword}
            onChange={handleSearch}
            placeholder="พิมพ์ชื่อหรือรายละเอียด..."
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />

          {!isLoading && !error && (
            <p className="mt-2 text-sm text-gray-500">
              พบ {filteredItems.length} รายการ
            </p>
          )}
        </div>

        {/* กำลังโหลด */}
        {isLoading && (
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

            <p className="text-gray-500">
              กำลังโหลดข้อมูล...
            </p>
          </div>
        )}

        {/* เกิดข้อผิดพลาด */}
        {!isLoading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="text-lg font-bold text-red-700">
              เกิดข้อผิดพลาด
            </h2>

            <p className="mt-2 text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                setRetryCount(
                  (count) => count + 1,
                )
              }
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
            >
              ลองใหม่
            </button>
          </div>
        )}

        {/* ไม่มีข้อมูลจาก API */}
        {!isLoading &&
          !error &&
          items.length === 0 && (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <p className="font-medium text-gray-700">
                ไม่มีข้อมูลในหมวดนี้
              </p>
            </div>
          )}

        {/* ค้นหาแล้วไม่พบ */}
        {!isLoading &&
          !error &&
          items.length > 0 &&
          filteredItems.length === 0 && (
            <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
              <p className="font-medium text-gray-700">
                ไม่พบผลการค้นหา “{keyword}”
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-4 rounded-lg bg-gray-200 px-5 py-2 text-gray-800 hover:bg-gray-300"
              >
                ล้างคำค้นหา
              </button>
            </div>
          )}

        {/* รายการสินค้าและข่าว */}
        {!isLoading &&
          !error &&
          filteredItems.length > 0 && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredItems.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() =>
                    openDetail(String(item.id))
                  }
                  className="overflow-hidden rounded-xl border bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
                >
                  {/* แสดงรูปสินค้าจาก API */}
                  {item.image ? (
                    <div className="flex h-56 items-center justify-center bg-white p-5">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  ) : (
                    /*
                     * ข่าวจาก Hacker News ไม่มีรูป
                     * จึงแสดงกล่องแทนรูป
                     */
                    <div className="flex h-44 items-center justify-center bg-blue-50 text-5xl">
                      📰
                    </div>
                  )}

                  <div className="p-5">
                    <h2 className="line-clamp-2 text-lg font-bold text-blue-900">
                      {item.title}
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                      {item.subtitle ||
                        'ไม่มีรายละเอียด'}
                    </p>

                    <span className="mt-4 inline-block text-sm font-medium text-blue-600">
                      ดูรายละเอียด →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
      </div>

      {/* หน้าต่างรายละเอียด */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50">
          <button
            type="button"
            aria-label="ปิดรายละเอียด"
            onClick={closeDetail}
            className="absolute inset-0 cursor-default"
          />

          <aside className="relative z-10 h-full w-full max-w-lg overflow-y-auto bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-900">
                รายละเอียด
              </h2>

              <button
                type="button"
                onClick={closeDetail}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                ปิด
              </button>
            </div>

            {/* รูปในหน้ารายละเอียด */}
            {selectedItem.image ? (
              <div className="mb-6 flex h-72 items-center justify-center rounded-xl border bg-white p-6">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="h-full w-full object-contain"
                />
              </div>
            ) : (
              <div className="mb-6 flex h-52 items-center justify-center rounded-xl bg-blue-50 text-7xl">
                📰
              </div>
            )}

            <p className="mb-2 text-sm font-medium text-blue-600">
              {source === 'products'
                ? 'สินค้า'
                : 'ข่าว'}
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              {selectedItem.title}
            </h3>

            <p className="mt-4 leading-7 text-gray-600">
              {selectedItem.subtitle ||
                'ไม่มีรายละเอียดเพิ่มเติม'}
            </p>

            <p className="mt-8 text-xs text-gray-400">
              รหัสรายการ: {selectedItem.id}
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}

export default function BlogSpaPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-50 p-8">
          <div className="mx-auto max-w-6xl rounded-xl bg-white p-10 text-center">
            <p className="text-gray-500">
              กำลังเตรียมหน้า...
            </p>
          </div>
        </main>
      }
    >
      <BlogSpaContent />
    </Suspense>
  );
}