'use client';
import { useApi } from './use-api';
import { TaskService } from '../services/tasks/task-service';
import {
  CreateTaskRequest,
  CreateTaskResponse,
  TaskFilters,
  TaskDetailsResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
  TaskType,
  TaskStatusCounts,
  PatchTaskRequest,
} from '../services/tasks/task-types';
import { useCallback } from 'react';

export function useTasks() {
  const { data, loading, error, execute, updateData } = useApi<{
    data: TaskType[];
    total: number;
  }>();

  const fetchTasks = useCallback(
    async (filters?: TaskFilters) => {
      const result = await execute(() => TaskService.getTasks(filters));
      return result;
    },
    [execute]
  );

  const deleteTaskOptimistic = useCallback(
    async (taskId: string) => {
      if (data) {
        const updatedData = {
          data: data.data.filter((task) => task.id !== taskId),
          total: Math.max(0, data.total - 1),
        };
        updateData(updatedData);
      }

      try {
        await TaskService.deleteTask(taskId);
      } catch (error) {
        await fetchTasks();
        throw error;
      }
    },
    [data, updateData, fetchTasks]
  );

  const patchTaskOptimistic = useCallback(
    async (taskId: string, patchData: PatchTaskRequest) => {
      if (data) {
        const updatedTasks = data.data.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              ...(patchData.status && { status: patchData.status }),
              ...(patchData.priority && { priority: patchData.priority }),
              // ...(patchData.complete_by && {
              //   complete_by: patchData.complete_by,
              // }),
            };
          }
          return task;
        });

        const updatedData = {
          data: updatedTasks,
          total: data.total,
        };
        updateData(updatedData);
      }

      try {
        await TaskService.patchTask(taskId, patchData);
      } catch (error) {
        await fetchTasks();
        throw error;
      }
    },
    [data, updateData, fetchTasks]
  );

  return {
    tasks: data?.data || [],
    total: data?.total || 0,
    loading,
    error,
    fetchTasks,
    deleteTaskOptimistic,
    patchTaskOptimistic,
  };
}

export function useCreateTask() {
  const {
    data: createdTask,
    loading,
    error,
    execute,
  } = useApi<CreateTaskResponse>();

  const createTask = useCallback(
    async (data: CreateTaskRequest) => {
      const result = await execute(() => TaskService.createTask(data));
      return result;
    },
    [execute]
  );

  return {
    createdTask: createdTask?.task,
    loading,
    error,
    createTask,
  };
}

export function useTaskDetails() {
  const {
    data: taskDetails,
    loading,
    error,
    execute,
  } = useApi<TaskDetailsResponse>();

  const getTaskDetails = useCallback(
    async (taskId: string) => {
      const result = await execute(() => TaskService.getTaskDetails(taskId));
      return result;
    },
    [execute]
  );

  const reset = useCallback(async () => {
    await execute(() =>
      Promise.resolve(null as unknown as TaskDetailsResponse)
    );
  }, [execute]);

  return {
    taskDetails,
    loading,
    error,
    getTaskDetails,
    reset,
  };
}

export function useUpdateTask() {
  const {
    data: updateResult,
    loading,
    error,
    execute,
  } = useApi<UpdateTaskResponse>();

  const updateTask = useCallback(
    async (taskId: string, data: UpdateTaskRequest) => {
      const result = await execute(() => TaskService.updateTask(taskId, data));
      return result;
    },
    [execute]
  );

  return {
    updateResult,
    loading,
    error,
    updateTask,
  };
}

export function useDeleteTask() {
  const {
    data: deleteResult,
    loading,
    error,
    execute,
  } = useApi<DeleteTaskResponse>();

  const deleteTask = useCallback(
    async (taskId: string) => {
      const result = await execute(() => TaskService.deleteTask(taskId));
      return result;
    },
    [execute]
  );

  return {
    deleteResult,
    loading,
    error,
    deleteTask,
  };
}

export function useTaskStatusCounts() {
  const { data, loading, error, execute } = useApi<TaskStatusCounts>();

  const fetchStatusCounts = useCallback(
    async (tenantId?: string) => {
      if (!data) {
        const result = await execute(() => TaskService.getTaskStatus());
        return result;
      }
      return data;
    },
    [execute, data]
  );

  return {
    statusCounts: data?.status_counts,
    loading,
    error,
    fetchStatusCounts,
  };
}

export function usePatchTask() {
  const {
    data: patchResult,
    loading,
    error,
    execute,
  } = useApi<UpdateTaskResponse>();

  const patchTask = useCallback(
    async (taskId: string, data: PatchTaskRequest) => {
      const result = await execute(() => TaskService.patchTask(taskId, data));
      return result;
    },
    [execute]
  );

  return {
    patchResult,
    loading,
    error,
    patchTask,
  };
}
