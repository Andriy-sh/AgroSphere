import React from 'react';
import { StatusIndicator } from '../status-indicator/status-indicator';
import { cn } from '../../utils/cn';
import { formatShortDate } from '../../utils/date-utils';
import { getLabInfoById } from '../../mock/mock-lab-info';
import { LabItem } from '../../mock/mock-lab-items';

interface TaskLabInfoProps {
  labNumber?: string;
  sentDate?: string;
  receivedDate?: string;
  status?:
    | 'received'
    | 'pending'
    | 'testing'
    | 'in_progress'
    | 'complete'
    | 'cancelled';
  className?: string;
  useMockData?: boolean;
  mockLabId?: string;
  showAdditionalInfo?: boolean;
  labOrder?: LabItem | null;
}

export const TaskLabInfo: React.FC<TaskLabInfoProps> = ({
  labNumber,
  sentDate,
  receivedDate,
  status,
  className,
  useMockData = false,
  mockLabId,
  showAdditionalInfo = false,
  labOrder = null,
}) => {
  const displaySentDate = formatShortDate(sentDate);
  const displayReceivedDate = formatShortDate(receivedDate);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-3 text-sm min-w-0 overflow-hidden">
        <span className="text-basic-gray font-medium flex-shrink-0">Lab:</span>

        <StatusIndicator
          status={status || 'pending'}
          showText={true}
          showBackground={true}
          className="text-xs "
          iconClassName="text-sm"
          statusClassName="text-xs font-medium"
        />

        <div className="w-px h-4 bg-basic-white flex-shrink-0"></div>

        <div className="flex items-center gap-1 min-w-0">
          <span className="text-basic-gray flex-shrink-0">No:</span>
          <span className="text-basic-black font-medium truncate">
            {labNumber}
          </span>
        </div>

        <div className="w-px h-4 bg-basic-white flex-shrink-0"></div>

        <div className="flex items-center gap-1 min-w-0">
          <span className="text-basic-gray flex-shrink-0">Sent:</span>
          <span className="text-basic-black font-medium truncate">
            {displaySentDate}
          </span>
        </div>

        <div className="w-px h-4 bg-basic-white flex-shrink-0"></div>

        <div className="flex items-center gap-1 min-w-0">
          <span className="text-basic-gray flex-shrink-0">Received:</span>
          <span className="text-basic-black font-medium truncate">
            {displayReceivedDate}
          </span>
        </div>
      </div>
    </div>
  );
};
