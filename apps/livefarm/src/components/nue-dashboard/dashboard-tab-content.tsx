'use client';

import { type TabId, type TimePeriod } from './dashboard-tabs';
import { OverviewContent } from './tabs/overview/overview-content';
import { FieldPerformanceContent } from './tabs/field-performance/field-performance-content';
import { TrendsContent } from './tabs/trends/trends-content';

interface DashboardTabContentProps {
  activeTab: TabId;
  timePeriod: TimePeriod;
  customStartDate?: string;
  customEndDate?: string;
  hasNoData?: boolean;
}

export function DashboardTabContent({
  activeTab,
  timePeriod,
  customStartDate,
  customEndDate,
  hasNoData = false,
}: DashboardTabContentProps) {
  if (hasNoData) {
    return (
      <div className="p-5">
        <div className="w-full min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-basic-gray text-xl font-medium mb-2">
              No data available
            </p>
            <p className="text-basic-gray text-sm">
              Please select a different time period to view data
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <OverviewContent
            timePeriod={timePeriod}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
        )}
        {activeTab === 'field-performance' && (
          <FieldPerformanceContent
            timePeriod={timePeriod}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
        )}
        {activeTab === 'trends' && (
          <TrendsContent
            timePeriod={timePeriod}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
          />
        )}
      </div>
    </div>
  );
}
