import { NextRequest, NextResponse } from 'next/server';
import type { CreatePKZoningRequest } from '@@agrosphere/shared';
import { eosdaServerClient } from '@/lib/eosdaServerClient';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ field_id: string }> }
) {
  try {
    const { field_id } = await params;
    const body: CreatePKZoningRequest = await request.json();


    // Try without /api prefix first (consistent with other routes)
    const apiPath = `/zoning/${field_id}`;

    const response = await eosdaServerClient.post(apiPath, body);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const errorObj = error as { status?: number; data?: unknown };
    console.error('[P&K Zoning] Error:', errorObj);
    return new NextResponse(JSON.stringify(errorObj.data), {
      status: errorObj.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

