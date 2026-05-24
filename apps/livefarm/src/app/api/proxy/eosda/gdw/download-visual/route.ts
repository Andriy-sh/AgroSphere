import { NextRequest, NextResponse } from 'next/server';
import type { DownloadVisualRequest } from '@@agrosphere/shared';
import { eosdaServerClient } from '@/lib/eosdaServerClient';

export async function POST(request: NextRequest) {
  try {
    const body: DownloadVisualRequest = await request.json();

    const response = await eosdaServerClient.post('/api/gdw/api', body);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const errorObj = error as { status?: number; data?: unknown };
    return new NextResponse(JSON.stringify(errorObj.data), {
      status: errorObj.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

