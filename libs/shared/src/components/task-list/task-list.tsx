import React, { useMemo } from 'react';
import { Flag } from '../flag/flag';
import { Avatar } from '../avatar/avatar';
import { NoResultsFound } from '../no-results-found/no-results-found';
import { Button } from '../button/button';
import { X, Check, Calendar } from 'lucide-react';
import { TaskDetails } from '../../types/task';
import { format } from 'date-fns';
import { TaskDropdownActions } from '../tasks/task-dropdown-actions';
import { formatTaskType } from '../../utils';

interface TaskCardProps extends TaskDetails {
  onAccept?: () => void;
  onDecline?: () => void;
  showActions?: boolean;
  onUpdatePriority?: (id: string, flag: 'normal' | 'high' | 'none') => void;
  onUpdateStatus?: (
    id: string,
    status: 'pending' | 'in_progress' | 'complete' | 'cancelled' | 'not_started'
  ) => void;
  onDeleteTask?: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<TaskDetails>) => void;
  onViewOnMap?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  assigneeOptions?: Array<{
    value: string;
    label: string;
    initials?: string;
    avatar?: string;
  }>;
  showFilters?: boolean;
  shouldCloseOnAction?: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  id,
  farmer_name,
  farms,
  soil_sampler,
  date,
  status,
  onAccept,
  onDecline,
  showActions = false,
  onUpdatePriority,
  onUpdateStatus,
  onDeleteTask,
  onUpdateTask,
  onViewOnMap,
  onViewDetails,
  assigneeOptions,
  showFilters = true,
  task_type,
  shouldCloseOnAction = false,
  task_has_unmatched_samples,
  task_has_tests_without_lab_result,
  task_has_not_started_test,
  ...rest
}) => {
  const isCompleted = status === 'completed';
  const isTaskNotStarted = status === 'not_started';
  const isTaskCancelled = status === 'cancelled';

  let flagVariant: 'normal' | 'high' | 'none' = 'normal';
  if (isTaskNotStarted) {
    flagVariant = 'normal';
  } else if (task_has_unmatched_samples || task_has_tests_without_lab_result) {
    flagVariant = 'high';
  } else if (task_has_not_started_test) {
    flagVariant = 'none';
  }

  const shouldShowAcceptDeclineButtons = isTaskNotStarted;
  const isTaskAccepted = !isTaskNotStarted && !isTaskCancelled;

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
      | 'not_started'
  ) => {
    onUpdateStatus?.(taskId, newStatus);
  };

  const handleAcceptTask = () => {
    onAccept?.();
    onUpdateStatus?.(id, 'not_started');
  };

  const handleDeclineTask = () => {
    onDecline?.();
    onUpdateStatus?.(id, 'cancelled');
  };

  const handleDeleteTask = (taskId: string) => onDeleteTask?.(taskId);

  const formatDisplayDate = (dateString: string | null | undefined): string => {
    if (!dateString) return '';

    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? '' : format(date, 'MMMM d');
    } catch {
      return '';
    }
  };

  const renderTaskActions = () => {
    return (
      <TaskDropdownActions
        taskId={id}
        status={status}
        isAccepted={isTaskAccepted}
        task_has_unmatched_samples={task_has_unmatched_samples}
        task_has_tests_without_lab_result={task_has_tests_without_lab_result}
        task_has_not_started_test={task_has_not_started_test}
        onAcceptTask={handleAcceptTask}
        onDeclineTask={handleDeclineTask}
        onUpdateStatus={handleUpdateStatus}
        onUpdatePriority={handleUpdatePriority}
        onDeleteTask={handleDeleteTask}
        onViewOnMap={onViewOnMap ? () => onViewOnMap(id) : undefined}
        onViewDetails={onViewDetails ? () => onViewDetails(id) : undefined}
        shouldCloseOnAction={shouldCloseOnAction}
      />
    );
  };

  const renderAcceptDeclineButtons = () => (
    <div className="flex gap-2">
      <Button
        variant="decline"
        onClick={handleDeclineTask}
        className="px-5 py-2 h-7"
      >
        <X className="w-5 h-5" /> Decline
      </Button>
      <Button
        variant="default"
        onClick={handleAcceptTask}
        className="px-5 py-1 h-7"
      >
        <Check className="w-5 h-5" /> Accept
      </Button>
    </div>
  );

  const displayDate = status === 'completed' ? rest.complete_by : date;
  const clientName = farmer_name;

  return (
    <div
      className={`${
        isTaskNotStarted ? 'bg-[#EEF0F666]' : 'bg-white'
      } rounded-lg p-4 shadow-sm mb-4 border text-sm border-transparent`}
    >
      {/* First Row: drag_button/red_dot, flag, client, date */}
      <div className="flex items-center gap-2 mb-3">
        {/* Left side: drag/dot + flag with fixed width */}
        <div
          className={`flex items-center gap-2 ${
            isTaskNotStarted ? 'w-10' : 'w-12'
          } flex-shrink-0`}
        >
          {isTaskNotStarted ? (
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF323F] flex-shrink-0" />
          ) : (
            <span className="material-symbols-outlined text-[#DBDEE8] flex-shrink-0 cursor-move">
              drag_handle
            </span>
          )}
          <Flag
            variant={flagVariant}
            size="md"
            tooltipContent={flagVariant === 'high' ? 'High' : 'Normal'}
            className="flex-shrink-0"
          />
        </div>

        {/* Right side: client, date, actions */}
        <div className="flex items-center justify-between flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Avatar
              size="md"
              avatarSrc=""
              tooltipText={clientName}
              rounded="md"
              row={{
                original: {
                  client: {
                    name: clientName,
                    surname: '',
                    avatarSrc: '',
                  },
                },
              }}
              className="flex-shrink-0"
            />

            <span className="text-sm font-medium text-basic-black truncate">
              {clientName}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-basic-gray" />
              <span className="text-sm font-medium text-basic-black">
                {formatDisplayDate(displayDate)}
              </span>
            </div>

            <div className="flex items-center justify-center">
              {renderTaskActions()}
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: ID, type, and description - aligned with right part */}
      <div
        className={`mb-3 flex flex-col gap-1 ${
          isTaskNotStarted ? 'ml-[48px]' : 'ml-[56px]'
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`text-sm text-basic-gray flex-shrink-0 ${
              isCompleted ? 'opacity-40' : ''
            }`}
          >
            #{id}
          </span>
          <span
            className={`text-sm text-basic-black flex-shrink-0 ${
              isCompleted ? 'opacity-40' : ''
            }`}
          >
            {formatTaskType(task_type)}
          </span>
        </div>
        {(rest.notes || farms) && (
          <span
            className={`text-sm text-basic-gray ${
              isCompleted ? 'opacity-40' : ''
            }`}
          >
            {rest.notes || farms}
          </span>
        )}
      </div>

      {/* Third Row: 2 buttons - aligned with right part */}
      {shouldShowAcceptDeclineButtons && (
        <div className="mt-2 ml-[48px]">{renderAcceptDeclineButtons()}</div>
      )}
    </div>
  );
};

interface TaskListProps {
  tasks?: TaskDetails[];
  onAcceptTask?: (task: TaskDetails) => void;
  onDeclineTask?: (task: TaskDetails) => void;
  showActions?: boolean;
  onUpdatePriority?: (id: string, flag: 'normal' | 'high' | 'none') => void;
  onUpdateStatus?: (
    id: string,
    status: 'pending' | 'in_progress' | 'complete' | 'cancelled' | 'not_started'
  ) => void;
  onDeleteTask?: (id: string) => void;
  onUpdateTask?: (id: string, updates: Partial<TaskDetails>) => void;
  onViewOnMap?: (taskId: string) => void;
  onViewDetails?: (taskId: string) => void;
  assigneeOptions?: Array<{
    value: string;
    label: string;
    initials?: string;
    avatar?: string;
  }>;
  showFilters?: boolean;
  shouldCloseOnAction?: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks = [],
  onAcceptTask,
  onDeclineTask,
  showActions = false,
  onUpdatePriority,
  onUpdateStatus,
  onDeleteTask,
  onUpdateTask,
  onViewOnMap,
  onViewDetails,
  assigneeOptions,
  showFilters = true,
  shouldCloseOnAction = false,
}) => {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status === 'not_started' && b.status !== 'not_started') return -1;
      if (a.status !== 'not_started' && b.status === 'not_started') return 1;

      const dateA = new Date(a.date || a.complete_by || '').getTime();
      const dateB = new Date(b.date || b.complete_by || '').getTime();
      return dateA - dateB;
    });
  }, [tasks]);

  return (
    <div className="bg-white min-h-0">
      {sortedTasks.length === 0 ? (
        <NoResultsFound
          variant="tasks"
          hasSearchTerm={false}
          className="h-full flex items-center justify-center"
        />
      ) : (
        sortedTasks.map((task) => (
          <TaskCard
            key={task.id}
            {...task}
            showActions={showActions}
            onAccept={onAcceptTask ? () => onAcceptTask(task) : undefined}
            onDecline={onDeclineTask ? () => onDeclineTask(task) : undefined}
            onUpdatePriority={onUpdatePriority}
            onUpdateStatus={onUpdateStatus}
            onDeleteTask={onDeleteTask}
            onUpdateTask={onUpdateTask}
            onViewOnMap={onViewOnMap ? () => onViewOnMap(task.id) : undefined}
            onViewDetails={
              onViewDetails ? () => onViewDetails(task.id) : undefined
            }
            assigneeOptions={assigneeOptions}
            showFilters={showFilters}
            shouldCloseOnAction={shouldCloseOnAction}
          />
        ))
      )}
    </div>
  );
};
