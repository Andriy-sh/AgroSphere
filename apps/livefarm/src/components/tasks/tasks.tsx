'use client';

import React, {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from 'react';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
import {
  exportTaskTypesToCSV,
  showExportToast,
  showExportErrorToast,
  showDeleteSuccessToast,
  showDeleteErrorToast,
  calculateTaskCountsForTaskType,
  createTaskFilterSections,
  createTaskFilterSectionsFromApi,
  MapToggleButton,
  useTaskStatusCounts,
  useDeleteTask,
} from '@@agrosphere/shared';
import { useTasksState } from '@/hooks/tasks';
import { TableTab } from '@/components/tabs/table';
import { ListTab } from '@/components/tabs/list';
import { KanbanTab } from '@/components/tabs/kanban';
import { TimelineTab } from '@/components/tabs/timeline';
import { TaskFilters } from '@/components/tasks/task-filters';
import { TaskHeader } from '@/components/tasks/task-header';
import { TaskActions } from '@/components/tasks/task-actions';
import { useFiltersStore } from '@/stores/use-filters-store';
import { useMapStore } from '@/stores/use-map-store';
import { TaskMap } from './task-map';

export default function TaskList() {
  const router = useRouter();
  const zoomToTaskRef = useRef<((taskId: string) => void) | null>(null);
  const { showFilters } = useFiltersStore();
  const { mapSize, setMapSize, validateAndSetMapSize } = useMapStore();

  const {
    statusCounts,
    fetchStatusCounts,
    loading: statusLoading,
  } = useTaskStatusCounts();

  const { deleteTask } = useDeleteTask();
  const [deleteTaskOptimistic, setDeleteTaskOptimistic] = useState<
    ((taskId: string) => Promise<void>) | null
  >(null);

  const {
    filters,
    searchTerm,
    currentPage,
    activeTab,
    assignedToFilter,
    clientFilter,
    createdAtFilter,
    activeAfterFilter,
    dueFilter,
    statusFilter,
    taskTypeFilter,
    setAssignedToFilter,
    setClientFilter,
    setCreatedAtFilter,
    setActiveAfterFilter,
    setDueFilter,
    setStatusFilter,
    setTaskTypeFilter,
    setSearchTerm,
    setCurrentPage,
    setActiveTab,
    setFilters,
    handleResetFilters,
  } = useTasksState();

  useEffect(() => {
    validateAndSetMapSize(mapSize, true);
  }, [mapSize, validateAndSetMapSize]);

  useEffect(() => {
    if (showFilters && !statusLoading && !statusCounts) {
      fetchStatusCounts();
    }
  }, [showFilters, statusLoading, statusCounts, fetchStatusCounts]);

  const filterSections = useMemo(() => {
    if (statusCounts) {
      const currentFilters = {
        period: filters.period,
        status: filters.status,
        taskType: filters.taskType,
      };
      return createTaskFilterSectionsFromApi(statusCounts, currentFilters);
    }

    const taskCounts = calculateTaskCountsForTaskType([]);
    const currentFilters = {
      period: filters.period,
      status: filters.status,
      taskType: filters.taskType,
    };
    return createTaskFilterSections(taskCounts, currentFilters);
  }, [filters, statusCounts]);

  const handleViewOnMap = useCallback((taskId: string) => {
    if (zoomToTaskRef.current) {
      zoomToTaskRef.current(taskId);
    }
  }, []);

  const handleViewDetails = useCallback(
    (taskId: string) => {
      router.push(`/tasks/${taskId}`);
    },
    [router]
  );

  const handleDownload = useCallback(() => {
    try {
      const exportedCount = exportTaskTypesToCSV([], filters);
      const filterCount =
        filters.period.length + filters.status.length + filters.taskType.length;
      showExportToast(exportedCount, filterCount);
    } catch {
      showExportErrorToast();
    }
  }, [filters]);

  const handleAcceptTask = useCallback(() => {
    // TODO: Implement task acceptance
  }, []);

  const handleDeclineTask = useCallback(() => {
    // TODO: Implement task decline, if needed
  }, []);

  const handleUpdateStatus = useCallback(() => {
    // TODO: Implement status update
  }, []);

  const handleUpdatePriority = useCallback(() => {
    // TODO: Implement priority update
  }, []);

  const handleDeleteTask = useCallback(
    async (taskId: string) => {
      try {
        if (deleteTaskOptimistic) {
          await deleteTaskOptimistic(taskId);
          showDeleteSuccessToast('Task deleted successfully');
        } else {
          await deleteTask(taskId);
          showDeleteSuccessToast('Task deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        showDeleteErrorToast('Failed to delete task. Please try again.');
      }
    },
    [deleteTask, deleteTaskOptimistic]
  );

  const handleUpdateTask = useCallback(() => {
    // TODO: Implement task update
  }, []);

  const handleDuplicateTask = useCallback(() => {
    // TODO: Implement task duplication
  }, []);

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab as 'table' | 'list' | 'kanban' | 'timeline');
    },
    [setActiveTab]
  );

  const handleSearchChange = useCallback(
    (term: string) => {
      setSearchTerm(term);
    },
    [setSearchTerm]
  );

  const handleFiltersChange = useCallback(
    (newFilters: typeof filters) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const handleSelectTask = useCallback((taskId: string) => {
    // TODO: Implement task selection, if needed
  }, []);

  const handleSetDeleteOptimistic = useCallback(
    (deleteFn: ((taskId: string) => Promise<void>) | null) => {
      setDeleteTaskOptimistic(() => deleteFn);
    },
    []
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case 'table':
        return (
          <TableTab
            filters={filters}
            searchTerm={searchTerm}
            currentPage={currentPage}
            activeTab={activeTab}
            assignedToFilter={assignedToFilter}
            clientFilter={clientFilter}
            createdAtFilter={createdAtFilter}
            activeAfterFilter={activeAfterFilter}
            dueFilter={dueFilter}
            statusFilter={statusFilter}
            taskTypeFilter={taskTypeFilter}
            setAssignedToFilter={setAssignedToFilter}
            setClientFilter={setClientFilter}
            setCreatedAtFilter={setCreatedAtFilter}
            setActiveAfterFilter={setActiveAfterFilter}
            setDueFilter={setDueFilter}
            setStatusFilter={setStatusFilter}
            setTaskTypeFilter={setTaskTypeFilter}
            handlePageChange={setCurrentPage}
            handlePageReset={() => setCurrentPage(1)}
            handleAcceptTask={handleAcceptTask}
            handleDeclineTask={handleDeclineTask}
            handleUpdateStatus={handleUpdateStatus}
            handleUpdatePriority={handleUpdatePriority}
            handleDeleteTask={handleDeleteTask}
            handleUpdateTask={handleUpdateTask}
            handleDuplicateTask={handleDuplicateTask}
            showFilters={showFilters}
            onViewOnMap={handleViewOnMap}
            onViewDetails={handleViewDetails}
            onNavigateToTask={handleViewDetails}
            onSetDeleteOptimistic={handleSetDeleteOptimistic}
          />
        );
      case 'list':
        return (
          <ListTab
            tasks={[]}
            searchTerm={searchTerm}
            activeFilters={filters}
            assignedToFilter={assignedToFilter}
            clientFilter={clientFilter}
            dueFilter={dueFilter}
            statusFilter={statusFilter}
            taskTypeFilter={taskTypeFilter}
            handleAcceptTask={handleAcceptTask}
            handleDeclineTask={handleDeclineTask}
            handleUpdateStatus={handleUpdateStatus}
            handleUpdatePriority={handleUpdatePriority}
            handleDeleteTask={handleDeleteTask}
            handleUpdateTask={handleUpdateTask}
            handleDuplicateTask={handleDuplicateTask}
            handleViewOnMap={handleViewOnMap}
            handleViewDetails={handleViewDetails}
            showFilters={showFilters}
          />
        );
      case 'kanban':
        return (
          <KanbanTab
            tasks={[]}
            searchTerm={searchTerm}
            activeFilters={filters}
            assignedToFilter={assignedToFilter}
            clientFilter={clientFilter}
            dueFilter={dueFilter}
            statusFilter={statusFilter}
            taskTypeFilter={taskTypeFilter}
            handleAcceptTask={handleAcceptTask}
            handleDeclineTask={handleDeclineTask}
            handleUpdateStatus={handleUpdateStatus}
            handleUpdatePriority={handleUpdatePriority}
            handleDeleteTask={handleDeleteTask}
          />
        );
      case 'timeline':
        return <TimelineTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-row w-full h-full max-h-full gap-2">
      {mapSize < 100 && (
        <div className="flex flex-col flex-1 min-h-0 max-h-full ">
          <div className="flex flex-row flex-1 min-h-0 max-h-full gap-2 ">
            {showFilters && (
              <TaskFilters
                sections={filterSections}
                activeFilters={filters}
                onReset={handleResetFilters}
                onFiltersChange={handleFiltersChange}
                loading={statusLoading}
              />
            )}

            <div className="flex flex-col flex-1 min-h-0 max-h-full border border-basic-gray-light rounded-xl bg-white gap-6 p-5">
              <div className="flex-shrink-0 max-h-full flex flex-col gap-3">
                <TaskHeader
                  onAddTask={() => router.push('/tasks/create-task')}
                />

                <TaskActions
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                  searchTerm={searchTerm}
                  onSearchChange={handleSearchChange}
                  onDownload={handleDownload}
                />
              </div>

              <div
                className={`flex-1 min-h-0 max-h-full bg-white rounded-xl overflow-hidden`}
              >
                {renderMainContent()}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== 'kanban' && activeTab !== 'timeline' && (
        <>
          {mapSize > 0 && (
            <div
              className={`${
                mapSize === 100 ? 'w-full h-full' : 'flex-shrink-0'
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
              <TaskMap
                tasks={[]}
                searchTerm={searchTerm}
                activeFilters={filters}
                selectedTaskId={undefined}
                onZoomToTaskRef={zoomToTaskRef}
                onTaskSelect={handleSelectTask}
                onMapSizeChange={setMapSize}
              />
            </div>
          )}
          <MapToggleButton
            mapSize={mapSize}
            showFilters={showFilters}
            onMapSizeChange={setMapSize}
          />
        </>
      )}
      <ToastContainer
        limit={3}
        position="top-center"
        className="custom-toast-center max-h-full"
      />
    </div>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}
