import {
  StatusIndicator,
  TaskStatus,
} from '@@agrosphere/shared';

interface TaskInsightsCardProps {
  title: string;
  value: number;
  percentage: string;
  percentageColor?: 'green' | 'red';
  status: TaskStatus;
  className?: string;
}

export function TaskInsightsCard({
  title,
  value,
  percentage,
  percentageColor = 'green',
  status,
  className = '',
}: TaskInsightsCardProps) {
  return (
    <div
      className={`bg-[#EEF0F647] rounded-lg p-4 border border-basic-white  ${className}`}
    >
      <div className="flex justify-between items-center">
        <p className="text-sm text-basic-black">{title}</p>
        <StatusIndicator
          status={status}
          showBackground={true}
          iconClassName="text-[20px]"
          className="rounded-xl py-2"
        />
      </div>

      <div className="h-[58px]">
        <p className="text-[28px] font-bold text-basic-black">{value}</p>
        <p
          className={`text-xs ${
            percentageColor === 'green' ? 'text-basic-green' : 'text-basic-red'
          }`}
        >
          {percentage} <span className="text-basic-gray">from last month</span>
        </p>
      </div>
    </div>
  );
}
