import { NextResponse } from 'next/server';

export async function GET(): Promise<Response> {
  return NextResponse.json(
    { message: 'Authentication is disabled.' },
    { status: 404 }
  );
}

export async function POST(): Promise<Response> {
  return NextResponse.json(
    { message: 'Authentication is disabled.' },
    { status: 404 }
  );
}