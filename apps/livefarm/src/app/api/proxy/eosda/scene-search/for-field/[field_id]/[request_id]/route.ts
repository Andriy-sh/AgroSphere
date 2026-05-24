import { NextRequest, NextResponse } from 'next/server';
import { eosdaServerClient } from '@/lib/eosdaServerClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ field_id: string; request_id: string }> }
) {
  try {
    const { field_id, request_id } = await params;

    const response = await eosdaServerClient.get(
      `/scene-search/for-field/${field_id}/${request_id}`
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

