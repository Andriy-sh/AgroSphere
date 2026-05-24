import React from 'react';
import { Tooltip } from '@base-ui-components/react/tooltip';

import { cn } from '../../utils/cn';
import { Icon } from '../icon';

export type TaskStatus =
  | 'complete'
  | 'cancelled'
  | 'in_progress'
  | 'assigned'
  | 'pending'
  | 'priority-normal'
  | 'not_started'
  | 'received'
  | 'testing'
  | 'unknown'
  | 'Not Started'
  | 'overdue';

interface StatusIndicatorProps {
  status: TaskStatus;
  tooltip?: string;
  className?: string;
  showText?: boolean;
  iconClassName?: string;
  showTitle?: boolean;
  statusClassName?: string;
  showTooltip?: boolean;
  showBackground?: boolean;
  statusConfig?: {
    label: string;
    icon: string;
    color: string;
    backgroundColor: string;
  };
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  tooltip,
  className,
  showText = false,
  iconClassName,
  showTitle = true,
  statusClassName,
  showTooltip = true,
  showBackground = false,
  statusConfig,
}) => {
  if (statusConfig) {
    const content = (
      <div
        className={cn(
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
          statusConfig.backgroundColor,
          statusConfig.color,
          className
        )}
        title={showTitle ? tooltip || statusConfig.label : undefined}
        aria-label={tooltip || statusConfig.label || `${status} status`}
        role="status"
      >
        <span className={cn('material-symbols-outlined', iconClassName)}>
          {statusConfig.icon}
        </span>
        {showText && (
          <span className={cn('font-medium', statusClassName)}>
            {statusConfig.label}
          </span>
        )}
      </div>
    );

    if (!showTooltip) {
      return content;
    }

    return (
      <Tooltip.Root>
        <Tooltip.Trigger>{content}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={5}>
            <Tooltip.Popup className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg relative">
              {tooltip || statusConfig.label}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    );
  }

  let iconComponent: React.ReactNode = null;
  let iconColorClass = 'text-gray-500';
  let statusText = '';

  switch (status) {
    case 'complete':
      iconComponent = (
        <Icon icon="task_alt" className={cn('material-symbols-outlined', iconClassName)} />
        
      );
      iconColorClass = 'text-basic-green';
      statusText = 'Completed';
      break;
    case 'cancelled':
      iconComponent = (
        <Icon icon="block" className={cn('material-symbols-outlined', iconClassName)} />
      );
      iconColorClass = 'text-basic-red';
      statusText = 'Cancelled';
      break;
    case 'in_progress':
      iconComponent = (
        <Icon icon="timelapse" className={cn('material-symbols-outlined', iconClassName)} />
      );
      iconColorClass = 'text-basic-blue';
      statusText = 'In progress';
      break;
    case 'not_started':
      iconComponent = (
        <Icon icon="hourglass_bottom" className={cn('material-symbols-outlined', iconClassName)} />
      );
      iconColorClass = 'text-basic-yellow';
      statusText = 'Not started';
      break;
    case 'assigned':
      iconComponent = (
        <Icon icon="person" className={cn('material-symbols-outlined', iconClassName)} />
      );
      iconColorClass = 'text-basic-blue';
      statusText = 'Assigned';
      break;
    case 'pending':
      iconComponent = (
        <Icon icon="schedule" className={cn('material-symbols-outlined', iconClassName)} />
      );
      iconColorClass = 'text-orange-500';
      statusText = 'Pending';
      break;
    case 'testing':
      iconComponent = (
        <Icon icon="timelapse" className={cn('material-symbols-outlined', iconClassName)} />
      );
      iconColorClass = 'text-basic-blue';
      statusText = 'Testing';
      break;
    case 'received':
      iconComponent = (
        <Icon icon="approval_delegation" className={cn('material-symbols-outlined', iconClassName)} />
      );
      iconColorClass = 'text-basic-blue';
      statusText = 'Received';
      break;
    case 'priority-normal':
      iconComponent = (
        <Icon icon="flag" className={cn('material-symbols-outlined', iconClassName)} />
      );
      iconColorClass = 'text-basic-red';
      statusText = 'Priority: Normal';
      break;
    case 'Not Started':
      iconComponent = (
        <span className={cn('material-symbols-outlined', iconClassName)}>
          hourglass_bottom
        </span>
      );
      iconColorClass = 'text-basic-yellow';
      statusText = 'Not Started';
      break;
    case 'overdue':
      iconComponent = (
        <span className={cn('material-symbols-outlined', iconClassName)}>
          alarm
        </span>
      );
      iconColorClass = 'text-basic-red';
      statusText = 'Overdue';
      break;
  }

  const finalTooltipContent = tooltip || statusText;

  const getStatusBackgroundColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-[#FF8A3D1F]';
      case 'testing':
      case 'received':
      case 'in_progress':
        return 'bg-[#41B0FF1F]';
      case 'complete':
        return 'bg-[#00AF4D1F]';
      case 'cancelled':
        return 'bg-[#FF4D4F1F]';
      case 'not_started':
        return 'bg-[#FFC6521F]';
      case 'Not Started':
        return 'bg-[#FFC6521F]';
      case 'overdue':
        return 'bg-[#FF4D4F1F]';
      default:
        return 'bg-[#EEF0F6]';
    }
  };

  const content = (
    <div
      className={cn(
        'inline-flex items-center gap-2 !text-xs font-medium',
        showBackground ? 'px-2 rounded-md' : 'px-0',
        showBackground ? getStatusBackgroundColor(status) : '',
        iconColorClass,
        className
      )}
      title={showTitle ? finalTooltipContent : undefined}
      aria-label={finalTooltipContent || `${status} status`}
      role="status"
    >
      {iconComponent}
      {showText && (
        <span className={cn('font-normal text-xs', statusClassName)}>
          {statusText}
        </span>
      )}
    </div>
  );

  if (!showTooltip) {
    return content;
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>{content}</Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Positioner sideOffset={5}>
          <Tooltip.Popup className="bg-gray-800 text-white text-sm px-3 py-1.5 rounded-md shadow-lg relative">
            {finalTooltipContent}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
};
