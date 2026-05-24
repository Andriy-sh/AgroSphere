'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useMapInstance, useMapLoaded, useMapStyleLoaded } from '../context/map-context';
import { Marker as TaskMarkerComponent } from '../markers/map-task-marker';
import { TaskPopup, TaskPopupData } from '../popups/task-popup';

export interface TaskMarker {
  id: string;
  longitude: number;
  latitude: number;
  title: string;
  status: string;
  color?: string;
  type?: 'task' | 'farm';
  farmer_name?: string;
  task_type?: string;
  farmteam_task_number?: string;
  complete_by?: string;
  no_of_samples?: number;
  lab?: string;
  advisor?: string;
  priority?: 'normal' | 'urgent' | 'none';
  avatarSrc?: string;
  description?: string;
  created_date?: string;
  assigned_users?: Array<{
    name: string;
    surname: string;
    avatarSrc?: string;
  }>;
  soil_sampler?: string | null;
  assigned_to?: number;
  assigned_to_organisation?: number | null;
  task_has_not_started_test?: boolean;
  task_has_unmatched_samples?: boolean;
  task_has_tests_without_lab_result?: boolean;
  reporting_status?: string | null;
  farms?: string;
  date?: string;
  start_at?: string;
}

interface TasksLayerProps {
  tasks?: TaskMarker[];
  onTaskClick?: (task: TaskMarker) => void;
  onZoomToTaskRef?: React.MutableRefObject<((taskId: string) => void) | null>;
  visible?: boolean;
}

