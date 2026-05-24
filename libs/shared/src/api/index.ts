// Client
export { apiClient, ApiClient, eosdaApiClient } from './client/axios-client';
export { clearSessionCache } from './client/interceptors/auth-interceptor';
export type { ApiError } from './client/interceptors/error-interceptor';

// Hooks
export { useApi } from './hooks/use-api';
export {
  useTasks,
  useCreateTask,
  useTaskDetails,
  useUpdateTask,
  useDeleteTask,
  useTaskStatusCounts,
  usePatchTask,
} from './hooks/use-tasks';
export {
  useClients,
  useClientDetails,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from './hooks/use-clients';
export {
  useTeamUsersApi,
  useTeamInvitationsApi,
  useTeamInviteApi,
  useTeamUserActivationApi,
} from './hooks/use-teams';
export {
  useCreateEosdaField,
  useUpdateEosdaField,
  useCreateProductivityMap,
  useGetZoningMap,
  useCreateDownloadVisualTask,
  useGetDownloadVisualTaskStatus,
  useCreateSceneSearch,
  useGetSceneSearchResult,
  useCreatePKZoning,
  useGetPKZoningMap,
} from './hooks/eosda/useEosdaQueries';
export { useGetClients } from './hooks/clients/useClientsQueries';
export { useUsers } from './hooks/use-users';
export { useCreateOrganisation } from './hooks/use-organisation';
export {
  useCreateFarm,
  useFarms,
  useFarm,
  useUpdateFarm,
  useDeleteFarm,
} from './hooks/use-farms';
export {
  useCreateParcel,
  useParcel,
  useUpdateParcel,
  useDeleteParcel,
} from './hooks/use-parcels';
export { useCreateZone, useDeleteZone } from './hooks/use-zones';

export {
  ORGANISATION_KEYS,
  USER_KEYS,
  FARMS_KEYS,
  PARCELS_KEYS,
  ZONES_KEYS,
} from './query-constants/queryKeys';

// Services
export { TaskService } from './services/tasks/task-service';
export { ClientService } from './services/clients/client-service';
export { TenantService } from './services/tenant/tenant-service';
export { OrganisationService } from './services/organisation/organisation-service';
export { FarmsService } from './services/farms/farms-service';
export { ParcelsService } from './services/parcels/parcels-service';
export { ZonesService } from './services/zones/zones-service';

// Mocks
export { MOCK_USER_ROLES } from './mocks/mock-user-roles';
export { MOCK_TASKS, MOCK_CLIENTS, MOCK_TEAM_USERS, MOCK_FARMS, MOCK_PARCELS, MOCK_ZONES, ALL_MOCK_DATA } from './mocks/mock-data';

export {
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
} from './services/eosda/eosda.service';

// Services - Farms

// Types - Tasks
export type {
  CreateTaskRequest,
  CreateTaskResponse,
  TaskData,
  TaskFilters,
  FarmAssignment,
  PatchTaskRequest,
  TaskType,
  TaskDetailsResponse,
  UpdateTaskRequest,
  UpdateTaskResponse,
  DeleteTaskResponse,
  TaskStatusCounts,
} from './services/tasks/task-types';

// Types - Clients
export type {
  Client,
  ClientsResponse,
  ClientFilters,
  ClientMeta,
  ClientLinks,
  CreateClientRequest,
  CreateClientResponse,
  CreateClientError,
  ClientDetailsResponse,
} from './services/clients/client-types';

// Types - Teams
export type {
  TeamUser,
  TeamUsersResponse,
  TeamUsersFilters,
  TeamInvitation,
  TeamInvitationsResponse,
  TeamInvitationsFilters,
  TeamInvitationUser,
  TeamInvitationInvitedBy,
  TeamInvitationRole,
  TeamInviteUser,
  TeamInviteRequest,
  TeamInviteResponse,
  TeamInviteResult,
  TeamInviteError,
  UserActivationResponse,
  UserActivationError,
} from './services/teams/team-types';

// Types - EOSDA
export type {
  CreateFieldDto,
  UpdateFieldDto,
  CreateProductivityMapDto,
  ProductivityMapPendingResponse,
  ZoningMapResponse,
  DownloadVisualRequest,
  DownloadVisualParams,
  DownloadVisualGeometry,
  DownloadVisualTaskResponse,
  TaskStatusResponse,
  SceneSearchRequest,
  SceneSearchParams,
  SceneSearchPendingResponse,
  SceneSearchResultItem,
  SceneSearchResultResponse,
  CreatePKZoningRequest,
  CreatePKZoningResponse,
  PKZoningMapResponse,
} from './types/eosda.types';

// Types - Farms
export type {
  CreateFarmRequest,
  CreateFarmResponse,
  FarmData,
  GetFarmsResponse,
  GetFarmResponse,
  UpdateFarmRequest,
  UpdateFarmResponse,
} from './services/farms/farms-types';

// Types - Parcels
export type {
  CreateParcelRequest,
  CreateParcelResponse,
  GetParcelResponse,
  UpdateParcelRequest,
  UpdateParcelResponse,
  DeleteParcelResponse,
  ParcelData,
  Parcel,
  CreateParcelZone,
  SampleZone,
} from './services/parcels/parcels-types';

// Types - Zones
export type {
  CreateZoneRequest,
  CreateZoneResponse,
  DeleteZoneResponse,
  ZoneData,
} from './services/zones/zones-types';

// Types - Tenant
export type {
  SwitchTenantOptions,
  TenantServiceResult,
} from './services/tenant/tenant-types';

// Types - Organisation
export type {
  OrganisationType,
  FarmType,
  CreateOrganisationRequest,
  Organisation,
  CreateOrganisationResponse,
  CreateOrganisationError,
} from './services/organisation/organisation-types';

// Utils
export * from './utils/auth-utils';
