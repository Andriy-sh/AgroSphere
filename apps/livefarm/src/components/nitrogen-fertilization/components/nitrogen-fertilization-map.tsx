'use client';

import {
  FarmsLayer,
  Map,
  ParcelsLayer,
  VegetationLayer,
  zoomToParcelBbox,
} from '@@agrosphere/shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type mapboxgl from 'mapbox-gl';
import type { FarmData } from '../../nitrogen-fertilization/types/farm-data';
import type { MapParcel, MapZone } from '@@agrosphere/shared';
import {
  DEFAULT_LAYER_VISIBILITY,
  updateLayerVisibility,
  type LayerVisibilityState,
} from '../../nitrogen-fertilization/utils/layer-visibility';
import {
  buildFarmsFromFarmData,
  buildParcelsFromFarmData,
} from '../../nitrogen-fertilization/utils/map-data';

type NitrogenFertilizationMapProps = {
  farmData: FarmData;
  selectedParcelId?: string | null;
  onParcelSelect?: (parcel: MapParcel) => void;
  vegetationZones?: MapZone[] | null;
  showVegetationZones?: boolean;
  vegetationMapData?: { zones: Array<{ [key: string]: unknown }> } | null;
  onZoomToParcelRef?: React.MutableRefObject<((parcelId: string) => void) | null>;
};

export default function NitrogenFertilizationMap({
  farmData,
  selectedParcelId,
  onParcelSelect,
  vegetationZones,
  showVegetationZones = false,
  vegetationMapData,
  onZoomToParcelRef,
}: NitrogenFertilizationMapProps) {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [layerVisibility, setLayerVisibility] = useState<LayerVisibilityState>(
    DEFAULT_LAYER_VISIBILITY
  );

  const parcels = buildParcelsFromFarmData(farmData);
  const farms = buildFarmsFromFarmData(farmData);

  const filteredVegetationZones = useMemo(() => {
    if (!vegetationZones || !selectedParcelId) {
      return vegetationZones;
    }
    return vegetationZones.filter((zone) => zone.parcelId === selectedParcelId);
  }, [vegetationZones, selectedParcelId]);

  const visibleParcels = useMemo(() => {
    if (!showVegetationZones || !selectedParcelId) {
      return parcels;
    }
    return parcels.filter((parcel) => parcel.id !== selectedParcelId);
  }, [parcels, showVegetationZones, selectedParcelId]);

  const [vegetationParcelId, setVegetationParcelId] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (
      selectedParcelId !== vegetationParcelId &&
      vegetationParcelId !== null
    ) {
      setVegetationParcelId(null);
    }
  }, [selectedParcelId, vegetationParcelId]);

  useEffect(() => {
    if (
      vegetationMapData &&
      selectedParcelId &&
      vegetationMapData.zones.length > 0
    ) {
      setVegetationParcelId(selectedParcelId);
    } else if (!vegetationMapData) {
      setVegetationParcelId(null);
    }
  }, [vegetationMapData, selectedParcelId]);

  const selectedParcel = useMemo(() => {
    if (!selectedParcelId) return null;
    return parcels.find((p) => p.id === selectedParcelId) || null;
  }, [parcels, selectedParcelId]);

  const shouldShowVegetationLayer = useMemo(() => {
    return (
      showVegetationZones &&
      !!vegetationMapData &&
      !!vegetationMapData.zones &&
      vegetationMapData.zones.length > 0 &&
      selectedParcelId !== null &&
      vegetationParcelId === selectedParcelId
    );
  }, [
    showVegetationZones,
    vegetationMapData,
    selectedParcelId,
    vegetationParcelId,
  ]);


  const handleLayerVisibilityChange = useCallback(
    (layer: string, visible: boolean) => {
      setLayerVisibility((prev) => updateLayerVisibility(prev, layer, visible));
    },
    []
  );

  const initialCenter = useMemo((): [number, number] => {
    const parcelsForCenter =
      visibleParcels.length > 0 ? visibleParcels : parcels;
    const first = parcelsForCenter[0];
    const point = first?.coordinates?.[0]?.[0]?.[0];
    if (!point) return [-7.356955608582723, 53.494932676988725];
    return [point[0], point[1]];
  }, [visibleParcels, parcels]);

  const handleZoomToParcel = useCallback(
    (parcelId: string) => {
      if (!mapRef.current) {
        return;
      }

      const parcel = parcels.find((p) => p.id === parcelId);
      if (!parcel || !parcel.coordinates) {
        return;
      }

      const coordinates = parcel.coordinates[0]?.[0];
      if (!coordinates || coordinates.length === 0) {
        return;
      }

      const flatCoordinates: number[][] = coordinates.map((coord) => [
        coord[0],
        coord[1],
      ]);

      if (!mapRef.current.loaded()) {
        mapRef.current.once('load', () => {
          zoomToParcelBbox(mapRef, flatCoordinates, {
            padding: 50,
            duration: 1500,
          });
        });
      } else {
        zoomToParcelBbox(mapRef, flatCoordinates, {
          padding: 50,
          duration: 1500,
        });
      }
    },
    [parcels]
  );

  useEffect(() => {
    if (onZoomToParcelRef) {
      onZoomToParcelRef.current = handleZoomToParcel;
      return () => {
        if (onZoomToParcelRef) {
          onZoomToParcelRef.current = null;
        }
      };
    }
    return undefined;
  }, [handleZoomToParcel, onZoomToParcelRef]);

  return (
    <div className="rounded-md border border-basic-gray-light overflow-hidden h-[calc(100vh-1rem)] min-h-[calc(100vh-1rem)]">
      <Map
        ref={mapRef}
        accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        initialCenter={initialCenter}
        initialZoom={12}
        showMapboxControls={false}
        showLayerSelector={true}
        layerVisibility={layerVisibility}
        onLayerVisibilityChange={handleLayerVisibilityChange}
        showSearch={true}
        searchPlaceholder="Search..."
        showFullscreenButton={true}
        parcels={visibleParcels}
        onParcelClick={onParcelSelect}
        enableParcelSelection={true}
        selectedParcelId={selectedParcelId}
        className="w-full h-full"
      >
        <FarmsLayer farms={farms} visible={layerVisibility.farmLocations} />
        <ParcelsLayer
          parcels={visibleParcels}
          onParcelClick={onParcelSelect}
          selectable={true}
          selectedParcelId={selectedParcelId}
          visible={true}
          onlyBorder={false}
        />
        {vegetationMapData &&
        vegetationMapData.zones &&
        vegetationMapData.zones.length > 0 ? (
          <VegetationLayer
            key={`vegetation-${selectedParcelId}-${vegetationMapData.zones.length}`}
            zonesData={
              vegetationMapData.zones as Array<{
                [key: string]: {
                  zone_area: number;
                  zone_p: number;
                  fertilizer: number;
                  geometry: {
                    type: 'MultiPolygon';
                    coordinates: number[][][] | number[][][][];
                  };
                  kmean?: number[];
                };
              }>
            }
            visible={shouldShowVegetationLayer}
            parcelCoordinates={selectedParcel?.coordinates || null}
            onZoneClick={(zoneIndex, ndvi) => {
              console.log('Zone clicked:', { zoneIndex, ndvi });
            }}
          />
        ) : null}
      </Map>
    </div>
  );
}
