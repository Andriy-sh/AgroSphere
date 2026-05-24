'use client';

import React from 'react';
import Link from 'next/link';
import { InvitePageLayout } from '@/components/layout/invite-page-layout';
import { Logo } from '@@agrosphere/shared';
import { BusinessInfoForm } from './components/business-info-form';

export function BusinessProfile() {
  return (
    <InvitePageLayout>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 text-basic-black overflow-y-auto">
        <div className=" w-full max-w-xl bg-white rounded-xl border border-basic-white p-6">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center">
                <Logo width={32} height={32} />
              </div>
              <h1 className="text-[28px] font-semibold text-center">
                Add your business details!
              </h1>
              <p className="text-sm text-center text-basic-black">
                Already have an organisation?{' '}
                <Link
                  href="/organisation-selection"
                  className="text-basic-green font-medium no-underline hover:underline"
                >
                  Select organisation
                </Link>
              </p>
            </div>
            <BusinessInfoForm />
          </div>
        </div>
      </div>
    </InvitePageLayout>
  );
}
