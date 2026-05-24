'use client';
import React, { useRef } from 'react';

import { TaskDetails } from '../../types/task';
import { Flag } from '../flag/flag';
import { CalendarDays, X, Check } from 'lucide-react';
import { Avatar } from '../avatar/avatar';
import { Badge } from '../badge/badge';
import { TaskActions } from '../tasks/task-actions/task-actions';
import { NoResultsFound } from '../no-results-found/no-results-found';
import {
  formatDate,
  formatShortDate,
  formatTaskType,
} from '../../utils/date-utils';
import { mockTasks } from '../../mock/mock-tasks-details';
import { TaskMapPopup } from '../map/task-map-popup';

const columns = [
  {
    key: 'pending',
    label: 'Not started',
    icon: (
      <span className="material-symbols-outlined text-xl mb-3 w-4 h-4 text-basic-yellow">
        hourglass_bottom
      </span>
    ),
    color: 'bg-[#F5F7FB]',
  },
  {
    key: 'in_progress',
    label: 'In progress',
    icon: (
      <span className="material-symbols-outlined text-xl mb-3 w-4 h-4 text-basic-blue">
        timelapse
      </span>
    ),
    color: 'bg-[#F5F7FB]',
  },
  {
    key: 'completed',
    label: 'Completed',
    icon: (
      <span className="material-symbols-outlined text-xl mb-3 w-4 h-4 text-basic-green">
        task_alt
      </span>
    ),
    color: 'bg-[#F5F7FB]',
  },
];

interface TaskKanbanProps {
  tasks: TaskDetails[];
  onUpdatePriority?: (id: string, flag: 'normal' | 'high' | 'none') => void;
  onUpdateStatus?: (
    id: string,
    status:
      | 'pending'
      | 'in_progress'
      | 'complete'
      | 'cancelled'
      | 'Not Started'
      | 'not_started'
  ) => void;
  onAcceptTask?: (task: TaskDetails) => void;
  onDeclineTask?: (task: TaskDetails) => void;
  onDeleteTask?: (id: string) => void;
}

interface KanbanTaskCardProps {
  task: TaskDetails;
  onUpdatePriority?: (id: string, flag: 'normal' | 'high' | 'none') => void;
  onUpdateStatus?: (
    id: string,
    status:
      | 'pending'
      | 'in_progress'
      | 'complete'
      | 'cancelled'
      | 'Not Started'
      | 'not_started'
  ) => void;
  onAcceptTask?: (task: TaskDetails) => void;
  onDeclineTask?: (task: TaskDetails) => void;
  onDeleteTask?: (id: string) => void;
  onOpenPopup?: (
    taskId: string,
    taskRef: React.RefObject<HTMLElement | null> | undefined
  ) => void;
}