export const TasksLayer: React.FC<TasksLayerProps> = ({
  tasks = [],
  onTaskClick,
  onZoomToTaskRef,
  visible = true,
}) => {
  const map = useMapInstance();
  const mapLoaded = useMapLoaded();
  const styleLoaded = useMapStyleLoaded();
  const [isTaskPopupVisible, setIsTaskPopupVisible] = useState(false);
  const [selectedTaskPopup, setSelectedTaskPopup] =
    useState<TaskPopupData | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskMarkerClick = useCallback(
    (task: TaskMarker) => {
      const taskPopupData: TaskPopupData = {
        id: task.id,
        title: task.title,
        status: task.status,
        color: task.color,
        farmer_name: task.farmer_name || '',
        task_type: task.task_type || null,
        farmteam_task_number: task.farmteam_task_number || '',
        complete_by: task.complete_by || null,
        no_of_samples: task.no_of_samples || 0,
        lab: task.lab || '',
        advisor: task.advisor || '',
        priority:
          task.priority === 'urgent'
            ? 'high'
            : (task.priority as 'normal' | 'high' | 'none') || 'normal',
        description: task.description,
        created_date: task.created_date,
        assigned_users: task.assigned_users,
        longitude: task.longitude,
        latitude: task.latitude,
        organisation_name: '',
        organisation_id: 0,
        assigned_to_organisation: task.assigned_to_organisation || null,
        assigned_to: task.assigned_to || 0,
        task_creator: 0,
        farmer_organisation_id: 0,
        farms: task.farms || '',
        farmer_address: '',
        soil_sampler: task.soil_sampler || null,
        id_number: 0,
        task_has_not_started_test: task.task_has_not_started_test || false,
        task_has_unmatched_samples: task.task_has_unmatched_samples || false,
        task_has_tests_without_lab_result:
          task.task_has_tests_without_lab_result || false,
        date: task.date || '',
        start_at: task.start_at || '',
        tests: [],
        created_by: 0,
        issues_approve_by: null,
        reporting_status: task.reporting_status || null,
        combine_task_report: 0,
        combine_soil_analysis_report: 0,
      };

      setSelectedTaskPopup(taskPopupData);
      setSelectedTaskId(task.id);
      setIsTaskPopupVisible(true);

      if (onTaskClick) {
        onTaskClick(task);
      }
    },
    [onTaskClick]
  );

  const handleTaskPopupClose = useCallback(() => {
    setIsTaskPopupVisible(false);
    setSelectedTaskPopup(null);
    setSelectedTaskId(null);
  }, []);

  const handleTaskPopupClick = useCallback(
    (task: TaskPopupData) => {
      if (onTaskClick) {
        const originalTask = tasks.find((t) => t.id === task.id);
        if (originalTask) {
          onTaskClick(originalTask);
        }
      }
    },
    [tasks, onTaskClick]
  );

  const handleZoomToTask = useCallback(
    (taskId: string) => {
      if (!map) return;

      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        map.flyTo({
          center: [task.longitude, task.latitude],
          zoom: 11.5,
          duration: 2000,
        });
      }
    },
    [map, tasks]
  );

  useEffect(() => {
    if (onZoomToTaskRef) {
      onZoomToTaskRef.current = handleZoomToTask;
    }
  }, [onZoomToTaskRef, handleZoomToTask]);

  useEffect(() => {
    if (isTaskPopupVisible && selectedTaskId) {
      const updatedTask = tasks.find((task) => task.id === selectedTaskId);
      if (updatedTask) {
        const hasChanged =
          !selectedTaskPopup ||
          selectedTaskPopup.title !== updatedTask.title ||
          selectedTaskPopup.status !== updatedTask.status ||
          selectedTaskPopup.farmer_name !== (updatedTask.farmer_name || '') ||
          selectedTaskPopup.description !== updatedTask.description ||
          selectedTaskPopup.assigned_users !== updatedTask.assigned_users;

        if (hasChanged) {
          const updatedTaskPopupData: TaskPopupData = {
            id: updatedTask.id,
            title: updatedTask.title,
            status: updatedTask.status,
            color: updatedTask.color,
            farmer_name: updatedTask.farmer_name || '',
            task_type: updatedTask.task_type || null,
            farmteam_task_number: updatedTask.farmteam_task_number || '',
            complete_by: updatedTask.complete_by || null,
            no_of_samples: updatedTask.no_of_samples || 0,
            lab: updatedTask.lab || '',
            advisor: updatedTask.advisor || '',
            priority:
              updatedTask.priority === 'urgent'
                ? 'high'
                : (updatedTask.priority as 'normal' | 'high' | 'none') ||
                  'normal',
            description: updatedTask.description,
            created_date: updatedTask.created_date,
            assigned_users: updatedTask.assigned_users,
            longitude: updatedTask.longitude,
            latitude: updatedTask.latitude,
            organisation_name: '',
            organisation_id: 0,
            assigned_to_organisation:
              updatedTask.assigned_to_organisation || null,
            assigned_to: updatedTask.assigned_to || 0,
            task_creator: 0,
            farmer_organisation_id: 0,
            farms: updatedTask.farms || '',
            farmer_address: '',
            soil_sampler: updatedTask.soil_sampler || null,
            id_number: 0,
            task_has_not_started_test:
              updatedTask.task_has_not_started_test || false,
            task_has_unmatched_samples:
              updatedTask.task_has_unmatched_samples || false,
            task_has_tests_without_lab_result:
              updatedTask.task_has_tests_without_lab_result || false,
            date: updatedTask.date || '',
            start_at: updatedTask.start_at || '',
            tests: [],
            created_by: 0,
            issues_approve_by: null,
            reporting_status: updatedTask.reporting_status || null,
            combine_task_report: 0,
            combine_soil_analysis_report: 0,
          };

          setSelectedTaskPopup(updatedTaskPopupData);
        }
      }
    }
  }, [tasks, isTaskPopupVisible, selectedTaskId, selectedTaskPopup]);

  if (!visible || !mapLoaded || !styleLoaded) {
    return null;
  }

  return (
    <>
      {tasks.map((task) => (
        <TaskMarkerComponent
          key={`${task.id}-${mapLoaded}-${styleLoaded}`}
          map={map}
          feature={task}
          onMarkerClick={handleTaskMarkerClick}
        />
      ))}

      <TaskPopup
        map={map}
        task={selectedTaskPopup}
        isVisible={isTaskPopupVisible}
        onClose={handleTaskPopupClose}
        onTaskClick={handleTaskPopupClick}
      />
    </>
  );
};

