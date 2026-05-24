'use client';

import {
  DropdownActionItem,
  DropdownActionsNoLib,
} from '../../dropdownitems/dropdownitems';
import { Icon } from '../../icon';
import { usePatchTask } from '../../../api/hooks/use-tasks';
import { PatchTaskRequest } from '../../../api/services/tasks/task-types';

interface TaskDropdownActionsProps {
  taskId: string;
  status: string;
  isAccepted: boolean;
  priority?: string;
  task_has_unmatched_samples?: boolean;
  task_has_tests_without_lab_result?: boolean;
  task_has_not_started_test?: boolean;
  onAcceptTask: (id: string) => void;
  onDeclineTask: (id: string) => void;
  onUpdateStatus?: (
    id: string,
    status: 'pending' | 'in_progress' | 'complete' | 'cancelled' | 'not_started'
  ) => void;
  onUpdatePriority?: (id: string, flag: 'normal' | 'high' | 'none') => void;
  onDeleteTask: (id: string) => void;
  onDuplicateTask?: (id: string) => void;
  onViewOnMap?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  onNavigateToTask?: (taskId: string) => void;
  shouldCloseOnAction?: boolean;
  patchTaskOptimistic?: (
    taskId: string,
    patchData: PatchTaskRequest
  ) => Promise<void>;
}

