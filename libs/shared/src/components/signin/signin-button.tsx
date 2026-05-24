'use client'; // Only needed for App Router

import { signIn } from '../../actions/auth';

export const SignInButton = () => {
  return (
    <form action={signIn}>
      <button type="submit">Continue</button>
    </form>
  );
};
