import { NextRequest, NextResponse } from 'next/server';

import {
  fetchExternal,
  type ExternalItem,
} from '@/lib/external';

type Source = 'products' | 'news';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sourceParam = searchParams.get('source');

  const source: Source =
    sourceParam === 'news' ? 'news' : 'products';

  try {
    const external: ExternalItem[] =
      await fetchExternal(source);

    return NextResponse.json({
      source,
      external,
    });
  } catch (error) {
    console.error('Aggregate API error:', error);

    return NextResponse.json(
      {
        source,
        external: [],
        error:
          error instanceof Error
            ? error.message
            : 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
      },
      {
        status: 500,
      },
    );
  }
}