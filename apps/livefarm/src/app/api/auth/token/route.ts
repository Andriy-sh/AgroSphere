import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { AUTH_TOKEN_KEY } from '@@agrosphere/shared';

export async function GET(request: NextRequest) {
  const token =
    request.cookies.get(AUTH_TOKEN_KEY)?.value ??
    request.headers.get('authorization')?.replace(/^Bearer\s+/i, '') ??
    null;

  if (!token) {
    return NextResponse.json({ error: 'Token not found' }, { status: 401 });
  }

  return NextResponse.json({
    accessToken: token,
    user: {},
  });
}