import { cn, SplitCard } from '@@agrosphere/shared';
import React from 'react';
import { TaskInsightsCard } from './task-insights-card';

interface TaskInsightsData {
  upcomingCount: number;
  inProgressCount: number;
  overdueCount: number;
  completedCount: number;
  upcomingPercentage: string;
  inProgressPercentage: string;
  overduePercentage: string;
  completedPercentage: string;
}

interface TaskInsightsProps {
  className?: string;
  data?: TaskInsightsData;
  isExpanded?: boolean;
}

export const TaskInsights: React.FC<TaskInsightsProps> = ({
  className = '',
  data = {
    upcomingCount: 20,
    inProgressCount: 40,
    overdueCount: 12,
    completedCount: 16,
    upcomingPercentage: '+20%',
    inProgressPercentage: '+10%',
    overduePercentage: '+20%',
    completedPercentage: '+15%',
  },
  isExpanded = false,
}) => {
  return (
    <SplitCard
      className={cn(
        isExpanded ? 'max-h-[230px]' : 'max-h-[370px]',
        'text-basic-black',
        className
      )}
      bottomClassName="overflow-y-hidden"
      topContent={
        <div>
          <h2 className="text-base font-semibold text-basic-black">
            Task Insights
          </h2>
        </div>
      }
      bottomContent={
        <div
          className={cn(
            'grid gap-3 ',
            isExpanded ? 'grid-cols-4' : 'grid-cols-2'
          )}
        >
          <TaskInsightsCard
            title="Overdue"
            value={data.overdueCount}
            percentage={data.overduePercentage}
            percentageColor="red"
            status="overdue"
          />

          <TaskInsightsCard
            title="Completed"
            value={data.completedCount}
            percentage={data.completedPercentage}
            percentageColor="green"
            status="complete"
          />
          <TaskInsightsCard
            title="Upcoming"
            value={data.upcomingCount}
            percentage={data.upcomingPercentage}
            percentageColor="green"
            status="pending"
          />

          <TaskInsightsCard
            title="In progress"
            value={data.inProgressCount}
            percentage={data.inProgressPercentage}
            percentageColor="green"
            status="in_progress"
          />
        </div>
      }
    />
  );
};
