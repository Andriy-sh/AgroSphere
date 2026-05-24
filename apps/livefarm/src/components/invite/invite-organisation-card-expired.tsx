'use client';

import { useRouter } from 'next/navigation';
import { InvitePageLayout } from '@/components/layout/invite-page-layout';
import { Logo, Button } from '@@agrosphere/shared';

export default function InviteOrganisationCardExpired() {
  const router = useRouter();
  const email = 'anna@greenmark.io';

  return (
    <InvitePageLayout>
      <div className="flex flex-col items-center justify-center w-full h-full p-7 text-basic-black overflow-y-auto">
        <div className="w-full max-w-xl bg-white rounded-xl border border-basic-white p-7">
          <div className="flex flex-col items-center">
            <Logo width={32} height={32} className="mb-6" />
            <h1 className="text-[28px] font-semibold mb-2 text-center">
              Invitation link expired!
            </h1>
            <div className="flex flex-col items-center w-full text-sm text-center">
              <p className="mb-8">
                This invitation link is no longer valid. Please contact the
                person who invited you —{' '}
                <a
                  href={`mailto:${email}`}
                  className="text-basic-green font-medium"
                >
                  {email}
                </a>{' '}
                — to request a new link.
              </p>
              <Button
                className="w-full"
                onClick={() => {
                  router.push('/sign-in');
                }}
              >
                Go to sign in
              </Button>
            </div>
          </div>
        </div>
      </div>
    </InvitePageLayout>
  );
}
