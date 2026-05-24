import { useMutation, useQuery } from '@tanstack/react-query';
import {
  CreateFieldDto,
  UpdateFieldDto,
  CreateProductivityMapDto,
  ProductivityMapPendingResponse,
  ZoningMapResponse,
  DownloadVisualRequest,
  DownloadVisualTaskResponse,
  TaskStatusResponse,
  SceneSearchRequest,
  SceneSearchPendingResponse,
  SceneSearchResultResponse,
  CreatePKZoningRequest,
  CreatePKZoningResponse,
  PKZoningMapResponse,
} from '../../types/eosda.types';
import {
  createFieldProxy,
  updateFieldProxy,
  createProductivityMapProxy,
  getZoningMapProxy,
  createDownloadVisualTaskProxy,
  getDownloadVisualTaskStatusProxy,
  createSceneSearchProxy,
  getSceneSearchResultProxy,
  createPKZoningProxy,
  getPKZoningMapProxy,
} from '../../services/eosda/eosda.service';

export const useCreateEosdaField = () => {
  return useMutation({
    mutationFn: (fieldData: CreateFieldDto) => createFieldProxy(fieldData),

    onSuccess: () => {
      console.log('Field created successfully through proxy!');
    },
    onError: (error) => {
      console.error('Error creating field:', error);
    },
  });
};

export const useUpdateEosdaField = () => {
  return useMutation({
    mutationFn: (variables: { fieldId: string; data: UpdateFieldDto }) =>
      updateFieldProxy(variables),

    onSuccess: () => {
      console.log('Field updated successfully through proxy!');
    },
    onError: (error) => {
      console.error('Error updating field:', error);
    },
  });
};

export const useCreateProductivityMap = () => {
  return useMutation({
    mutationFn: (data: CreateProductivityMapDto) =>
      createProductivityMapProxy(data),

    onSuccess: (response: ProductivityMapPendingResponse) => {
      console.log('Productivity map task created!');
      console.log('URL for status check:', response.request_url);

      // Extract zmap_id from request_url to use with useGetZoningMap
      // Example: const zmapIdMatch = response.request_url.match(/zoning\/maps\/\d+\/([^/?]+)/);
      // const zmapId = zmapIdMatch ? zmapIdMatch[1] : null;
      // Then use: useGetZoningMap(fieldId, zmapId)
    },

    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        errorObj.response?.data?.message ||
        'Error starting productivity map calculation';
      console.error('Error creating productivity map:', errorMessage);
    },
  });
};

export const useGetZoningMap = (
  fieldId: string | null,
  zmapId: string | null,
  enabled = true
) => {
  return useQuery<ZoningMapResponse>({
    queryKey: ['zoning-map', fieldId, zmapId],
    queryFn: () => {
      if (!fieldId || !zmapId) {
        throw new Error('fieldId and zmapId are required');
      }
      return getZoningMapProxy({
        fieldId,
        zmapId,
      });
    },
    enabled: enabled && !!fieldId && !!zmapId,
  });
};

export const useCreateDownloadVisualTask = () => {
  return useMutation({
    mutationFn: (data: DownloadVisualRequest) =>
      createDownloadVisualTaskProxy(data),

    onSuccess: (response: DownloadVisualTaskResponse) => {
      console.log('Download visual task created!');
      console.log('Task ID:', response.task_id);
    },

    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        errorObj.response?.data?.message ||
        'Error creating download visual task';
      console.error('Error creating download visual task:', errorMessage);
    },
  });
};

export const useGetDownloadVisualTaskStatus = (
  taskId: string | null,
  enabled = true,
  refetchInterval?: number
) => {
  return useQuery<TaskStatusResponse>({
    queryKey: ['download-visual-task-status', taskId],
    queryFn: () => {
      if (!taskId) {
        throw new Error('taskId is required');
      }
      return getDownloadVisualTaskStatusProxy(taskId);
    },
    enabled: enabled && !!taskId,
    refetchInterval: refetchInterval || false,
  });
};

export const useCreateSceneSearch = () => {
  return useMutation<
    SceneSearchPendingResponse | SceneSearchResultResponse,
    unknown,
    { fieldId: string; data: SceneSearchRequest }
  >({
    mutationFn: (variables) => createSceneSearchProxy(variables),

    onSuccess: (
      response: SceneSearchPendingResponse | SceneSearchResultResponse
    ) => {
      if ('request_id' in response) {
        console.log('Scene search task created!');
        console.log('Request ID:', response.request_id);
      } else {
        console.log('Scene search completed with status:', response.status);
      }
    },

    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        errorObj.response?.data?.message || 'Error creating scene search task';
      console.error('Error creating scene search:', errorMessage);
    },
  });
};

export const useGetSceneSearchResult = (
  fieldId: string | null,
  requestId: string | null,
  enabled = true,
  refetchInterval?: number
) => {
  return useQuery<SceneSearchResultResponse>({
    queryKey: ['scene-search-result', fieldId, requestId],
    queryFn: () => {
      if (!fieldId || !requestId) {
        throw new Error('fieldId and requestId are required');
      }
      return getSceneSearchResultProxy({ fieldId, requestId });
    },
    enabled: enabled && !!fieldId && !!requestId,
    refetchInterval: refetchInterval || false,
  });
};

// P&K Zoning hooks
export const useCreatePKZoning = () => {
  return useMutation({
    mutationFn: (variables: { fieldId: string; data: CreatePKZoningRequest }) =>
      createPKZoningProxy(variables),

    onSuccess: (response: CreatePKZoningResponse) => {
      console.log('P&K Zoning map task created!');
      console.log('Zmap ID:', response.zmap_id);
    },

    onError: (error: unknown) => {
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage =
        errorObj.response?.data?.message || 'Error creating P&K zoning map';
      console.error('Error creating P&K zoning map:', errorMessage);
    },
  });
};

export const useGetPKZoningMap = (
  fieldId: string | null,
  zmapId: string | null,
  enabled = true,
  refetchInterval?: number
) => {
  return useQuery<PKZoningMapResponse>({
    queryKey: ['pk-zoning-map', fieldId, zmapId],
    queryFn: () => {
      if (!fieldId || !zmapId) {
        throw new Error('fieldId and zmapId are required');
      }
      return getPKZoningMapProxy({ fieldId, zmapId });
    },
    enabled: enabled && !!fieldId && !!zmapId,
    refetchInterval: refetchInterval || false,
  });
};
