'use client';
import { useState, useEffect } from 'react';
import {
  TaskService,
  TaskStatusCounts,
} from '../../services/tasks/task-service';

export function useTaskStatusCounts() {
  const [statusCounts, setStatusCounts] = useState<
    TaskStatusCounts['status_counts'] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatusCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await TaskService.getTaskStatus();
      setStatusCounts(data.status_counts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch status counts'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  return {
    statusCounts,
    loading,
    error,
    refetch: fetchStatusCounts,
  };
}
