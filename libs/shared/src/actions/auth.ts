'use server';

import { redirect } from 'next/navigation';

export const signIn = async (): Promise<never> => {
  redirect('/');
};

export const signOut = async (): Promise<never> => {
  redirect('/');
};
