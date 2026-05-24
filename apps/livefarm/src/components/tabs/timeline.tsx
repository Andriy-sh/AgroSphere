'use client';

import React from 'react';
import { Timeline } from '@@agrosphere/shared';

export function TimelineTab() {
  return (
    <div className="h-full min-h-0 flex flex-col" data-list-container>
      <Timeline />
    </div>
  );
}
