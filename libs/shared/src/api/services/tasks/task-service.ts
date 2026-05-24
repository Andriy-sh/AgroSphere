import { apiClient } from '../../client/axios-client';
import {
  CreateTaskRequest,
  CreateTaskResponse,
  TaskFilters,
  TaskDetailsResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
  TaskType,
  TasksListResponse,
  TaskStatusCounts,
  PatchTaskRequest,
} from './task-types';
import { MOCK_TASKS } from '../../mocks/mock-data';

export type { TaskStatusCounts };

export class TaskService {
  private static readonly BASE_PATH = '/tasks';
  private static readonly USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  static async createTask(
    data: CreateTaskRequest
  ): Promise<CreateTaskResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: 'new-task-' + Date.now(), ...data } as any };
    }
    const response = await apiClient.instance.post(
      `${this.BASE_PATH}/create`,
      data
    );
    return response.data;
  }

  static async getTasks(
    filters?: TaskFilters
  ): Promise<{ data: TaskType[]; total: number }> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        data: MOCK_TASKS.data as TaskType[],
        total: MOCK_TASKS.data.length,
      };
    }
    const response = await apiClient.instance.get<TasksListResponse>(
      this.BASE_PATH,
      {
        params: filters
      }
    );

    const payload = response.data;

    return {
      data: payload.data as TaskType[],
      total: payload.meta.total,
    };
  }

  static async getTaskDetails(taskId: string): Promise<TaskDetailsResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const task = MOCK_TASKS.data.find(t => t.id === taskId);
      return { data: task as any };
    }
    const response = await apiClient.instance.get(
      `${this.BASE_PATH}/${taskId}`
    );
    return response.data;
  }

  static async updateTask(
    taskId: string,
    data: UpdateTaskRequest
  ): Promise<UpdateTaskResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: taskId, ...data } as any };
    }
    const response = await apiClient.instance.put(
      `${this.BASE_PATH}/${taskId}`,
      data
    );
    return response.data;
  }

  static async deleteTask(taskId: string): Promise<DeleteTaskResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: taskId, deleted: true } as any };
    }
    const response = await apiClient.instance.delete(
      `${this.BASE_PATH}/${taskId}`
    );
    return response.data;
  }

  static async getTaskStatus(): Promise<TaskStatusCounts> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return {
        completed: 2,
        in_progress: 1,
        pending: 1
      } as any;
    }
    const response = await apiClient.instance.get<TaskStatusCounts>(
      '/tasks/per-status'
    );
    return response.data;
  }

  static async patchTask(
    taskId: string,
    data: PatchTaskRequest
  ): Promise<UpdateTaskResponse> {
    if (this.USE_MOCK_DATA) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { data: { id: taskId, ...data } as any };
    }
    const response = await apiClient.instance.patch(
      `${this.BASE_PATH}/${taskId}`,
      data
    );
    return response.data;
  }
}
