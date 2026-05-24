'use client';
import type { TaskMarker } from '../../map/layers/tasks-layer';
import { TaskDropdownActions } from '../task-dropdown-actions/task-dropdown-actions';
interface TaskActionsProps {
  taskId: string;
  flag: 'normal' | 'high' | 'none';
  status: 'pending' | 'in_progress' | 'complete' | 'cancelled' | 'not_started';
  isNew?: boolean;
  isAccepted?: boolean;
  task?: TaskMarker;
  taskRef?: React.RefObject<HTMLElement | null>;
  onUpdatePriority: (id: string, flag: 'normal' | 'high' | 'none') => void;
  onUpdateStatus: (
    id: string,
    status: 'pending' | 'in_progress' | 'complete' | 'cancelled' | 'not_started'
  ) => void;
  onAcceptTask: (id: string) => void;
  onDeclineTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenPopup?: (
    taskId: string,
    taskRef: React.RefObject<HTMLElement | null> | undefined
  ) => void;
}

export const TaskActions: React.FC<TaskActionsProps> = ({
  taskId,
  flag,
  status,
  isNew = false,
  isAccepted = false,
  task,
  taskRef,
  onUpdatePriority,
  onUpdateStatus,
  onAcceptTask,
  onDeclineTask,
  onDeleteTask,
  onOpenPopup,
}) => {
  return (
    <TaskDropdownActions
      taskId={taskId}
      status={status}
      isAccepted={isAccepted}
      onAcceptTask={onAcceptTask}
      onDeclineTask={onDeclineTask}
      onUpdateStatus={onUpdateStatus}
      onUpdatePriority={onUpdatePriority}
      onDeleteTask={onDeleteTask}
      onViewOnMap={
        onOpenPopup ? (taskId) => onOpenPopup(taskId, taskRef) : undefined
      }
    />
  );
};
