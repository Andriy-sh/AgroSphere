// Use this file to export React client components (e.g. those with 'use client' directive) or other non-server utilities

export * from './styles/fonts';

export * from './components/assign-assignee/assign-assignee';
export * from './components/tag-item/tag-item';
export * from './components/input/input';
export * from './components/label/label';
export * from './components/form-field/form-field';
export * from './components/badge/badge';
export * from './components/button/button';
export * from './components/icon/icon';
export * from './components/add-button/add-button';
export * from './components/accordion/accordion';
export * from './utils/cn';
export * from './components/checkbox/checkbox';
export * from './components/collapsible/collapsible';
export * from './components/filters/filters';
export * from './components/themeswitcher/themeswitcher';
export * from './components/sign-out/sign-out';
export * from './components/table/table';
export * from './components/data-table/data-table';
export * from './helpers/serialize-helpers';
export * from './components/avatar/avatar';
export * from './components/flag/flag';
export * from './components/status-indicator/status-indicator';
export * from './components/dropdownitems/dropdownitems';
export * from './components/tabs-item/tabs-item';
export * from './components/header/header';
export * from './components/search-input/search-input';
export * from './components/pagination/pagination';
export * from './components/task-comments/task-comments';
export * from './components/task-detail/task-detail';
export * from './components/task-detail/send-to-lab-dropdown';
export * from './components/task-list/task-list';
export * from './components/tasks/task-dropdown-actions';
export * from './components/status-dropdown/status-dropdown';
export * from './components/activity-log/activity-log';
export * from './components/activity-log/activity-comment';
export * from './components/breadcrumbs/breadcrumbs';
export * from './components/dialog/dialog';
export * from './components/comment-form/comment-form';
export * from './components/task-kanban/task-kanban';
export * from './utils/date-utils';
export * from './components/create-task-form/create-task-form';
export * from './components/satellite-p&k-form';
export * from './components/user-select/user-select';
export * from './components/task-info/task-info';
export * from './components/subscription-card/subscription-card';
export * from './components/task-detail-tabs/task-detail-tabs';
export * from './components/multi-select/multi-select';
export * from './components/createble-multi-select/createble-multi-select';
export * from './components/timeline/timeline';
export * from './components/color-example/color-example';
export * from './components/emoji-picker/emoji-picker';
export * from './types/colors';
export * from './types/types';
export * from './types/task';
export type {
  Client as MockClient,
  Zone,
  Field,
  Farm,
} from './mock/mock-clients';
export { mockClients } from './mock/mock-clients';
export * from './types/tenant';
export * from './mock/mock-clients';
export * from './mock/mock-tasks-details';
export * from './mock/mocked-tasks';
export * from './mock/mock-lab-items';
export type { TeamUser as MockTeamUser } from './mock/mock-team-users';
export {
  mockTeamUsers,
  getUsersByRole,
  getUsersByStatus,
} from './mock/mock-team-users';
export * from './mock/mock-connections';
export * from './mock/mock-roles';
export * from './mock/mock-available-users';
export * from './mock/mock-notifications';
export * from './mock/mock-create-task';
export * from './mock/mock-payment-history';
export * from './components/current-subscription-card/current-subscription-card';
export * from './components/payment-history/payment-history';
// Map component is deprecated, use Map instead
// export { Map } from './components/map/map';
export { Map } from './components/map/map';
export type { MapProps } from './components/map/map';
export {
  MapProvider,
  useMapInstance,
  useMapLoaded,
  useMapStyleLoaded,
  useMapContext,
} from './components/map/context/map-context';
export { ParcelZoneSelector } from './components/map/components/parcel-zone-selector';
export type { ParcelZoneMode } from './components/map/components/parcel-zone-selector';
export { TasksLayer } from './components/map/layers/tasks-layer';
export type { TaskMarker as TasksLayerTaskMarker } from './components/map/layers/tasks-layer';
export { FarmsLayer } from './components/map/layers/farms-layer';
export { ParcelsLayer } from './components/map/layers/parcels-layer';
export { ZonesLayer } from './components/map/layers/zones-layer';
export { VegetationLayer } from './components/map/layers/vegetation-layer';
export { SamplePathsLayer } from './components/map/layers/sample-paths-layer';
export { DrawingLayer } from './components/map/layers/drawing-layer';
export type { DrawingFeature } from './components/map/layers/drawing-layer';
export { PolygonSplittingLayer } from './components/map/layers/polygon-splitting-layer';
export { DrawingManagementLayer } from './components/map/layers/drawing-management-layer';
export { ImageOverlayLayer } from './components/map/layers/image-overlay-layer';
export { SceneTimelineLayer } from './components/map/layers/scene-timeline-layer';
export { ParcelEditLayer } from './components/map/layers/parcel-edit-layer';
export { ParcelLabelLayer } from './components/map/layers/parcel-label-layer';
export * from './components/map/map-scene-timeline';
export { MapPicker } from './components/map-picker/map-picker';
export * from './components/tag-item/tag-item';
export * from './utils/task-filters-utils';
export * from './utils/create-task-filter-sections';
export * from './utils/create-task-filter-sections-from-api';
export * from './utils/csv-export';
// Radix Select components - export specific components to avoid conflicts
export {
  Select as RadixSelect,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/radix-select/redix-select';
export * from './utils/validation-schemas';
export * from './components/adaptive-tags/adaptive-tags';
export * from './components/lab-data-row/lab-data-row';
export * from './components/skeletons';
export * from './components/parcel-preview/parcel-preview';
export * from './components/parcel-form/parcel-form';
export * from './components/image-preview/image-preview';
export type { ParcelWithZones } from './components/map/hooks/use-map-polygon-splitting';
export * from './components/select/select';
export * from './components/select-all-checkbox/select-all-checkbox';
export * from './components/toggle/toggle';
export * from './components/create-task-form/components';
export * from './components/confirmation-dialog/confirmation-dialog';
export * from './components/confirmation-dialog/delete-account-dialog';
export * from './components/invite-dialog/invite-dialog';
export * from './components/role-card/role-card';
export * from './components/role-dialog/role-dialog';
export * from './components/assign-users-dialog/assign-users-dialog';
export * from './components/radio/radio';
export * from './data/subscription-plans';
export * from './data/client-options';
export * from './data/soildashboard-variations';
export * from './data/team-roles';
export * from './components/notifications/notifications';
export * from './components/notifications/notifications-dialog';
export * from './components/notifications/notification-list';
export * from './components/sidebar/sidebar';
export type { SidebarProps } from './components/sidebar/sidebar';
export * from './components/sidebar/SidebarHydrationController';
export * from './hooks/use-sidebar';
export * from './hooks/use-sidebar-hydration';
export * from './stores/useSidebarStore';
export * from './components/custom-scrollbar/custom-scrollbar';
export * from './types/priority';
export * from './components/no-results-found/no-results-found';
export * from './components/company-selector/company-selector';
export * from './components/phone-input/phone-input';
export * from './components/country-select/country-select';
export * from './components/region-select/region-select';
export * from './utils/postal-code-utils';
export * from './utils/region-utils';

export { DetailCard } from './components/detail-card/detail-card';
export * from './components/detail-row/detail-row';
export * from './mock/mock-comments';
export * from './utils/page-size-calculator';
export {
  useDynamicPageSize,
  useTablePageSize,
} from './utils/page-size-calculator';

export { LabStatus, DEFAULT_LAB_STATUS_CONFIGS } from './types/lab';
export type { LabStatusConfig, LabItem } from './types/lab';
export type { Farm as FarmMock } from './mock/mock-farms';
export * from './mock/mock-tasks-with-coordinates';
export * from './components/settings/tabs';
export * from './components/settings';
export * from './components/map/markers/map-task-marker';
export * from './utils/bbox-utils';
export type {
  CreateTaskFarm as CreateTaskFarmData,
  CreateTaskClient,
} from './mock/mock-create-task-data';
export * from './components/map/markers/map-farm-marker';
export * from './utils/status-utils';
export * from './hooks/use-task-filters';
export * from './hooks/use-url-params';
export * from './hooks/tasks/use-tasks-url-sync';
export * from './hooks/tasks/use-tasks-with-url';
export * from './hooks/lab';
export * from './hooks/lab/use-lab-with-url';
export * from './hooks/use-task-actions';
export * from './hooks/use-task-page-size';
export * from './utils/debounce';
export * from './hooks/use-debounce';
export * from './utils/toast-utils';
export * from './utils';
export * from './components/assign-user/assign-user';
export * from './components/map/task-map-popup';
export { FarmMap } from './components/farm-map/farm-map';
export { TaskCommentsWrapper } from './components/task-comments-wrapper/task-comments-wrapper';
export { useFarmMapData } from './hooks/use-farm-map-data';
export { useFarmZoom } from './hooks/use-farm-zoom';
export * from './hooks/team';
export * from './hooks/team/use-team-navigation-with-url';
export * from './hooks/team/use-team-users-with-url';
export * from './hooks/team/use-team-connections-with-url';
export * from './hooks/team/use-team-connection-sorting';
export * from './hooks/team/use-team-roles-with-url';
export type {
  FarmMarker,
  MapZone,
  MapParcel,
  ParcelSplitLine,
  MapCoordinate,
  MapPolygon,
  MapMultiPolygon,
} from './types/map';
export { buildParcelsFromZones } from './utils/map-parcel-helpers';

export type { TaskMarker } from './components/map/layers/tasks-layer';
export type { ProgressStep } from './components/map/map-progress-bar';
export { FarmPopup } from './components/map/popups/farm-popup';
export type { FarmPopupData } from './components/map/popups/farm-popup';
export { TaskPopup } from './components/map/popups/task-popup';
export type { TaskPopupData } from './components/map/popups/task-popup';

export {
  TaskTypeDropdown,
  Select,
  ExampleSelect,
  OrganizationSelect,
} from './components/select/select';
export * from './mock/mock-samples';
export * from './mock/mock-activity-log';
export * from './components/timezone-select/timezone-select';
export * from './components/page-container/page-container';
export type { FormFarm } from './mock/mock-create-task-data';

// API exports
export * from './api';

export {
  mockLabSections,
  type LabSection,
  type LabTest,
} from './mock/mock-lab-data';
export type {
  CreateTaskRequest,
  CreateTaskResponse,
  TaskData,
  TaskFilters,
  FarmAssignment,
  PatchTaskRequest,
} from './api/services/tasks/task-types';

export type {
  Client,
  ClientsResponse,
  ClientFilters,
  ClientMeta,
  ClientLinks,
  CreateClientRequest,
  CreateClientResponse,
  CreateClientError,
} from './api/services/clients/client-types';

export { useApi } from './api/hooks/use-api';
export {
  useTasks,
  useCreateTask,
  useTaskDetails,
  useUpdateTask,
  useDeleteTask,
  useTaskStatusCounts,
  usePatchTask,
} from './api/hooks/use-tasks';

export {
  useTeamUsersApi,
  useTeamInvitationsApi,
  useTeamInviteApi,
  useTeamUserActivationApi,
} from './api/hooks/use-teams';
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
} from './api/services/teams/team-types';
export {
  useClients,
  useClientDetails,
  useCreateClient,
  useUpdateClient,
  useDeleteClient,
} from './api/hooks/use-clients';

