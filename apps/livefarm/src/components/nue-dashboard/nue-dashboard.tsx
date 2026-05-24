'use client';

import { useState } from 'react';
import { DashboardTabs, type TabId, type TimePeriod } from './dashboard-tabs';
import { DashboardTabContent } from './dashboard-tab-content';
import { ViewSwitcher, type ViewMode } from './view-switcher';
import { NUEDashboardMap } from './nue-dashboard-map';
import { WhatIfCalculator } from './what-if-calculator';

export default function NUEDashboard() {
  const [activeView, setActiveView] = useState<ViewMode>('enhanced-dashboard');
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('year-to-date');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString();
  });
  const [recordsCount, setRecordsCount] = useState<{
    filtered: number;
    total: number;
  }>({ filtered: 0, total: 10 });
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const dashboardTabs = (
    <DashboardTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
      timePeriod={timePeriod}
      onTimePeriodChange={setTimePeriod}
      customStartDate={customStartDate}
      customEndDate={customEndDate}
      onCustomStartDateChange={setCustomStartDate}
      onCustomEndDateChange={setCustomEndDate}
      onRecordsCountChange={setRecordsCount}
      activeView={activeView}
    />
  );

  const dashboardTabContent = (
    <DashboardTabContent
      activeTab={activeTab}
      timePeriod={timePeriod}
      customStartDate={customStartDate}
      customEndDate={customEndDate}
      hasNoData={recordsCount.filtered === 0}
    />
  );

  return (
    <div className="w-full h-full border-basic-gray-light bg-white flex flex-col">
      <ViewSwitcher
        activeView={activeView}
        onViewChange={setActiveView}
        onCalculatorOpen={() => setIsCalculatorOpen(true)}
      />
      <WhatIfCalculator
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {activeView === 'enhanced-dashboard' && (
        <div className="flex-1 overflow-y-auto">
          {dashboardTabs}
          {dashboardTabContent}
        </div>
      )}

      {activeView === 'dual-view' && (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-[50%] flex-shrink-0 border-r border-basic-gray-light overflow-y-auto">
            {dashboardTabs}
            {dashboardTabContent}
          </div>
          <div className="w-[50%] flex-shrink-0 overflow-hidden p-4">
            <NUEDashboardMap
              timePeriod={timePeriod}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              showNueColors={true}
            />
          </div>
        </div>
      )}

      {activeView === 'farm-map' && (
        <div className="flex-1 overflow-hidden p-4">
          <NUEDashboardMap
            timePeriod={timePeriod}
            customStartDate={customStartDate}
            customEndDate={customEndDate}
            showNueColors={true}
          />
        </div>
      )}
    </div>
  );
}
