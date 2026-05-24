'use client';

import { useMemo } from 'react';
import { Filters, FilterSection, FilterState, Icon } from '@@agrosphere/shared';
import { DEFAULT_LAB_STATUS_CONFIGS } from '@@agrosphere/shared';

interface LabItem {
  sentDate: string;
  client: {
    name: string;
    surname: string;
  };
  status: string;
  type: string;
  labName: string;
}

interface LabSideFiltersProps {
  labItems: LabItem[];
  onFiltersChange: (filters: FilterState) => void;
  onReset: () => void;
  currentFilterState?: FilterState;
}

export function LabSideFilters({
  labItems,
  onFiltersChange,
  onReset,
  currentFilterState,
}: LabSideFiltersProps) {
  const labCounts = useMemo(() => {
    const counts: {
      clients: { [key: string]: number };
      period: { [key: string]: number };
      status: { [key: string]: number };
      type: { [key: string]: number };
      taskType: { [key: string]: number };
    } = {
      clients: {
        All: labItems.length,
      },
      period: {
        'Late tasks': 0,
        Today: 0,
        'Last 7 days': 0,
        'Last 30 days': 0,
        'Last year': 0,
      },
      status: {
        All: labItems.length,
        Pending: 0,
        Received: 0,
        Testing: 0,
        Completed: 0,
        Cancelled: 0,
      },
      type: {
        All: labItems.length,
        Soil: 0,
        Grass: 0,
        Silage: 0,
        Feed: 0,
        Water: 0,
        Slurry: 0,
      },
      taskType: {
        All: labItems.length,
        'AgriTech Laboratories': 0,
        'BioScience Research': 0,
        'CropTech Solutions': 0,
        'Precision Agriculture Lab': 0,
      },
    };

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);

    const uniqueClients = new Set<string>();

    labItems.forEach((item) => {
      const sentDate = new Date(item.sentDate);
      const clientName = `${item.client.name} ${item.client.surname}`;
      uniqueClients.add(clientName);

      if (sentDate < today) {
        counts.period['Late tasks']++;
      }
      if (sentDate >= today) {
        counts.period['Today']++;
      }
      if (sentDate >= weekAgo) {
        counts.period['Last 7 days']++;
      }
      if (sentDate >= monthAgo) {
        counts.period['Last 30 days']++;
      }
      if (sentDate >= yearAgo) {
        counts.period['Last year']++;
      }

      const statusLabel =
        DEFAULT_LAB_STATUS_CONFIGS.find((config) => config.id === item.status)
          ?.label || item.status;
      if (statusLabel in counts.status) {
        counts.status[statusLabel as keyof typeof counts.status]++;
      }

      const sampleType = item.type;
      if (sampleType in counts.type) {
        counts.type[sampleType as keyof typeof counts.type]++;
      }

      const labName = item.labName;
      if (labName in counts.taskType) {
        counts.taskType[labName as keyof typeof counts.taskType]++;
      }
    });

    uniqueClients.forEach((clientName) => {
      counts.clients[clientName] = labItems.filter(
        (item) => `${item.client.name} ${item.client.surname}` === clientName
      ).length;
    });

    return counts;
  }, [labItems]);

  const mockSections: FilterSection[] = useMemo(
    () => [
      {
        key: 'clients',
        title: 'Clients',
        icon: 'person',
        rows: [
          {
            checked: currentFilterState?.clients.includes('All') || false,
            label: 'All',
            badgeCount: labCounts.clients['All'],
          },
          ...Object.entries(labCounts.clients)
            .filter(([key]) => key !== 'All')
            .map(([clientName, count]) => ({
              checked:
                currentFilterState?.clients.includes(clientName) || false,
              label: clientName,
              badgeCount: count,
            })),
        ],
      },
      {
        key: 'period',
        title: 'Order and date',
        icon: 'calendar_today',
        rows: [
          {
            checked: currentFilterState?.period.includes('Late tasks') || false,
            label: 'Late tasks',
            badgeCount: labCounts.period['Late tasks'],
          },
          {
            checked: currentFilterState?.period.includes('Today') || false,
            label: 'Today',
            badgeCount: labCounts.period['Today'],
          },
          {
            checked:
              currentFilterState?.period.includes('Last 7 days') || false,
            label: 'Last 7 days',
            badgeCount: labCounts.period['Last 7 days'],
          },
          {
            checked:
              currentFilterState?.period.includes('Last 30 days') || false,
            label: 'Last 30 days',
            badgeCount: labCounts.period['Last 30 days'],
          },
          {
            checked: currentFilterState?.period.includes('Last year') || false,
            label: 'Last year',
            badgeCount: labCounts.period['Last year'],
          },
          {
            checked: false,
            label: 'Custom',
            isCustom: true,
          },
        ],
      },
      {
        key: 'status',
        title: 'Status',
        icon: 'radio_button_partial',
        rows: [
          {
            checked: currentFilterState?.status.includes('All') || false,
            label: 'All',
            badgeCount: labCounts.status['All'],
          },
          {
            checked: currentFilterState?.status.includes('Pending') || false,
            label: 'Pending',
            badgeCount: labCounts.status['Pending'],
          },
          {
            checked: currentFilterState?.status.includes('Received') || false,
            label: 'Received',
            badgeCount: labCounts.status['Received'],
          },
          {
            checked: currentFilterState?.status.includes('Testing') || false,
            label: 'Testing',
            badgeCount: labCounts.status['Testing'],
          },
          {
            checked: currentFilterState?.status.includes('Complete') || false,
            label: 'Complete',
            badgeCount: labCounts.status['Complete'],
          },
        ],
      },
      {
        key: 'taskType',
        title: 'Task type',
        icon: 'docs',
        rows: [
          {
            checked: currentFilterState?.taskType.includes('All') || false,
            label: 'All',
            badgeCount: labCounts.type['All'],
          },
          {
            checked: currentFilterState?.taskType.includes('Soil') || false,
            label: 'Soil',
            badgeCount: labCounts.type['Soil'],
          },
          {
            checked: currentFilterState?.taskType.includes('Grass') || false,
            label: 'Grass',
            badgeCount: labCounts.type['Grass'],
          },
          {
            checked: currentFilterState?.taskType.includes('Silage') || false,
            label: 'Silage',
            badgeCount: labCounts.type['Silage'],
          },
          {
            checked: currentFilterState?.taskType.includes('Feed') || false,
            label: 'Feed',
            badgeCount: labCounts.type['Feed'],
          },
          {
            checked: currentFilterState?.taskType.includes('Water') || false,
            label: 'Water',
            badgeCount: labCounts.type['Water'],
          },
          {
            checked: currentFilterState?.taskType.includes('Slurry') || false,
            label: 'Slurry',
            badgeCount: labCounts.type['Slurry'],
          },
        ],
      },
      {
        key: 'lab',
        title: 'Lab',
        icon: 'experiment',
        rows: [
          {
            checked: currentFilterState?.type.includes('All') || false,
            label: 'All',
            badgeCount: labCounts.taskType['All'],
          },
          {
            checked:
              currentFilterState?.type.includes('AgriTech Laboratories') ||
              false,
            label: 'AgriTech Laboratories',
            badgeCount: labCounts.taskType['AgriTech Laboratories'],
          },
          {
            checked:
              currentFilterState?.type.includes('BioScience Research') || false,
            label: 'BioScience Research',
            badgeCount: labCounts.taskType['BioScience Research'],
          },
          {
            checked:
              currentFilterState?.type.includes('CropTech Solutions') || false,
            label: 'CropTech Solutions',
            badgeCount: labCounts.taskType['CropTech Solutions'],
          },
          {
            checked:
              currentFilterState?.type.includes('Precision Agriculture Lab') ||
              false,
            label: 'Precision Agriculture Lab',
            badgeCount: labCounts.taskType['Precision Agriculture Lab'],
          },
        ],
      },
    ],
    [labCounts, currentFilterState]
  );

  return (
    <div className="flex-shrink-0 border border-basic-gray-light rounded-xl bg-white overflow-y-auto w-60 h-full max-h-full">
      <Filters
        sections={mockSections}
        onReset={onReset}
        onFiltersChange={onFiltersChange}
        className="h-full"
        initialFilterState={currentFilterState}
      />
    </div>
  );
}