export { useUsers } from './api/hooks/use-users';
export * from './api/utils/auth-utils';

export * from './components/time-input';
export * from './components/icons';
export * from './components/page-header/page-header';
export * from './stores/useMapPanelStore';
export * from './stores/useSidebarStore';
export * from './stores/use-notification-store';
export * from './stores/useOrganisationsStore';
export { AddButton } from './components/add-button/add-button';
export type { AddButtonProps } from './components/add-button/add-button';
export * from './components/csv-import';
export * from './components/sample-data-upload/sample-data-upload';
export * from './components/split-card/split-card';
export * from './components/date-time-picker/date-time-picker';
export * from './components/map/map-toggle-button';
export * from './components/segmented-gauge/segmented-gauge';
export * from './components/bullet-chart/bullet-chart';
export * from './components/gauge-chart/gauge-chart';
export * from './components/metric-category-select/metric-category-select';
export * from './data/soildashboard-variations';
export * from './components/separator/separator';
export * from './components/farm-row/farm-row';
export * from './components/zone-row/zone-row';
export * from './components/group-row/group-row';
export * from './components/selection-bar/selection-bar';
export * from './components/parcel-row/parcel-row';
export * from './components/icon/icon';
export * from './components/showcase';
export * from './components/loading-skeleton/loading-skeleton';
export * from './components/error-state/error-state';
export * from './components/signin/signin-button';
export * from './providers/auth';
export * from './utils/tree';
export {
  signIn as signInAction,
  signOut as signOutAction,
} from './actions/auth';
export * as userServices from './api/services/users/user-service';
export * as userTypes from './api/services/users/user-types';
export * from './components/pie-chart/pie-chart';
export * from './components/bar-chart/bar-chart';
export * from './components/area-chart/area-chart';
export * from './components/line-chart/line-chart';
