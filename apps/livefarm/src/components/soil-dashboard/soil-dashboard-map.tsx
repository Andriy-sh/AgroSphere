'use client';

import { useMemo, useEffect } from 'react';
import {
  Map,
  type MapParcel,
  getGaugeConfig,
  useMapContext,
  useMapLoaded,
  zoomToItems,
} from '@@agrosphere/shared';
import {
  type SelectedEntity,
  getMapParcelsForSelectedEntity,
  getInitialMapCenter,
} from '../../data/soildashboard-data';
import {
  getPhColor,
  getMetricColor,
  getVariantFromMetricId,
} from './soil-dashboard-map-utils';

interface SoilDashboardMapProps {
  selectedEntity: SelectedEntity | null;
  selectedMetricId?: string | null;
  onParcelClick?: (parcel: MapParcel) => void;
}

// Component that handles zoom logic - must be a child of Map to access context
function ZoomToSelectedEntity({
  selectedEntity,
  parcels,
}: {
  selectedEntity: SelectedEntity | null;
  parcels: MapParcel[];
}) {
  const { fitBounds } = useMapContext();
  const mapLoaded = useMapLoaded();

  // Zoom to selected entity when it changes
  useEffect(() => {
    // Zoom when map is loaded and there are parcels to show
    if (!mapLoaded || parcels.length === 0) return;

    // Zoom to all parcels when "All farms" is selected (selectedEntity === null)
    // or zoom to selected entity parcels when something specific is selected
    zoomToItems(parcels, fitBounds, {
      padding: 60,
      duration: 1500,
      essential: true,
    });
  }, [selectedEntity, parcels, mapLoaded, fitBounds]);

  return null;
}

export default function SoilDashboardMap({
  selectedEntity,
  selectedMetricId,
  onParcelClick,
}: SoilDashboardMapProps) {
  const metricConfig = useMemo(() => {
    if (!selectedMetricId) return null;
    const variant = getVariantFromMetricId(selectedMetricId);
    return getGaugeConfig(variant);
  }, [selectedMetricId]);

  const parcels: MapParcel[] = useMemo(() => {
    const parcelsData = getMapParcelsForSelectedEntity(
      selectedEntity,
      selectedMetricId
    ) as MapParcel[];

    if (selectedMetricId) {
      return parcelsData.map((parcel) => {
        let fillColor: string | undefined;
        let borderColor: string | undefined;

        if (parcel.pH !== undefined) {
          if (metricConfig) {
            fillColor = getMetricColor(parcel.pH, metricConfig);
            borderColor = getMetricColor(parcel.pH, metricConfig);
          } else {
            fillColor = getPhColor(parcel.pH);
            borderColor = getPhColor(parcel.pH);
          }
        }

        return {
          ...parcel,
          visible: true, // Ensure visibility is always true
          fillColor,
          borderColor,
          fillOpacity: 0.5,
        };
      });
    }

    // Ensure all parcels are visible when no metric is selected
    return parcelsData.map((parcel) => ({
      ...parcel,
      visible: true, // Ensure visibility is always true
    }));
  }, [selectedEntity, selectedMetricId, metricConfig]);

  const initialCenter = useMemo(() => getInitialMapCenter(), []);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden">
      <Map
        initialCenter={initialCenter}
        showMapboxControls={false}
        showLayerSelector={true}
        showSearch={true}
        searchPlaceholder="Find address or places..."
        showFullscreenButton={true}
        parcels={parcels}
        parcelZoneMode="parcels"
        showLegend={true}
        legendPosition="left"
        layerVisibility={{
          farmLocations: false,
          farmParcels: false,
          farmZones: false,
          showTasks: false,
          showParcels: true,
        }}
        showPhColors={false}
        selectedMetricId={selectedMetricId || undefined}
        onParcelClick={onParcelClick}
      >
        <ZoomToSelectedEntity
          selectedEntity={selectedEntity}
          parcels={parcels}
        />
      </Map>
    </div>
  );
}
