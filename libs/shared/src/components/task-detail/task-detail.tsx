'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { BreadcrumbItem, Breadcrumbs } from '../breadcrumbs/breadcrumbs';
import { Trash2, CalendarDays, Check } from 'lucide-react';

import {
  StatusIndicator,
  type TaskStatus,
} from '../status-indicator/status-indicator';
import { Dialog } from '../dialog/dialog';
import { DateTimePicker } from '../date-time-picker/date-time-picker';
import { Button } from '../button/button';
import { TaskDetailTabs } from '../task-detail-tabs/task-detail-tabs';
import { SendToLabDropdown } from './send-to-lab-dropdown';
import { TaskDetails } from '../../types/task';
import { TaskDetailsResponse } from '../../api/services/tasks/task-types';
import { CustomSelect } from '../select/select';
import { CreateTaskForm } from '../create-task-form/create-task-form';
import { format } from 'date-fns';
import { TaskLabInfo } from './task-lab-info';
import { getLabOrderByTaskId } from '../../mock/mock-lab-items';
import { ConfirmationDialog } from '../confirmation-dialog/confirmation-dialog';
import { CustomScrollbar } from '../custom-scrollbar/custom-scrollbar';
import { CommentForm } from '../comment-form/comment-form';
import { formatTaskType } from '../../utils/date-utils';
import { AddButton } from '../add-button/add-button';
import { Icon } from '../icon';
import { Separator } from '../separator/separator';

interface StatusOption {
  value: string;
  label: string;
  icon: string;
}

interface TabItemData {
  id: string;
  label: string;
  count?: number;
}

