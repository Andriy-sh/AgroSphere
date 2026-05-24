'use client';

import { useMemo, useEffect } from 'react';
import { CustomSelect, DateSelector } from '@@agrosphere/shared';
import { allParcelsData, type ParcelData } from './data/all-tabs-mock-data';

interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function Tab({ label, isActive, onClick }: TabProps) {
  return (
    <button
      onClick={onClick}
      aria-label={`Switch to ${label} tab`}
      aria-selected={isActive}
      role="tab"
      className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg bg-white border border-basic-gray-light whitespace-nowrap overflow-hidden text-ellipsis max-w-full
        ${
          isActive
            ? 'text-basic-black'
            : 'text-basic-gray hover:text-basic-black'
        }
      `}
    >
      {label}
    </button>
  );
}

export type TabId = 'overview' | 'field-performance' | 'trends';

export type TimePeriod =
  | 'all-time'
  | 'year-to-date'
  | 'full-year-2025'
  | 'previous-year-2024'
  | 'custom-range';

interface TabItem {
  id: TabId;
  label: string;
}

interface DashboardTabsProps {
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
  timePeriod: TimePeriod;
  onTimePeriodChange: (period: TimePeriod) => void;
  customStartDate?: string;
  customEndDate?: string;
  onCustomStartDateChange?: (date: string) => void;
  onCustomEndDateChange?: (date: string) => void;
  onRecordsCountChange?: (count: { filtered: number; total: number }) => void;
  activeView?: 'enhanced-dashboard' | 'dual-view' | 'farm-map';
}

const getRecordsCount = (
  timePeriod: TimePeriod,
  customStartDate?: string,
  customEndDate?: string
): { filtered: number; total: number } => {
  const allParcels: ParcelData[] = allParcelsData;
  const total = allParcels.length;
  const currentYear = new Date().getFullYear();

  let filtered: number;

  switch (timePeriod) {
    case 'all-time':
      filtered = total;
      break;
    case 'year-to-date':
      filtered = allParcels.filter((item) => {
        const itemDate = new Date(item.date.split('T')[0]);
        return itemDate.getFullYear() === currentYear;
      }).length;
      break;
    case 'full-year-2025':
      filtered = allParcels.filter((item) => item.year === 2025).length;
      break;
    case 'previous-year-2024':
      filtered = allParcels.filter((item) => item.year === 2024).length;
      break;
    case 'custom-range': {
      if (!customStartDate || !customEndDate) {
        filtered = 0;
      } else {
        const startDate = new Date(customStartDate.split('T')[0]);
        const endDate = new Date(customEndDate.split('T')[0]);
        filtered = allParcels.filter((item) => {
          const itemDate = new Date(item.date.split('T')[0]);
          return itemDate >= startDate && itemDate <= endDate;
        }).length;
      }
      break;
    }
    default:
      filtered = total;
  }

  return { filtered, total };
};

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'field-performance', label: 'Field Performance' },
  { id: 'trends', label: 'Trends' },
];

const timePeriodOptions = [
  { value: 'all-time', label: 'All Time' },
  { value: 'year-to-date', label: 'Year to Date' },
  { value: 'full-year-2025', label: 'Full Year (2025)' },
  { value: 'previous-year-2024', label: 'Previous Year (2024)' },
  { value: 'custom-range', label: 'Custom Range' },
];

export function DashboardTabs({
  activeTab,
  onTabChange,
  timePeriod,
  onTimePeriodChange,
  customStartDate,
  customEndDate,
  onCustomStartDateChange,
  onCustomEndDateChange,
  onRecordsCountChange,
  activeView = 'enhanced-dashboard',
}: DashboardTabsProps) {
  const recordsCount = useMemo(
    () => getRecordsCount(timePeriod, customStartDate, customEndDate),
    [timePeriod, customStartDate, customEndDate]
  );

  useEffect(() => {
    onRecordsCountChange?.(recordsCount);
  }, [recordsCount, onRecordsCountChange]);

  const recordsElement = (
    <div className="px-3 py-1.5 text-sm text-basic-gray bg-basic-gray-light rounded-lg border border-basic-gray-light whitespace-nowrap flex-shrink-0">
      {recordsCount.filtered} Records
    </div>
  );

  const isDualView = activeView === 'dual-view';

  return (
    <div
      className="flex items-center justify-between gap-4 pt-5 px-5 bg-white border-b border-basic-gray-light pb-4 flex-wrap"
      role="tablist"
      aria-label="NUE Dashboard tabs"
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm text-basic-gray">Time Period:</span>
        <CustomSelect
          options={timePeriodOptions}
          value={timePeriod}
          onValueChange={(value) => onTimePeriodChange(value as TimePeriod)}
          className="w-[200px] min-w-[200px]"
          triggerClassName="w-[200px] min-w-[200px]"
          popupClassName="w-[200px] min-w-[200px]"
        />
        {timePeriod === 'custom-range' && (
          <>
            <span className="text-sm text-basic-gray">From:</span>
            <DateSelector
              value={customStartDate || ''}
              onChange={(date: string) => onCustomStartDateChange?.(date)}
              placeholder="Start Date"
              className="w-[180px]"
              triggerClassName="w-[180px]"
              popupClassName="w-[300px]"
            />
            <span className="text-sm text-basic-gray">To:</span>
            <DateSelector
              value={customEndDate || new Date().toISOString()}
              onChange={(date: string) => onCustomEndDateChange?.(date)}
              placeholder="End Date"
              className="w-[180px]"
              triggerClassName="w-[180px]"
              popupClassName="w-[300px]"
              minDate={
                customStartDate
                  ? new Date(customStartDate.split('T')[0])
                  : undefined
              }
            />
          </>
        )}
        {!isDualView && recordsElement}
      </div>
      <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
        {isDualView && recordsElement}
        <div className="flex justify-center gap-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
