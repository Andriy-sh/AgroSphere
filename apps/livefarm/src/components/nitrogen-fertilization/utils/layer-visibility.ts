export type LayerVisibilityState = {
  farmLocations?: boolean;
  farmParcels?: boolean;
  farmZones?: boolean;
  showTasks?: boolean;
  showParcels?: boolean;
  parcelZoneMode?: 'parcels' | 'zones';
};

export const DEFAULT_LAYER_VISIBILITY: LayerVisibilityState = {
  farmLocations: true,
  farmParcels: false,
  farmZones: false,
  showTasks: false,
  showParcels: true,
};

export function updateLayerVisibility(
  prev: LayerVisibilityState,
  layer: string,
  visible: boolean
): LayerVisibilityState {
  return { ...prev, [layer]: visible };
}
