import { localApiClient } from '../../client/axios-client';
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

export const createFieldProxy = async (fieldData: CreateFieldDto) => {
  const { data } = await localApiClient.instance.post(
    '/proxy/eosda/field-management',
    fieldData
  );
  return data;
};

export const updateFieldProxy = async ({
  fieldId,
  data,
}: {
  fieldId: string;
  data: UpdateFieldDto;
}) => {
  const { data: responseData } = await localApiClient.instance.patch(
    `/proxy/eosda/field-management/${fieldId}`,
    data
  );
  return responseData;
};

export const createProductivityMapProxy = async (
  data: CreateProductivityMapDto
): Promise<ProductivityMapPendingResponse> => {
  const { data: responseData } = await localApiClient.instance.post(
    '/proxy/eosda/zoning/productivity-map',
    data
  );
  return responseData;
};

export const getZoningMapProxy = async ({
  fieldId,
  zmapId,
}: {
  fieldId: string;
  zmapId: string;
}): Promise<ZoningMapResponse> => {
  const { data: responseData } = await localApiClient.instance.get(
    `/proxy/eosda/zoning/maps/${fieldId}/${zmapId}`
  );
  return responseData;
};

export const createDownloadVisualTaskProxy = async (
  data: DownloadVisualRequest
): Promise<DownloadVisualTaskResponse> => {
  const { data: responseData } = await localApiClient.instance.post(
    '/proxy/eosda/gdw/download-visual',
    data
  );
  return responseData;
};

export const getDownloadVisualTaskStatusProxy = async (
  taskId: string
): Promise<TaskStatusResponse> => {
  const { data: responseData } = await localApiClient.instance.get(
    `/proxy/eosda/gdw/task-status/${taskId}`
  );
  return responseData;
};

export const createSceneSearchProxy = async ({
  fieldId,
  data,
}: {
  fieldId: string;
  data: SceneSearchRequest;
}): Promise<SceneSearchPendingResponse | SceneSearchResultResponse> => {
  const { data: responseData } = await localApiClient.instance.post(
    `/proxy/eosda/scene-search/for-field/${fieldId}`,
    data
  );
  return responseData;
};

export const getSceneSearchResultProxy = async ({
  fieldId,
  requestId,
}: {
  fieldId: string;
  requestId: string;
}): Promise<SceneSearchResultResponse> => {
  const { data: responseData } = await localApiClient.instance.get(
    `/proxy/eosda/scene-search/for-field/${fieldId}/${requestId}`
  );
  return responseData;
};

export const createPKZoningProxy = async ({
  fieldId,
  data,
}: {
  fieldId: string;
  data: CreatePKZoningRequest;
}): Promise<CreatePKZoningResponse> => {
  const productivityMapData: CreateProductivityMapDto = {
    field_id: parseInt(fieldId, 10),
    vegetation_index: data.vegetation_index,
    zone_quantity: data.zones,
    need_answer: true,
  };

  const { data: responseData } = await localApiClient.instance.post(
    `/proxy/eosda/zoning/productivity-map`,
    productivityMapData
  );

  const requestUrl = (responseData as ProductivityMapPendingResponse)
    .request_url;
  const zmapIdMatch = requestUrl?.match(/zoning\/maps\/\d+\/(\d+)/);
  const zmapId = zmapIdMatch ? parseInt(zmapIdMatch[1], 10) : null;

  if (!zmapId) {
    throw new Error('Failed to extract zmap_id from response');
  }

  return {
    zmap_id: zmapId,
    status: 'pending',
    type_zmap: 2,
  };
};

export const getPKZoningMapProxy = async ({
  fieldId,
  zmapId,
}: {
  fieldId: string;
  zmapId: string;
}): Promise<PKZoningMapResponse> => {
  const { data: responseData } = await localApiClient.instance.get(
    `/proxy/eosda/zoning/maps/${fieldId}/${zmapId}`
  );
  return responseData;
};