const PrioritySection = ({
  taskId,
  priority,
  status,
  isAccepted,
  onUpdatePriority,
  onClose,
  shouldCloseOnAction,
  handleUpdatePriority,
}: {
  taskId: string;
  priority?: string;
  status: string;
  isAccepted: boolean;
  onUpdatePriority?: (id: string, flag: 'normal' | 'high' | 'none') => void;
  onClose?: () => void;
  shouldCloseOnAction?: boolean;
  handleUpdatePriority: (
    id: string,
    priority: 'normal' | 'high' | 'none'
  ) => void;
}) => {
  const isDisabled =
    status === 'pending' || status === 'cancelled' || !isAccepted;

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="text-xs text-gray-400 mb-1">Priority</div>
      <div className="flex gap-1">
        <Icon
          icon="flag_2"
          className={`rounded p-0.5 cursor-pointer ${
            isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-red-500'
          } ${!isDisabled && priority === 'high' ? 'bg-[#EEF0F6]' : ''}`}
          onClick={() => {
            if (!isDisabled) {
              handleUpdatePriority(taskId, 'high');
              if (shouldCloseOnAction) {
                onClose?.();
              }
            }
          }}
        />

        <Icon
          icon="flag_2"
          className={`rounded p-0.5 cursor-pointer ${
            isDisabled ? 'text-gray-400 cursor-not-allowed' : 'text-blue-500'
          } ${!isDisabled && priority === 'normal' ? 'bg-[#EEF0F6]' : ''}`}
          onClick={() => {
            if (!isDisabled) {
              handleUpdatePriority(taskId, 'normal');
              if (shouldCloseOnAction) {
                onClose?.();
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export function TaskDropdownActions({
  taskId,
  status,
  isAccepted,
  priority,
  task_has_unmatched_samples,
  task_has_tests_without_lab_result,
  task_has_not_started_test,
  onAcceptTask,
  onDeclineTask,
  onUpdateStatus,
  onUpdatePriority,
  onDeleteTask,
  onDuplicateTask,
  onViewOnMap,
  onViewDetails,
  onNavigateToTask,
  shouldCloseOnAction = false,
  patchTaskOptimistic,
}: TaskDropdownActionsProps) {
  const { patchTask } = usePatchTask();

  const handleUpdateStatus = async (
    id: string,
    newStatus: PatchTaskRequest['status']
  ) => {
    try {
      const patchData: PatchTaskRequest = { status: newStatus };

      // if (newStatus === 'complete') {
      //   const today = new Date();
      //   const year = today.getFullYear();
      //   const month = String(today.getMonth() + 1).padStart(2, '0');
      //   const day = String(today.getDate()).padStart(2, '0');
      //   const formattedDate = `${year}-${month}-${day}`;
      //   patchData.complete_by = formattedDate;
      // }

      if (patchTaskOptimistic) {
        await patchTaskOptimistic(id, patchData);
      } else {
        await patchTask(id, patchData);
      }

      onUpdateStatus?.(
        id,
        newStatus as
          | 'pending'
          | 'in_progress'
          | 'complete'
          | 'cancelled'
          | 'not_started'
      );
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleUpdatePriority = async (
    id: string,
    priority: 'normal' | 'high' | 'none'
  ) => {
    try {
      const patchData: PatchTaskRequest = {
        priority: priority === 'none' ? 'normal' : priority,
      };

      if (patchTaskOptimistic) {
        await patchTaskOptimistic(id, patchData);
      } else {
        await patchTask(id, patchData);
      }

      onUpdatePriority?.(id, priority);
    } catch (error) {
      console.error('Failed to update task priority:', error);
    }
  };
  if (status === 'pending' || status === 'cancelled' || !isAccepted) {
    const blockedDropdownItems: DropdownActionItem[] = [
      {
        id: 'accept-task',
        label: <span className="text-sm">Accept task</span>,
        icon: 'check',
        className: 'font-medium',
        onClick: () => {
          onAcceptTask(taskId);
          handleUpdateStatus(taskId, 'not_started');
        },
      },
      { id: 'separator-0', isSeparator: true },
      {
        id: 'map',
        label: <span className="text-sm">View on map</span>,
        icon: 'home_pin',
        onClick: () => onViewOnMap?.(taskId),
      },
      {
        id: 'duplicate',
        label: <span className="text-sm">Duplicate</span>,
        icon: 'content_copy',
        onClick: () => {
          onDuplicateTask?.(taskId);
        },
      },
      {
        id: 'delete',
        label: <span className="text-sm">Delete</span>,
        icon: 'delete',
        className: 'text-red-600',
        onClick: () => onDeleteTask(taskId),
      },
    ];

    return (
      <DropdownActionsNoLib
        items={blockedDropdownItems}
        placement="bottom-end"
      />
    );
  }

  const dropdownItems: DropdownActionItem[] = [
    {
      id: 'priority-custom',
      customComponent: (close) => (
        <PrioritySection
          taskId={taskId}
          priority={priority}
          status={status}
          isAccepted={isAccepted}
          onUpdatePriority={onUpdatePriority}
          onClose={close}
          shouldCloseOnAction={shouldCloseOnAction}
          handleUpdatePriority={handleUpdatePriority}
        />
      ),
    },
    { id: 'separator-0', isSeparator: true },
    {
      id: 'edit',
      label: <span className="text-sm">Edit</span>,
      icon: 'edit',
    },
    {
      id: 'map',
      label: <span className="text-sm">View on map</span>,
      icon: 'home_pin',
      onClick: () => onViewOnMap?.(taskId),
    },
    {
      id: 'status',
      label: <span className="text-sm">Status</span>,
      icon: 'radio_button_partial',
      children: [
        {
          id: 'not-started',
          label: <span className="text-sm">Not started</span>,
          icon: 'hourglass_bottom',
          iconClassName: 'text-basic-yellow',
          onClick: () => handleUpdateStatus(taskId, 'not_started'),
        },
        {
          id: 'in-progress',
          label: <span className="text-sm">In progress</span>,
          icon: 'timelapse',
          iconClassName: 'text-basic-blue',
          onClick: () => handleUpdateStatus(taskId, 'in_progress'),
        },
        {
          id: 'complete',
          label: <span className="text-sm">Completed</span>,
          icon: 'task_alt',
          iconClassName: 'text-basic-green',
          onClick: () => handleUpdateStatus(taskId, 'complete'),
        },
      ],
    },
    {
      id: 'duplicate',
      label: <span className="text-sm">Duplicate</span>,
      icon: 'content_copy',
      onClick: () => {
        onDuplicateTask?.(taskId);
        if (shouldCloseOnAction) {
          return;
        }
      },
    },
    {
      id: 'delete',
      label: <span className="text-sm">Delete</span>,
      icon: 'delete',
      className: 'text-red-600',
      onClick: () => onDeleteTask(taskId),
    },
  ];

  return <DropdownActionsNoLib items={dropdownItems} placement="bottom-end" />;
}
