'use client';

import { InvitePageLayout } from '@/components/layout/invite-page-layout';
import { Logo, Button } from '@@agrosphere/shared';

export default function InviteOrganisationCard() {
  return (
    <InvitePageLayout>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 text-basic-black overflow-y-auto">
        <div className="w-full max-w-xl bg-white rounded-xl border border-basic-white p-4">
          <div className="flex flex-col items-center">
            <Logo width={32} height={32} className="mb-6" />
            <h1 className="text-[28px] font-semibold  mb-2 text-center">
              Welcome!
            </h1>
            <div className="flex flex-col items-center w-full text-sm text-center">
              <span className="mb-8">
                Jane Cooper (
                <a
                  href="mailto:jane.cooper@example.com"
                  className="text-basic-green font-medium"
                >
                  jane.cooper@example.com
                </a>
                ) has invited you
                <br />
                to join their <span className="font-medium">
                  GreenMark
                </span>{' '}
                team in LiveFarm.
              </span>
              <Button className="w-full mb-4">Sign up</Button>
              <div className="text-center text-sm ">
                Already have an account?{' '}
                <Button
                  variant="ghost"
                  className="text-sm text-basic-green font-medium hover:underline p-0 m-0 gap-0 h-auto"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </InvitePageLayout>
  );
}
