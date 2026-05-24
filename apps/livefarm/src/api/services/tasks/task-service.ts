import { apiClient } from '../../client/axios-client';
import {
  CreateTaskRequest,
  CreateTaskResponse,
  TaskData,
  TaskFilters,
} from './task-types';

export class TaskService {
  private static readonly BASE_PATH = '/api/tasks';

  static async createTask(
    data: CreateTaskRequest,
    tenantId: string
  ): Promise<CreateTaskResponse> {
    const response = await apiClient.instance.post(
      `${this.BASE_PATH}/create`,
      data,
      {
        headers: {
          'X-Tenant': tenantId,
        },
      }
    );
    return response.data;
  }

  static async getTasks(
    filters?: TaskFilters,
    tenantId?: string
  ): Promise<{ data: TaskData[]; total: number }> {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['X-Tenant'] = tenantId;
    }

    const response = await apiClient.instance.get(this.BASE_PATH, {
      params: filters,
      headers,
    });

    const payload = response.data;

    if (payload && payload.results) {
      const data = payload.results.data || [];
      const total = payload.results.meta?.pagination?.total || 0;

      return {
        data: data as TaskData[],
        total,
      };
    }

    return {
      data: (payload?.data as TaskData[]) ?? [],
      total: (payload?.total as number) ?? 0,
    };
  }

  static async getTaskStatusCounts(tenantId?: string): Promise<{
    not_started: number;
    in_progress: number;
    rejected: number;
    collected: number;
    cancelled: number;
    lab: number;
    complete: number;
  }> {
    const headers: Record<string, string> = {};
    if (tenantId) {
      headers['X-Tenant'] = tenantId;
    }

    const response = await apiClient.instance.get(
      `${this.BASE_PATH}/per-status`,
      {
        headers,
      }
    );

    return response.data.status_counts;
  }
}