interface TaskHeaderProps {
  taskId: string;
  title: string;
  taskType: string | null;
  status: string;
  completedDate?: Date | null;
  onStatusChange: (newStatus: string) => void;
  onTaskTypeChange?: (newTaskType: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  isEditing?: boolean;
  onSaveTitle?: (newTitle: string) => void;
  onCancelEdit?: () => void;
  isEditingMode?: boolean;
  onSaveChanges?: () => void;
  onCancelEditMode?: () => void;
  showActionsButton?: boolean;
  onSendToLab?: () => void;
  onCancelLabOrder?: () => void;
  onCreateCSV?: () => void;
  onDownloadCSV?: () => void;
  onImport?: () => void;
  activeTab?: string;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  taskId,
  taskType,
  status,
  completedDate,
  onStatusChange,
  onTaskTypeChange,
  onEdit,
  onDelete,
  isEditingMode = false,
  onSaveChanges,
  onCancelEditMode,
  showActionsButton = true,
  onSendToLab,
  onCancelLabOrder,
  onCreateCSV,
  onDownloadCSV,
  onImport,
  activeTab,
}) => {
  const taskTypeOptions = [
    { value: 'soil_sampler', label: 'Soil Sampler' },
    { value: 'fertilizer_application', label: 'Fertilizer Application' },
    { value: 'pest_control', label: 'Pest Control' },
    { value: 'irrigation', label: 'Irrigation' },
    { value: 'harvesting', label: 'Harvesting' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'other', label: 'Other' },
  ];

  const currentTaskTypeOption = taskTypeOptions.find(
    (option) => option.value === taskType
  );
  const displayOptions = currentTaskTypeOption
    ? taskTypeOptions
    : [
        ...taskTypeOptions,
        { value: taskType || '', label: taskType || 'Select task type' },
      ];

  const statusOptions: StatusOption[] = [
    { value: 'not_started', label: 'Not Started', icon: 'hourglass_bottom' },
    { value: 'in_progress', label: 'In progress', icon: 'timelapse' },
    { value: 'complete', label: 'Completed', icon: 'task_alt' },
    { value: 'cancelled', label: 'Cancelled', icon: 'block' },
  ];

  const formatDisplayDate = (date: Date | null | undefined): string => {
    if (!date) return '';
    try {
      return format(date, 'MMMM d, yyyy | HH:mm');
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 min-w-0">
        <div className="text-basic-green text-2xl md:text-[28px] font-semibold flex-shrink-0">
          #{taskId}
        </div>

        <div className="relative min-w-0">
          <CustomSelect
            options={displayOptions}
            value={taskType || ''}
            onValueChange={(value) => onTaskTypeChange?.(value)}
            disabled={false}
            placeholder="Select task type"
            className="w-full"
            triggerClassName="border-none bg-transparent text-lg md:text-xl lg:text-2xl font-semibold hover:bg-transparent focus:ring-0 w-full flex items-center gap-2 min-w-0"
            renderTrigger={({ selectedOption, isOpen, onClick, disabled }) => (
              <div
                onClick={onClick}
                className="flex items-center gap-2 min-w-0"
              >
                <span className="truncate text-basic-black text-[28px] font-semibold">
                  {selectedOption?.label
                    ? formatTaskType(selectedOption.label)
                    : 'Select task type'}
                </span>
                <span className="material-symbols-outlined text-sm transition-transform duration-200 flex-shrink-0">
                  expand_all
                </span>
              </div>
            )}
            renderPopup={({ options, value, onValueChange, close }) => (
              <div className="bg-white max-h-96 overflow-y-auto rounded-md py-1 w-auto w-full">
                {options.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onValueChange?.(option.value);
                        close();
                      }}
                      className={`
                          w-full flex items-center gap-2 px-3 py-2 text-sm text-left whitespace-nowrap
                         focus:bg-basic-white focus:outline-none
                          transition-colors duration-150 cursor-pointer 
                        `}
                    >
                      <span className="truncate text-sm font-medium flex-1">
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-basic-green flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div className="relative flex-shrink-0">
          <CustomSelect
            options={statusOptions}
            value={status}
            onValueChange={(value) => onStatusChange(value)}
            disabled={false}
            placeholder="Select status"
            className="inline-block"
            useTriggerWidth={false}
            triggerClassName=""
            renderTrigger={({ selectedOption, isOpen, onClick, disabled }) => {
              const statusOption = selectedOption as StatusOption;
              return (
                <div
                  onClick={onClick}
                  className="flex items-center gap-2  border border-basic-white rounded-md px-0.5"
                >
                  {statusOption && (
                    <StatusIndicator
                      status={statusOption.value as TaskStatus}
                      showText={false}
                      iconClassName="text-lg"
                      showTooltip={false}
                    />
                  )}
                  <span className="truncate">
                    {selectedOption?.label || 'Select status'}
                  </span>
                  <span className="material-symbols-outlined text-sm transition-transform duration-200 flex-shrink-0 truncate">
                    expand_all
                  </span>
                </div>
              );
            }}
            renderPopup={({ options, value, onValueChange, close }) => (
              <div className="bg-white max-h-96 overflow-y-auto rounded-md w-full truncate">
                {options.map((option) => {
                  const isSelected = value === option.value;
                  const statusOption = option as StatusOption;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        onValueChange?.(option.value);
                        close();
                      }}
                      className={`
                        w-full flex items-center gap-2 px-2 py-1 text-sm text-left whitespace-nowrap
                        hover:bg-basic-white focus:bg-basic-white focus:outline-none
                        transition-colors duration-150 cursor-pointer
                      `}
                    >
                      <span
                        className={`material-symbols-outlined text-lg ${
                          isSelected ? 'text-basic-green' : 'text-basic-gray'
                        }`}
                      >
                        <StatusIndicator
                          status={statusOption.value as TaskStatus}
                          showText={false}
                          iconClassName="text-lg"
                        />
                      </span>
                      <span className="text-sm font-medium flex-1">
                        {option.label}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 ml-5 text-basic-green" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
        {/* 
        {completedDate &&
          status === 'complete' &&
          !isNaN(completedDate.getTime()) && (
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-basic-gray flex-shrink-0 text-sm">
                Completed:
              </span>
              <span className="text-basic-black font-medium truncate text-sm">
                {format(completedDate, 'MMM d, HH:mm')}
              </span>
            </div>
          )} */}

        <div className="flex items-center space-x-3 flex-shrink-0 ml-auto">
          {showActionsButton && (
            <div className="flex items-center ml-4 gap-2">
              <Icon icon="edit" onClick={onEdit} />
              <Separator />
              <Icon icon="delete" onClick={onDelete} />
              <Separator />
              <SendToLabDropdown
                isEditingMode={isEditingMode}
                onSendToLab={onSendToLab}
                onCancelLabOrder={onCancelLabOrder}
                onCreateCSV={onCreateCSV}
                onDownloadCSV={onDownloadCSV}
                onImport={onImport}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type FileCardAttachment = {
  name: string;
  url: string;
  type: 'pdf' | 'docx' | 'image' | 'zip' | 'code' | 'text' | 'other';
};

interface TaskDetailProps {
  taskId: string;
  taskData: TaskDetailsResponse | null;
  breadcrumbItems: BreadcrumbItem[];
  tabItemsData: TabItemData[];
  onEditTask?: (taskId: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onTaskComplete?: (taskId: string, completedDate: Date) => void;
  onTaskTypeChange?: (taskId: string, newTaskType: string) => void;
  onTaskUpdate?: (taskId: string, updatedData: Partial<TaskDetails>) => void;
  onStatusChange?: (newStatus: string) => void;
  initialActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  activeTab?: string;
  children?: React.ReactNode;
  formValues?: any;
  selectedFarms?: Record<string, string[]>;
  onFormChange?: (field: string, value: string) => void;
  onFarmsChange?: (farmId: string, selectedFields: string[]) => void;
  showTaskTypeDropdown?: boolean;
  clientsData?: any[];
  selectedClient?: any;
  onZoomToFarm?: (farmId: string) => void;
  onSendToLab?: () => void;
  onCancelLabOrder?: () => void;
  onCreateCSV?: () => void;
  onDownloadCSV?: () => void;
  onImport?: () => void;
  currentUser?: { name: string; avatarSrc?: string; avatarInitials?: string };
  onAddNewComment?: (commentText: string) => void;
  onUpdateComment?: (commentId: string, newText: string) => void;
  onStartCommentEdit?: (commentId: string, commentText: string) => void;
  onCancelCommentEdit?: () => void;
  editingComment?: { id: string; text: string } | null;
  onCancelEditMode?: () => void;
  onSaveChanges?: () => void;
  sendLaterAlsoSaves?: boolean;
  resetExpanded?: boolean;
  labs?: any[];
  isSaving?: boolean;
}

export const TaskDetail: React.FC<TaskDetailProps> = ({
  taskId,
  taskData,
  breadcrumbItems,
  tabItemsData,
  onEditTask,
  onDeleteTask,
  onTaskComplete,
  onTaskTypeChange,
  onTaskUpdate,
  onStatusChange,
  initialActiveTab = 'overview',
  onTabChange,
  activeTab,
  children,
  formValues: externalFormValues,
  selectedFarms: externalSelectedFarms,
  onFormChange,
  onFarmsChange,
  showTaskTypeDropdown = true,
  clientsData,
  selectedClient,
  onZoomToFarm,
  onSendToLab,
  onCancelLabOrder,
  onCreateCSV,
  onDownloadCSV,
  onImport,
  currentUser,
  onAddNewComment,
  onUpdateComment,
  onStartCommentEdit,
  onCancelCommentEdit,
  editingComment,
  onCancelEditMode,
  onSaveChanges: externalOnSaveChanges,
  sendLaterAlsoSaves = false,
  resetExpanded: externalResetExpanded,
  labs: externalLabs,
  isSaving = false,
}) => {
  const [isCompletionDialogOpen, setIsCompletionDialogOpen] = useState(false);
  const [completedDate, setCompletedDate] = useState<Date | null>(() => {
    if (
      taskData?.task?.status?.toLowerCase() === 'complete' &&
      taskData?.task?.complete_by
    ) {
      try {
        return new Date(taskData.task.complete_by);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLabSendUpdateDialogOpen, setIsLabSendUpdateDialogOpen] =
    useState(false);
  const [hasFormChanges, setHasFormChanges] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [taskTitle, setTaskTitle] = useState(
    taskData?.task?.task_number || taskData?.task?.id || ''
  );
  const [headerStatus, setHeaderStatus] = useState(
    taskData?.task?.status?.toLowerCase().replace(' ', '_') || 'not_started'
  );
  const [internalFormValues, setInternalFormValues] = useState(() => ({
    lab: taskData?.task?.lab?.toString() || '',
    client: taskData?.task?.farmer?.id?.toString() || '',
    taskType: taskData?.task?.task_type || 'soil_sampling',
    assignedTo: taskData?.task?.assigned_to_organisation?.id?.toString() || '',
    assignedUser: taskData?.task?.assigned_to_user?.[0]?.id?.toString() || '',
    priority: taskData?.task?.priority || 'normal',
    startAfter: taskData?.task?.active_date || '',
    completeBy: taskData?.task?.complete_by || '',
    description: taskData?.task?.notes || '',
  }));

  const [internalSelectedFarms, setInternalSelectedFarms] = useState<
    Record<string, string[]>
  >({});

  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [internalResetExpanded, setInternalResetExpanded] = useState(false);

  const formValues = externalFormValues || internalFormValues;
  const selectedFarms = externalSelectedFarms || internalSelectedFarms;

  useEffect(() => {
    if (editingComment) {
      setIsEditingComment(true);
      setEditingCommentText(editingComment.text);
    } else {
      setIsEditingComment(false);
      setEditingCommentText('');
    }
  }, [editingComment]);

  useEffect(() => {
    if (taskData?.task?.status) {
      setHeaderStatus(taskData.task.status.toLowerCase().replace(' ', '_'));
    }
  }, [taskData?.task?.status]);

  useEffect(() => {
    if (!onFormChange) {
      setInternalFormValues({
        lab: taskData?.task?.lab?.toString() || '',
        client: taskData?.task?.farmer?.id?.toString() || '',
        taskType: taskData?.task?.task_type || 'soil_sampling',
        assignedTo:
          taskData?.task?.assigned_to_organisation?.id?.toString() || '',
        assignedUser:
          taskData?.task?.assigned_to_user?.[0]?.id?.toString() || '',
        priority: taskData?.task?.priority || 'normal',
        startAfter: taskData?.task?.active_date || '',
        completeBy: taskData?.task?.complete_by || '',
        description: taskData?.task?.notes || '',
      });
    }

    if (!onFarmsChange) {
      setInternalSelectedFarms({});
    }
  }, [
    taskData?.task?.lab,
    taskData?.task?.task_type,
    taskData?.task?.priority,
    taskData?.task?.active_date,
    taskData?.task?.complete_by,
    taskData?.task?.notes,
    taskData?.task?.farmer?.id,
    taskData?.task?.assigned_to_organisation?.id,
    taskData?.task?.assigned_to_user,
    onFormChange,
    onFarmsChange,
  ]);

  const handleCancelCommentEdit = () => {
    setIsEditingComment(false);
    setEditingCommentText('');
    if (onCancelCommentEdit) {
      onCancelCommentEdit();
    }
  };

  const handleCommentSubmit = (commentText: string) => {
    if (isEditingComment) {
      if (onUpdateComment && editingComment) {
        onUpdateComment(editingComment.id, commentText);
      }
      setIsEditingComment(false);
      setEditingCommentText('');
    } else if (onAddNewComment) {
      onAddNewComment(commentText);
    }
  };

  const isFormValid = true;

  const currentActiveTab = activeTab || initialActiveTab;
  const showActionsButton = true;

  const getClientFarms = (clientId: string) => {
    if (taskData?.task?.farmer && clientId === taskData.task.farmer.id) {
      return [
        {
          id: 'UkLWZg9DAJ',
          name: 'Main Farm',
          area: 150.5,
          clientId: clientId,
          fields: [
            {
              value: 'fake-field-1',
              label: 'Field A',
              area: 75.2,
              zones: [
                {
                  value: 'fake-zone-1',
                  label: 'Zone 1',
                  area: 25.1,
                  coordinates: [
                    [
                      [
                        [-8.23, 53.42],
                        [-8.22, 53.42],
                        [-8.22, 53.41],
                        [-8.23, 53.41],
                        [-8.23, 53.42],
                      ],
                    ],
                  ],
                },
                {
                  value: 'fake-zone-2',
                  label: 'Zone 2',
                  area: 50.1,
                  coordinates: [
                    [
                      [
                        [-8.22, 53.42],
                        [-8.21, 53.42],
                        [-8.21, 53.41],
                        [-8.22, 53.41],
                        [-8.22, 53.42],
                      ],
                    ],
                  ],
                },
              ],
            },
            {
              value: 'fake-field-2',
              label: 'Field B',
              area: 75.3,
              zones: [
                {
                  value: 'fake-zone-3',
                  label: 'Zone 3',
                  area: 75.3,
                  coordinates: [
                    [
                      [
                        [-8.21, 53.42],
                        [-8.2, 53.42],
                        [-8.2, 53.41],
                        [-8.21, 53.41],
                        [-8.21, 53.42],
                      ],
                    ],
                  ],
                },
              ],
            },
          ],
        },
      ];
    }

    if (clientsData) {
      let client = clientsData.find((c: any) => c.id === clientId);
      if (!client) {
        client = clientsData.find((c: any) => c.name === clientId);
      }
      if (client) {
        return client.farms.map((farm: any) => ({
          id: farm.id,
          name: farm.name,
          area: farm.size,
          clientId: client.id,
          fields: farm.fields.map((field: any) => ({
            value: field.id,
            label: field.name,
            area: field.area,
            children: field.zones.map((zone: any) => ({
              value: zone.id,
              label: zone.name,
              area: field.area / field.zones.length,
            })),
          })),
          selectedFields: [],
          remainingCount: 0,
          total: farm.fields.reduce(
            (total: number, field: any) => total + field.zones.length,
            0
          ),
          isActive: true,
        }));
      }
    }

    return [];
  };

  const currentClientFarms = getClientFarms(formValues.client);

  const taskTypes = [
    { value: 'soil_sampling', label: 'Soil sampling' },
    { value: 'pesticide_spraying', label: 'Pesticide spraying' },
    { value: 'fertilizer_application', label: 'Fertilizer application' },
    { value: 'drainage_inspection', label: 'Drainage inspection' },
    { value: 'soil_preparation', label: 'Soil preparation' },
  ];

  const clients = useMemo(() => {
    const clientList: Array<{ value: string; label: string }> = [];

    if (taskData?.task?.farmer) {
      clientList.push({
        value: taskData.task.farmer.id,
        label: taskData.task.farmer.name,
      });
    }

    if (clientsData) {
      clientsData.forEach((client: any) => {
        if (!clientList.find((c) => c.value === client.id)) {
          clientList.push({
            value: client.id,
            label: client.name,
          });
        }
      });
    }

    return clientList;
  }, [taskData?.task?.farmer, clientsData]);

  const labs: { value: string; label: string }[] =
    externalLabs?.map((lab: any) => ({
      value: lab.id.toString(),
      label: lab.name,
    })) || [];

  const organizations = useMemo(() => {
    const organizations = [];

    if (taskData?.task?.assigned_to_organisation) {
      const apiOrg = taskData.task.assigned_to_organisation;
      const apiUsers =
        taskData.task.assigned_to_user?.map((user: any) => ({
          value: user.id,
          label: `${user.first_name} ${user.last_name}`,
        })) || [];

      const apiOrganization = {
        value: apiOrg.id,
        label: apiOrg.name,
        distance: 0,
        tasks: 0,
        own: false,
        users: apiUsers,
      };

      organizations.push(apiOrganization);
    }

    return organizations;
  }, [
    taskData?.task?.assigned_to_organisation,
    taskData?.task?.assigned_to_user,
  ]);

  const priorities = useMemo(() => {
    if (taskData?.priorities) {
      return Object.entries(taskData.priorities).map(([key, label]) => ({
        value: key,
        label: label,
      }));
    }
    return [
      { value: 'normal', label: 'Normal' },
      { value: 'high', label: 'Hisgh' },
      // { value: 'urgent', label: 'Urgent' },
    ];
  }, [taskData?.priorities]);

  const handleTaskComplete = () => {
    if (completedDate && onTaskComplete) {
      onTaskComplete(taskData?.task?.id || '', completedDate);
      setHeaderStatus('complete');
      setIsCompletionDialogOpen(false);
      if (onTaskUpdate) {
        onTaskUpdate(taskData?.task?.id || '', { status: 'complete' });
      }
    }
  };

  const handleSaveTitle = (newTitle: string) => {
    setTaskTitle(newTitle);
    setIsEditingTitle(false);
  };
  const handleCancelEdit = () => setIsEditingTitle(false);

  const handleEditMode = () => {
    setIsEditingMode(true);
    onEditTask?.(taskData?.task?.id || '');
  };

  const handleSaveChanges = () => {
    setIsLabSendUpdateDialogOpen(true);
  };

  const saveTaskChanges = () => {
    setIsEditingMode(false);
    setIsLabSendUpdateDialogOpen(false);
    setInternalResetExpanded(true);
    setTimeout(() => setInternalResetExpanded(false), 100);

    if (externalOnSaveChanges) {
      externalOnSaveChanges();
    }

    if (onTaskUpdate) {
      onTaskUpdate(taskData?.task?.id || '', {});
    }
  };

  const handleSendLater = () => {
    saveTaskChanges();
  };

  const handleCancelEditMode = () => {
    setIsEditingMode(false);
    setInternalResetExpanded(true);
    setTimeout(() => setInternalResetExpanded(false), 100);

    if (onCancelEditMode) {
      onCancelEditMode();
    } else {
      if (!onFormChange) {
        setInternalFormValues({
          lab: taskData?.task?.lab?.toString() || '',
          client: taskData?.task?.farmer?.id?.toString() || '',
          taskType: taskData?.task?.task_type || 'soil_sampling',
          assignedTo:
            taskData?.task?.assigned_to_organisation?.id?.toString() || '',
          assignedUser:
            taskData?.task?.assigned_to_user?.[0]?.id?.toString() || '',
          priority: taskData?.task?.priority || 'normal',
          startAfter: taskData?.task?.active_date || '',
          completeBy: taskData?.task?.complete_by || '',
          description: taskData?.task?.notes || '',
        });
      }
      if (!onFarmsChange) {
        setInternalSelectedFarms({});
      }
    }
  };

  const handleStatusChange = (newStatus: string) => {
    // if (newStatus === 'complete') {
    //   setIsCompletionDialogOpen(true);
    // } else {
    setHeaderStatus(newStatus);
    if (headerStatus === 'complete') {
      setCompletedDate(null);
    }
    if (onStatusChange) {
      onStatusChange(newStatus);
    } else if (onTaskUpdate) {
      onTaskUpdate(taskData?.task?.id || '', { status: newStatus });
    }
    // }
  };

  const mappedTask = {
    id: taskData?.task?.task_number || taskData?.task?.id || '',
    title: taskTitle,
    status: headerStatus,
    priority: 'Normal',
    startAfter: taskData?.task?.active_date,
    completeBy: taskData?.task?.complete_by || '',
    client: { name: taskData?.task?.client?.name || '' },
    farms: [
      { name: taskData?.task?.client?.name || '', completed: 0, total: 0 },
    ],
    lab: taskData?.task?.lab?.toString() || '',
    assignedTo: [{ name: taskData?.task?.advisor || '', isOwner: false }],
    attachments: [] as FileCardAttachment[],
    description: taskData?.task?.notes || '',
  };

  return (
    <div className="flex flex-col h-screen">
      <div>
        <div className="p-5 bg-white border-b border-basic-white rounded-t-xl flex items-center justify-between">
          <Breadcrumbs items={breadcrumbItems} />
          <AddButton buttonText="Add" />
        </div>
        <div className="px-5 pt-5">
          <TaskHeader
            taskId={taskData?.task?.task_number || ''}
            title={mappedTask.title || ''}
            taskType={taskData?.task?.task_type || ''}
            status={headerStatus}
            completedDate={completedDate}
            onStatusChange={handleStatusChange}
            onTaskTypeChange={(newTaskType) =>
              onTaskTypeChange?.(taskData?.task?.id || '', newTaskType)
            }
            isEditing={isEditingTitle}
            onEdit={handleEditMode}
            onSaveTitle={handleSaveTitle}
            onCancelEdit={handleCancelEdit}
            onDelete={() => setIsDeleteDialogOpen(true)}
            isEditingMode={isEditingMode}
            onSaveChanges={handleSaveChanges}
            onCancelEditMode={handleCancelEditMode}
            onSendToLab={onSendToLab}
            onCancelLabOrder={onCancelLabOrder}
            onCreateCSV={onCreateCSV}
            onDownloadCSV={onDownloadCSV}
            onImport={onImport}
            activeTab={currentActiveTab}
          />
        </div>
        {(() => {
          const labOrder = getLabOrderByTaskId(taskData?.task?.id || '');
          if (labOrder) {
            return (
              <TaskLabInfo
                labNumber={labOrder.labOrderNo}
                sentDate={labOrder.sentDate}
                receivedDate={labOrder.receivedDate}
                status={labOrder.status}
                useMockData={false}
                showAdditionalInfo={true}
                className="px-5"
                labOrder={labOrder}
              />
            );
          }
          return null;
        })()}
      </div>
      <TaskDetailTabs
        activeTab={currentActiveTab}
        onTabChange={onTabChange || (() => undefined)}
        tabItems={tabItemsData}
        className="p-5"
      />

      {currentActiveTab === 'overview' ||
      currentActiveTab === 'activity-log' ? (
        <CustomScrollbar className="flex-1 min-h-0">
          {currentActiveTab === 'overview' && (
            <div className={isEditingMode ? 'bg-white' : 'bg-transparent'}>
              <CreateTaskForm
                taskTypes={taskTypes}
                organizations={organizations}
                priorities={priorities}
                labs={labs}
                values={formValues}
                showTaskTypeDropdown={showTaskTypeDropdown}
                isDisabled={!isEditingMode}
                farms={currentClientFarms}
                selectedFarms={selectedFarms}
                resetExpanded={externalResetExpanded || internalResetExpanded}
                selectedLab={taskData?.task?.lab?.toString()}
                selectedStartAfter={taskData?.task?.active_date}
                selectedCompleteBy={taskData?.task?.complete_by}
                selectedOrganization={taskData?.task?.assigned_to_organisation}
                selectedUser={taskData?.task?.assigned_to_user?.[0]}
                selectedPriority={taskData?.task?.priority}
                onChange={(field, value) => {
                  if (onFormChange) {
                    onFormChange(field, value);
                  } else {
                    setInternalFormValues((prev) => ({
                      ...prev,
                      [field]: value,
                    }));
                  }

                  if (field === 'client') {
                    if (onFarmsChange) {
                      Object.keys(selectedFarms).forEach((farmId) => {
                        onFarmsChange(farmId, []);
                      });
                    } else {
                      setInternalSelectedFarms({});
                    }
                  }

                  if (onTaskUpdate) {
                    const updatedData: Partial<TaskDetails> = {};
                    switch (field) {
                      case 'taskType':
                        updatedData.task_type = value;
                        break;
                      case 'client':
                        updatedData.farmer_name = value;
                        break;
                      case 'lab':
                        updatedData.lab = value;
                        break;
                      case 'startAfter':
                        updatedData.date = value;
                        break;
                      case 'completeBy':
                        updatedData.complete_by = value;
                        break;
                      case 'description':
                        updatedData.reporting_status = value;
                        break;
                    }
                    onTaskUpdate(taskData?.task?.id || '', updatedData);
                  }
                }}
                onSubmit={(e) => {
                  e.preventDefault();
                }}
                onFarmsChange={(farmId, selectedFields) => {
                  if (onFarmsChange) {
                    onFarmsChange(farmId, selectedFields);
                  } else {
                    setInternalSelectedFarms((prev) => ({
                      ...prev,
                      [farmId]: selectedFields,
                    }));
                  }
                }}
                attachedFiles={[]}
                isLoading={false}
                onZoomToFarm={onZoomToFarm}
                showActionButtons={isEditingMode}
                onCancel={handleCancelEditMode}
                onSave={handleSaveChanges}
                isFormValid={isFormValid}
                isSubmitting={isSaving}
                allowSave={isFormValid}
                isEditing={true}
              />
            </div>
          )}
          {currentActiveTab === 'activity-log' && children}
        </CustomScrollbar>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="pb-5 pt-1 px-5 h-full">{children}</div>
        </div>
      )}

      {currentUser &&
        onAddNewComment &&
        currentActiveTab === 'activity-log' && (
          <div className="">
            <CommentForm
              currentUser={currentUser}
              onSubmit={handleCommentSubmit}
              placeholder="Add a comment to this activity..."
              className="p-5 bg-white  sticky bottom-0  border-t border-basic-white z-10"
              isEditing={isEditingComment}
              editingCommentText={editingCommentText}
              onCancelEdit={handleCancelCommentEdit}
            />
          </div>
        )}

      <Dialog
        isOpen={isCompletionDialogOpen}
        onClose={() => {
          setIsCompletionDialogOpen(false);
          setCompletedDate(null);
        }}
        title={
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-basic-green">
              task_alt
            </span>
            <h1 className="text-xl font-semibold">Complete Task</h1>
          </div>
        }
      >
        <div className="mt-5">
          <p className="basic-black text-sm font-normal mb-2">Competed date</p>
          <div className="relative ">
            <DateTimePicker
              value={completedDate}
              onChange={(date) => {
                setCompletedDate(date);
              }}
              className="w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CalendarDays
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
        <Button
          onClick={handleTaskComplete}
          className="w-full bg-basic-green mt-5 text-white flex items-center justify-center py-3 px-4 rounded-lg font-semibold hover:bg-basic-green-dark transition-colors duration-200 "
          disabled={!completedDate}
        >
          Save
        </Button>
      </Dialog>
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDeleteTask?.(taskId);
        }}
        title="Delete task!"
        message={(() => {
          const labOrder = getLabOrderByTaskId(taskData?.task?.id || '');
          const baseMessage =
            'Are you sure you want to delete this task? This action is irreversible.';
          return labOrder
            ? `${baseMessage} The lab order No: ${labOrder.labOrderNo} will also be permanently deleted.`
            : baseMessage;
        })()}
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonVariant="danger"
        size="lg"
        icon={
          <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-red-600 text-xl">
              delete
            </span>
          </div>
        }
      />

      <ConfirmationDialog
        isOpen={isLabSendUpdateDialogOpen}
        onClose={() => setIsLabSendUpdateDialogOpen(false)}
        onConfirm={saveTaskChanges}
        onCancel={handleSendLater}
        title={hasFormChanges ? 'Send lab update' : 'Send to lab'}
        message={
          hasFormChanges
            ? "This task already has a lab order, but you've made changes to the lab or sample details that may affect it. Do you want to send an updated order to the lab now?"
            : 'This task already has a lab order. Do you want to send it to the lab now?'
        }
        confirmText={hasFormChanges ? 'Send update to lab' : 'Send to lab'}
        cancelText="Send later"
        confirmButtonVariant="primary"
        size="md"
        icon={
          <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-green-600 text-xl">
              {hasFormChanges ? 'drive_folder_upload' : 'send'}
            </span>
          </div>
        }
      />
    </div>
  );
};
