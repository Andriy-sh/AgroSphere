'use client';
import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (apiCall: () => Promise<T>) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await apiCall();
      setState({ data, loading: false, error: null });
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : 'An error occurred';

      setState((prev) => ({ ...prev, loading: false, error: errorMessage }));

      return null;
    }
  }, []);

  const updateData = useCallback((newData: T) => {
    setState((prev) => ({ ...prev, data: newData }));
  }, []);

  return { ...state, execute, updateData };
}
