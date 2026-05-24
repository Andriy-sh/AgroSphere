import React from 'react';
import { StatusIndicator } from '../../status-indicator/status-indicator';
import { TaskAcceptDecline } from '../task-accept-decline/task-accept-decline';

interface TaskStatusProps {
  status: 'pending' | 'in_progress' | 'complete' | 'cancelled';
  isNew?: boolean;
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
}

export const TaskStatus: React.FC<TaskStatusProps> = ({
  status,
  isNew = false,
  onAccept,
  onDecline,
  showActions = false,
}) => {
  if (isNew && showActions) {
    return (
      <div className="flex gap-2 justify-center items-center">
        <TaskAcceptDecline
          onAccept={onAccept || (() => {})}
          onDecline={onDecline || (() => {})}
          size="md"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <StatusIndicator tooltip="" status={status} />
    </div>
  );
};
