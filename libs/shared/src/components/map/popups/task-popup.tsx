'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './task-popup.css';
import { StatusIndicator } from '../../status-indicator/status-indicator';
import { Flag } from '../../flag/flag';
import { Avatar } from '../../avatar/avatar';

export interface TaskPopupData {
  id: string;
  organisation_name: string;
  organisation_id: number;
  assigned_to_organisation: number | null;
  farmer_name: string;
  task_type: string | null;
  farms: string;
  lab: string;
  no_of_samples: number;
  farmer_address: string;
  soil_sampler: string | null;
  farmteam_task_number: string;
  id_number: number;
  task_has_not_started_test: boolean;
  task_has_unmatched_samples: boolean;
  task_has_tests_without_lab_result: boolean;
  reporting_status: string | null;
  assigned_to: number;
  task_creator: number;
  farmer_organisation_id: number;
  complete_by: string | null;
  date: string;
  start_at: string;
  tests: any[];
  created_by: number;
  issues_approve_by: number | null;
  combine_task_report: number;
  combine_soil_analysis_report: number;
  title: string;
  status: string;
  color?: string;
  longitude: number;
  latitude: number;
  advisor?: string;
  priority?: 'normal' | 'high' | 'none';
  description?: string;
  created_date?: string;
  assigned_users?: Array<{
    name: string;
    surname: string;
    avatarSrc?: string;
  }>;
}

interface TaskPopupProps {
  map: mapboxgl.Map | null;
  task: TaskPopupData | null;
  isVisible: boolean;
  onClose: () => void;
  onTaskClick?: (task: TaskPopupData) => void;
}

const getPriorityFlag = (task: TaskPopupData): 'normal' | 'high' | 'none' => {
  if (
    task.task_has_unmatched_samples ||
    task.task_has_tests_without_lab_result
  ) {
    return 'high';
  } else if (task.task_has_not_started_test) {
    return 'none';
  }
  return 'normal';
};

const getStatusForIndicator = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'in_progress' as const;
    case 'completed':
    case 'complete':
      return 'complete' as const;
    case 'Not Started':
      return 'not_started' as const;
    default:
      return 'not_started' as const;
  }
};

const formatShortDate = (dateString: string | null | undefined): string => {
  if (
    !dateString ||
    dateString === 'Invalid Date' ||
    dateString.trim() === ''
  ) {
    return 'No date';
  }

  try {
    let date: Date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      date = new Date(dateString + 'T00:00:00');
    } else {
      date = new Date(dateString);
    }

    if (isNaN(date.getTime())) {
      return 'Invalid date';
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    return 'Invalid date';
  }
};

const getStartDate = (task: TaskPopupData): string => {
  return 'June 10';
};

const getDueDate = (task: TaskPopupData): string => {
  if (task.status === 'completed') {
    return formatShortDate(task.complete_by);
  }
  return formatShortDate(task.date);
};

const TaskPopupContent: React.FC<{
  task: TaskPopupData;
  onClose: () => void;
}> = ({ task, onClose }) => {
  const priority = getPriorityFlag(task);
  const isAssigned = task.assigned_to > 0;
  const hasNoOrg = task.assigned_to_organisation === null;

  return (
    <div className="task-popup p-[14px] gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Flag variant={priority} size="sm" />
          <span className="text-sm text-basic-black">
            <span className="text-basic-gray">#{task.id}</span>{' '}
            {task.task_type || 'Soil sampling'}
          </span>
        </div>
        <button
          className="text-basic-gray hover:text-basic-black transition-colors"
          onClick={onClose}
        >
          <span className="material-symbols-outlined text-lg">close</span>
        </button>
      </div>

      <div className="mb-4">
        <p className="text-sm text-basic-gray">
          {task.reporting_status ||
            `Collect soil samples from designated locations to assess soil composition...`}
        </p>
      </div>

      <div className="flex items-center">
        <Avatar
          row={{
            original: {
              client: {
                name: task.farmer_name,
                surname: '',
                avatarSrc: 'https://i.pravatar.cc/40?img=1',
              },
            },
          }}
          tooltipText={task.farmer_name}
          rounded="md"
          size="ssm"
          className="flex-shrink-0"
        />

        <div className="w-px h-4 bg-gray-300 mx-2"></div>

        {hasNoOrg ? (
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-sm text-gray-500">
              add
            </span>
          </div>
        ) : !task.soil_sampler || !task.soil_sampler.trim() ? (
          isAssigned ? (
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-gray-500">
                add
              </span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-sm text-gray-500">
                add
              </span>
            </div>
          )
        ) : (
          <Avatar
            row={{
              original: {
                client: {
                  name: task.soil_sampler,
                  surname: '',
                  avatarSrc: 'https://i.pravatar.cc/40?img=1',
                },
              },
            }}
            tooltipText={task.soil_sampler}
            rounded="md"
            size="ssm"
            className="flex-shrink-0"
          />
        )}

        <div className="w-px h-4 bg-gray-300 mx-2"></div>

        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-basic-gray">
            edit_calendar
          </span>
          <span className="text-sm font-medium text-basic-black">
            {getStartDate(task)}
          </span>
        </div>

        <div className="w-px h-4 bg-gray-300 mx-2"></div>

        <div className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm text-basic-gray">
            schedule
          </span>
          <span className="text-sm font-medium text-basic-black">
            {getDueDate(task)}
          </span>
        </div>

        <div className="w-px h-4 bg-gray-300 mx-2"></div>

        <StatusIndicator
          status={getStatusForIndicator(task.status)}
          showText={false}
          showBackground={false}
          className="text-sm mt-1"
          iconClassName="text-md"
        />
      </div>
    </div>
  );
};

export const TaskPopup: React.FC<TaskPopupProps> = ({
  map,
  task,
  isVisible,
  onClose,
  onTaskClick,
}) => {
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = useRef<ReactDOM.Root | null>(null);

  useEffect(() => {
    if (!map || !task) return;

    if (isVisible) {
      const container = document.createElement('div');
      containerRef.current = container;

      const root = ReactDOM.createRoot(container);
      rootRef.current = root;

      root.render(<TaskPopupContent task={task} onClose={onClose} />);

      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: false,
        closeOnClick: false,
        className: 'task-popup',
        maxWidth: '320px',
      })
        .setLngLat([task.longitude, task.latitude])
        .setDOMContent(container)
        .addTo(map);

      popupRef.current = popup;

      popup.on('close', () => {
        onClose();
      });
    } else {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }

      if (rootRef.current) {
        rootRef.current.unmount();
        rootRef.current = null;
      }

      if (containerRef.current) {
        containerRef.current = null;
      }
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
      }
      if (rootRef.current) {
        rootRef.current.unmount();
      }
    };
  }, [map, task, isVisible, onClose]);

  useEffect(() => {
    if (rootRef.current && task) {
      rootRef.current.render(
        <TaskPopupContent task={task} onClose={onClose} />
      );
    }
  }, [task, onClose]);

  return null;
};
