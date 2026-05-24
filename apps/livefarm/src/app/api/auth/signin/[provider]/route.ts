import { type NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(): Promise<Response> {
  return NextResponse.json(
    { message: 'Authentication is disabled.' },
    { status: 404 }
  );
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ provider?: string }> },
): Promise<Response> {
  const { provider } = await context.params;

  return NextResponse.json(
    { message: `Provider "${provider ?? 'unknown'}" is disabled.` },
    { status: 404 }
  );
}