const KanbanTaskCardActions: React.FC<{
  onAccept?: () => void;
  onDecline?: () => void;
}> = ({ onAccept, onDecline }) => (
  <div className="flex gap-2 mt-3">
    <button
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-basic-red text-[#FFFFFF] text-sm font-semibold hover:bg-[#e62e3a] transition-colors"
      onClick={onDecline}
    >
      <X className="w-4 h-4" /> Decline
    </button>
    <button
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-basic-green text-[#FFFFFF] text-sm font-semibold hover:bg-[#22a144] transition-colors"
      onClick={onAccept}
    >
      <Check className="w-4 h-4" /> Accept
    </button>
  </div>
);

export const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({
  task,
  onUpdatePriority,
  onUpdateStatus,
  onAcceptTask,
  onDeclineTask,
  onDeleteTask,
  onOpenPopup,
}) => {
  const taskRef = useRef<HTMLDivElement>(null);
  const flagVariant =
    task.status === 'not_started'
      ? 'normal'
      : task.task_has_unmatched_samples ||
        task.task_has_tests_without_lab_result
      ? 'high'
      : 'normal';
  const isNew = task.status === 'not_started' && !task.assigned_to;
  const isAccepted = task.status !== 'cancelled';

  const handleUpdatePriority = (
    taskId: string,
    newFlag: 'normal' | 'high' | 'none'
  ) => {
    onUpdatePriority?.(taskId, newFlag);
  };

  const handleUpdateStatus = (
    taskId: string,
    newStatus:
      | 'pending'
      | 'in_progress'
      | 'complete'
      | 'cancelled'
      | 'Not Started'
      | 'not_started'
  ) => {
    onUpdateStatus?.(taskId, newStatus);
  };

  const handleAcceptTask = () => {
    onAcceptTask?.(task);
  };

  const handleDeclineTask = () => {
    onDeclineTask?.(task);
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask?.(taskId);
  };

  return (
    <div
      ref={taskRef}
      data-task-id={task.id}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4"
    >
      <div className="flex items-center gap-2 mb-1">
        <Flag variant={flagVariant} size="md" />
        <span className="text-basic-gray font-medium text-sm">#{task.id}</span>
        <span className="text-basic-black font-medium text-sm">
          {formatTaskType(task.task_type)}
        </span>
        <div className="flex-1" />
        <div className="flex items-center justify-center">
          {task.status === 'not_started' ? (
            <div className="flex gap-2">
              <button
                className="rounded-md bg-basic-gray-light p-1 hover:bg-gray-200 w-7 h-7 shadow-[0_-1px_0_rgba(228,229,235,255)]"
                onClick={() => handleDeclineTask()}
              >
                <X size={20} />
              </button>
              <button
                className="rounded-md bg-basic-green p-1 w-7 h-7 shadow-[0_-1px_0_rgba(127,211,149,255)]"
                onClick={() => handleAcceptTask()}
              >
                <Check size={20} className="text-white" />
              </button>
            </div>
          ) : (
            <TaskActions
              taskId={task.id}
              flag={flagVariant}
              status={task.status as any}
              isNew={isNew}
              isAccepted={isAccepted}
              taskRef={taskRef}
              onUpdatePriority={handleUpdatePriority}
              onUpdateStatus={handleUpdateStatus}
              onAcceptTask={handleAcceptTask}
              onDeclineTask={handleDeclineTask}
              onDeleteTask={handleDeleteTask}
              onOpenPopup={onOpenPopup}
            />
          )}
        </div>
      </div>
      <div className="text-basic-gray text-sm mb-3">{task.farms}</div>
      <div className="flex items-center gap-1">
        <div className="flex gap-1">
          {task.soil_sampler && (
            <Avatar
              size="sm"
              className="rounded-lg h-7 w-7 "
              avatarSrc=""
              tooltipText={task.soil_sampler}
              row={{
                original: {
                  client: {
                    name: task.soil_sampler,
                    surname: '',
                    avatarSrc: '',
                  },
                },
              }}
            />
          )}
          <Avatar
            size="sm"
            className="rounded-lg w-7 h-7"
            avatarSrc=""
            tooltipText={task.farmer_name}
            row={{
              original: {
                client: {
                  name: task.farmer_name,
                  surname: '',
                  avatarSrc: '',
                },
              },
            }}
          />
        </div>
        <span className="mx-2 h-6 border-l border-gray-200" />
        <div className="flex items-center gap-1 min-w-0 flex-1">
          <CalendarDays className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <span
            className="text-basic-black font-medium text-xs truncate"
            title={formatDate(task.date)}
          >
            {formatShortDate(task.date)}
          </span>
          {task.complete_by && (
            <>
              <span className="mx-2 h-6 border-l border-gray-200 flex-shrink-0" />
              <span
                className="text-basic-black font-medium text-xs truncate"
                title={formatDate(String(task.complete_by))}
              >
                {formatShortDate(String(task.complete_by))}
              </span>
            </>
          )}
        </div>
      </div>
      {isNew && (
        <KanbanTaskCardActions
          onAccept={() => onAcceptTask?.(task)}
          onDecline={() => onDeclineTask?.(task)}
        />
      )}
    </div>
  );
};

export const TaskKanban: React.FC<TaskKanbanProps> = ({
  tasks,
  onUpdatePriority,
  onUpdateStatus,
  onAcceptTask,
  onDeclineTask,
  onDeleteTask,
}) => {
  const kanbanTasks = tasks || mockTasks;
  const [popupState, setPopupState] = React.useState<{
    isOpen: boolean;
    taskId: string | null;
    selectedTask: TaskDetails | null;
    position: { top: number; left: number };
    isVisible: boolean;
  }>({
    isOpen: false,
    taskId: null,
    selectedTask: null,
    position: { top: 0, left: 0 },
    isVisible: true,
  });

  const openPopup = (
    taskId: string,
    taskRef: React.RefObject<HTMLElement | null> | undefined
  ) => {
    if (!taskRef?.current) return;

    const selectedTask = kanbanTasks.find((task) => task.id === taskId);
    if (!selectedTask) return;

    const rect = taskRef.current.getBoundingClientRect();
    const popupWidth = 410;
    const popupHeight = 550;
    const margin = 16;

    const rightSpace = window.innerWidth - rect.right - margin;
    const leftSpace = rect.left - margin;

    let left, top;

    if (rightSpace >= popupWidth) {
      left = rect.right + window.scrollX + margin;
    } else if (leftSpace >= popupWidth) {
      left = rect.left + window.scrollX - popupWidth - margin;
    } else {
      left = Math.max(
        margin,
        (window.innerWidth - popupWidth) / 2 + window.scrollX
      );
    }

    const bottomSpace = window.innerHeight - rect.top;
    if (bottomSpace >= popupHeight) {
      top = rect.top + window.scrollY;
    } else {
      top = Math.max(margin, rect.bottom + window.scrollY - popupHeight);
    }

    setPopupState({
      isOpen: true,
      taskId,
      selectedTask,
      position: { top, left },
      isVisible: true,
    });
  };

  const closePopup = () => {
    setPopupState({
      isOpen: false,
      taskId: null,
      selectedTask: null,
      position: { top: 0, left: 0 },
      isVisible: true,
    });
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const popupElement = document.querySelector('[data-popup="map-popup"]');
      if (popupElement && !popupElement.contains(event.target as Node)) {
        closePopup();
      }
    };

    const updatePopupPosition = (taskElement: Element) => {
      const rect = taskElement.getBoundingClientRect();
      const popupWidth = 410;
      const popupHeight = 550;
      const margin = 16;

      const isTaskVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0;

      const rightSpace = window.innerWidth - rect.right - margin;
      const leftSpace = rect.left - margin;

      let left, top;

      if (rightSpace >= popupWidth) {
        left = rect.right + window.scrollX + margin;
      } else if (leftSpace >= popupWidth) {
        left = rect.left + window.scrollX - popupWidth - margin;
      } else {
        left = Math.max(
          margin,
          (window.innerWidth - popupWidth) / 2 + window.scrollX
        );
      }

      const bottomSpace = window.innerHeight - rect.top;
      if (bottomSpace >= popupHeight) {
        top = rect.top + window.scrollY;
      } else {
        top = Math.max(margin, rect.bottom + window.scrollY - popupHeight);
      }

      setPopupState((prev) => ({
        ...prev,
        position: { top, left },
        isVisible: isTaskVisible,
      }));
    };

    const handleScroll = () => {
      if (popupState.isOpen && popupState.taskId) {
        const taskElement = document.querySelector(
          `[data-task-id="${popupState.taskId}"]`
        );
        if (taskElement) {
          updatePopupPosition(taskElement);
        }
      }
    };

    const handleResize = () => {
      if (popupState.isOpen && popupState.taskId) {
        const taskElement = document.querySelector(
          `[data-task-id="${popupState.taskId}"]`
        );
        if (taskElement) {
          updatePopupPosition(taskElement);
        }
      }
    };

    if (popupState.isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [popupState.isOpen, popupState.taskId]);

  const sortTasksByDate = (taskList: TaskDetails[]) => {
    return [...taskList].sort((a, b) => {
      const dateA = new Date(a.date || a.complete_by || '').getTime();
      const dateB = new Date(b.date || b.complete_by || '').getTime();
      return dateB - dateA;
    });
  };

  const allColumnsEmpty = columns.every((col) => {
    const filtered = kanbanTasks.filter((t) => t.status === col.key);
    return filtered.length === 0;
  });

  if (allColumnsEmpty) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <NoResultsFound
          variant="tasks"
          hasSearchTerm={false}
          className="h-full flex items-center justify-center"
        />
      </div>
    );
  }

  return (
    <div className="relative h-full">
      <div className="flex gap-4 w-full h-full p-3">
        {columns.map((col) => {
          const filtered = kanbanTasks.filter((t) => t.status === col.key);
          const sortedTasks = sortTasksByDate(filtered);

          return (
            <div
              key={col.key}
              className="flex-1 bg-basic-white rounded-2xl p-2 min-w-[320px] flex flex-col"
            >
              <div className="flex items-center gap-2 mb-4 flex-shrink-0 m-2">
                {col.icon}
                <span className="font-semibold text-sm text-basic-black">
                  {col.label}
                </span>
                <Badge variant="ghost" size="sm">
                  {filtered.length}
                </Badge>
              </div>
              <div className="flex-1 overflow-y-auto pr-2">
                {sortedTasks.map((task) => (
                  <KanbanTaskCard
                    key={task.id}
                    task={task}
                    onUpdatePriority={onUpdatePriority}
                    onUpdateStatus={onUpdateStatus}
                    onAcceptTask={onAcceptTask}
                    onDeclineTask={onDeclineTask}
                    onDeleteTask={onDeleteTask}
                    onOpenPopup={openPopup}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TaskMapPopup
        isOpen={popupState.isOpen}
        task={popupState.selectedTask}
        position={popupState.position}
        isVisible={popupState.isVisible}
        onClose={closePopup}
      />
    </div>
  );
};
