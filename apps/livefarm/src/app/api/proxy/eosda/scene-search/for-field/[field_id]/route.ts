import { NextRequest, NextResponse } from 'next/server';
import type { SceneSearchRequest } from '@@agrosphere/shared';
import { eosdaServerClient } from '@/lib/eosdaServerClient';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ field_id: string }> }
) {
  try {
    const { field_id } = await params;
    const body: SceneSearchRequest = await request.json();

    const response = await eosdaServerClient.post(
      `/scene-search/for-field/${field_id}`,
      body
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const errorObj = error as { status?: number; data?: unknown };
    return new NextResponse(JSON.stringify(errorObj.data), {
      status: errorObj.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
