import { NextRequest, NextResponse } from 'next/server';
import { eosdaServerClient } from '@/lib/eosdaServerClient';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ field_id: string; zmap_id: string }> }
) {
  try {
    const { field_id, zmap_id } = await params;


    // Use the correct path: /zoning/maps/{field_id}/{zmap_id}
    const apiPath = `/zoning/maps/${field_id}/${zmap_id}`;

    const response = await eosdaServerClient.get(apiPath);

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const errorObj = error as { status?: number; data?: unknown };
    return new NextResponse(JSON.stringify(errorObj.data), {
      status: errorObj.status || 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

