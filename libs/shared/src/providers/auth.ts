import { NextResponse } from 'next/server';

export interface AppSession {
  accessToken?: string;
}

type Handler = (request: Request) => Response | Promise<Response>;

export const handlers: { GET: Handler; POST: Handler } = {
  GET: async () =>
    NextResponse.json(
      { message: 'Authentication is disabled in this environment.' },
      { status: 404 }
    ),
  POST: async () =>
    NextResponse.json(
      { message: 'Authentication is disabled in this environment.' },
      { status: 404 }
    ),
};

export const auth = async (): Promise<AppSession | null> => {
  return {};
};

export const signIn = async (): Promise<never> => {
  throw new Error('Sign-in is disabled because authentication is turned off.');
};

export const signOut = async (): Promise<void> => {
  return;
};
