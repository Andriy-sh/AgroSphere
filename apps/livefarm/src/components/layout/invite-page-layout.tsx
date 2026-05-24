'use client';

import { LeftShowcase } from '@@agrosphere/shared';

export function InvitePageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="page-wrapper-invite">
      <div className="left-side-invite">
        <LeftShowcase />
      </div>
      <div className="right-side-invite">{children}</div>
    </div>
  );
}
