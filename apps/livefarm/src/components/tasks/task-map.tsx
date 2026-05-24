'use client';

import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import {
  Map,
  TasksLayer,
  FilterState,
  useTaskFilters,
  getStatusBackgroundColor,
  useMapPanelStore,
  useSidebarStore,
  TaskType,
  TaskDetails,
} from '@@agrosphere/shared';
import { useFiltersStore } from '@/stores/use-filters-store';
import { useMapStore } from '@/stores/use-map-store';

interface TaskMarker {
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

interface TaskMapProps {
  tasks: TaskType[];
  searchTerm?: string;
  activeFilters?: FilterState;
  selectedTaskId?: string;
  onTaskSelect?: (taskId: string) => void;
  onZoomToTaskRef?: React.MutableRefObject<((taskId: string) => void) | null>;
  onMapSizeChange?: (size: number) => void;
}

export const TaskMap = React.memo(
  ({
    tasks,
    searchTerm,
    activeFilters,
    selectedTaskId,
    onTaskSelect,
    onZoomToTaskRef,
    onMapSizeChange,
  }: TaskMapProps) => {
    const { showFilters } = useFiltersStore();
    const { setPanelWidth } = useMapPanelStore();
    const { mapState, setMapState } = useMapStore();
    const tasksRef = useRef<TaskType[]>(tasks);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    useEffect(() => {
      const currentTaskIds = tasksRef.current
        .map((t) => t.id)
        .sort()
        .join(',');
      const newTaskIds = tasks
        .map((t) => t.id)
        .sort()
        .join(',');

      if (currentTaskIds !== newTaskIds) {
        tasksRef.current = tasks;
      }

      const hasTaskChanges = tasks.some((task, index) => {
        const currentTask = tasksRef.current[index];
        return (
          !currentTask ||
          task.status !== currentTask.status ||
          task.task_type !== currentTask.task_type ||
          task.client?.name !== currentTask.client?.name ||
          task.complete_by !== currentTask.complete_by ||
          task.active_date !== currentTask.active_date ||
          task.assigned_to_organisation !== currentTask.assigned_to_organisation
        );
      });

      if (hasTaskChanges) {
        tasksRef.current = tasks;
      }
    }, [tasks]);

    const handleTaskClickRef = useRef((task: TaskMarker) => {
      const taskDetails = tasksRef.current.find((t) => t.id === task.id);
      if (taskDetails) {
        return {
          id: taskDetails.id,
          client: taskDetails.client?.name,
          taskType: taskDetails.task_type,
          status: taskDetails.status,
          taskNumber: taskDetails.task_number,
          dueDate: taskDetails.complete_by,
          advisor: taskDetails.advisor,
          soilSampler: undefined,
          assignedTo: undefined,
          assignedToOrg: taskDetails.assigned_to_organisation,
          coordinates: {
            latitude: taskDetails.latitude,
            longitude: taskDetails.longitude,
          },
        };
      }
      return undefined;
    });

    useEffect(() => {
      handleTaskClickRef.current = (task: TaskMarker) => {
        const taskDetails = tasksRef.current.find((t) => t.id === task.id);
        if (taskDetails) {
          return {
            id: taskDetails.id,
            client: taskDetails.client?.name,
            taskType: taskDetails.task_type,
            status: taskDetails.status,
            taskNumber: taskDetails.task_number,
            dueDate: taskDetails.complete_by,
            advisor: taskDetails.advisor,
            soilSampler: undefined,
            assignedTo: undefined,
            assignedToOrg: taskDetails.assigned_to_organisation,
            coordinates: {
              latitude: taskDetails.latitude,
              longitude: taskDetails.longitude,
            },
          };
        }
        return undefined;
      };
    }, [tasks]);

    const handleTaskClick = useCallback(
      (task: TaskMarker) => {
        handleTaskClickRef.current(task);
        if (onTaskSelect) {
          onTaskSelect(task.id);
        }
      },
      [onTaskSelect]
    );

    const filteredTasks = useTaskFilters(
      tasks,
      searchTerm || '',
      activeFilters || {
        period: [],
        status: [],
        taskType: [],
        clients: [],
        type: [],
      }
    );

    const taskMarkers = useMemo(() => {
      const newTaskMarkers = filteredTasks
        .filter(
          (task): task is TaskType & { latitude: number; longitude: number } =>
            task.latitude !== null &&
            task.latitude !== undefined &&
            task.longitude !== null &&
            task.longitude !== undefined
        )
        .map((task) => ({
          id: task.id,
          longitude: task.longitude,
          latitude: task.latitude,
          title: task.task_type || task.client?.name || 'Task',
          status: task.status,
          color: getStatusBackgroundColor(task.status),
          type: 'task' as const,
          farmer_name: task.client?.name,
          task_type: task.task_type || undefined,
          farmteam_task_number: task.task_number,
          complete_by: task.complete_by || undefined,
          no_of_samples: undefined,
          lab: undefined,
          advisor: task.advisor,
          priority: 'normal' as 'normal' | 'urgent' | 'none',

          avatarSrc: `https://i.pravatar.cc/40?img=${
            (parseInt(task.id) % 10) + 1
          }`,
          description:
            task.reporting ||
            `Collect ${task.task_type?.toLowerCase() || 'task'} samples...`,
          created_date: task.active_date || undefined,

          assigned_users: [
            {
              name: task.advisor || 'Advisor',
              surname: '',
              avatarSrc: `https://i.pravatar.cc/40?img=${
                (parseInt(task.id) % 10) + 5
              }`,
            },
          ],
        }));

      return newTaskMarkers;
    }, [filteredTasks]);

    const [screenWidth, setScreenWidth] = React.useState(
      typeof window !== 'undefined' ? window.innerWidth : 1920
    );

    React.useEffect(() => {
      const handleResize = () => {
        setScreenWidth(window.innerWidth);
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      if (showFilters && screenWidth <= 1940) {
        setPanelWidth(26);
      }
    }, [showFilters, setPanelWidth, screenWidth]);

    useEffect(() => {
      if (!mapRef.current) return;

      const handleMapMove = () => {
        if (mapRef.current) {
          const center = mapRef.current.getCenter();
          const zoom = mapRef.current.getZoom();
          const bearing = mapRef.current.getBearing();
          const pitch = mapRef.current.getPitch();

          setMapState({
            center: [center.lng, center.lat],
            zoom,
            bearing,
            pitch,
          });
        }
      };

      const map = mapRef.current;
      map.on('moveend', handleMapMove);
      map.on('zoomend', handleMapMove);

      return () => {
        map.off('moveend', handleMapMove);
        map.off('zoomend', handleMapMove);
      };
    }, [setMapState]);

    const { mapSize, setMapSize } = useMapStore();

    useEffect(() => {
      if (mapSize === 40 && showFilters) {
        setMapSize(30);
        onMapSizeChange?.(30);
      } else if (mapSize === 30 && !showFilters) {
        setMapSize(40);
        onMapSizeChange?.(40);
      }
    }, [showFilters, mapSize, setMapSize, onMapSizeChange]);

    const handleMapSizeChange = useCallback(
      (size: number) => {
        if (mapRef.current && mapState) {
          const currentCenter = mapRef.current.getCenter();
          const currentZoom = mapRef.current.getZoom();
          const currentBearing = mapRef.current.getBearing();
          const currentPitch = mapRef.current.getPitch();

          setMapState({
            center: [currentCenter.lng, currentCenter.lat],
            zoom: currentZoom,
            bearing: currentBearing,
            pitch: currentPitch,
          });
        }

        setMapSize(size);
        onMapSizeChange?.(size);
      },
      [setMapSize, onMapSizeChange, mapState, setMapState]
    );

    const mapComponent = useMemo(
      () => (
        <Map
          ref={mapRef}
          accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          showMapboxControls={false}
          showSearch={false}
          showSizeControls={true}
          panelSide="left"
          initialMapSize={mapSize}
          currentMapSize={mapSize}
          onMapSizeChange={handleMapSizeChange}
          isTasksPage={true}
          showFilters={showFilters}
        >
          <TasksLayer
            tasks={taskMarkers}
            onTaskClick={handleTaskClick}
            onZoomToTaskRef={onZoomToTaskRef}
            visible={true}
          />
        </Map>
      ),
      [
        taskMarkers,
        handleTaskClick,
        onZoomToTaskRef,
        handleMapSizeChange,
        mapSize,
        showFilters,
      ]
    );

    return (
      <div
        className={`flex flex-col bg-white rounded-xl shadow-sm overflow-hidden ${
          mapSize === 100 ? 'w-full h-full' : 'h-full'
        }`}
        style={{
          width:
            mapSize === 0
              ? '0%'
              : mapSize === 30
              ? '30%'
              : mapSize === 40
              ? '40%'
              : mapSize === 100
              ? '100%'
              : 'auto',
          minWidth:
            mapSize === 0
              ? '0px'
              : mapSize === 30
              ? '30vw'
              : mapSize === 40
              ? showFilters
                ? '20vw'
                : '40vw'
              : 'auto',
        }}
      >
        <div className="flex-1 min-h-0 relative">{mapComponent}</div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    const tasksChanged =
      prevProps.tasks.length !== nextProps.tasks.length ||
      prevProps.tasks.some((task, index) => {
        const nextTask = nextProps.tasks[index];
        return (
          !nextTask ||
          task.id !== nextTask.id ||
          task.status !== nextTask.status ||
          task.task_type !== nextTask.task_type ||
          task.client?.name !== nextTask.client?.name ||
          task.complete_by !== nextTask.complete_by ||
          task.active_date !== nextTask.active_date ||
          task.assigned_to_organisation !== nextTask.assigned_to_organisation
        );
      });

    const searchTermChanged = prevProps.searchTerm !== nextProps.searchTerm;

    const filtersChanged =
      prevProps.activeFilters?.period?.length !==
        nextProps.activeFilters?.period?.length ||
      prevProps.activeFilters?.status?.length !==
        nextProps.activeFilters?.status?.length ||
      prevProps.activeFilters?.taskType?.length !==
        nextProps.activeFilters?.taskType?.length ||
      JSON.stringify(prevProps.activeFilters) !==
        JSON.stringify(nextProps.activeFilters);

    const selectedTaskChanged =
      prevProps.selectedTaskId !== nextProps.selectedTaskId;

    return (
      !tasksChanged &&
      !searchTermChanged &&
      !filtersChanged &&
      !selectedTaskChanged
    );
  }
);

TaskMap.displayName = 'TaskMap';
