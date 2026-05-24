import { NextRequest, NextResponse } from 'next/server';
import type { UpdateFieldDto } from '@@agrosphere/shared';
import { eosdaServerClient } from '@/lib/eosdaServerClient';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ field_id: string }> }
) {
  try {
    const fieldData: UpdateFieldDto = await request.json();

    const { field_id } = await params;

    const response = await eosdaServerClient.patch(
      `/field-management/${field_id}`,
      fieldData
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
