'use client';
import NitrogenFertilizationForm from './components/nitrogen-fertilization-form';
import NitrogenFertilizationMap from './components/nitrogen-fertilization-map';
import farmData from '../../data/json/farm-data.json';
import { useMemo, useRef, useState } from 'react';
import type { MapParcel, MapZone, SelectOption } from '@@agrosphere/shared';
import type { FarmDataItem } from './types/farm-data';
import type { NitrogenFertilizationParcelOption } from './types/form-types';
// Temporarily commented out - scene search request
// import { useNitrogenFertilizationSceneSearch } from './hooks/use-nitrogen-scene-search';

export default function NitrogenFertilization() {
  const [selectedParcel, setSelectedParcel] = useState<{
    id: string;
    name?: string;
  } | null>(null);
  const [vegetationZones, setVegetationZones] = useState<MapZone[] | null>(
    null
  );
  const [vegetationMapData, setVegetationMapData] = useState<{
    zones: Array<{ [key: string]: unknown }>;
  } | null>(null);
  const [showVegetationZones, setShowVegetationZones] = useState(false);
  const zoomToParcelRef = useRef<((parcelId: string) => void) | null>(null);

  const parcels = useMemo((): NitrogenFertilizationParcelOption[] => {
    return (farmData as FarmDataItem[]).flatMap((farm) =>
      (farm.children ?? []).map((p) => ({
        id: p.id,
        name: p.name,
      }))
    );
  }, []);

  const parcelItems = useMemo(() => {
    return (farmData as FarmDataItem[]).flatMap((farm) =>
      (farm.children ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        area: p.area,
        geometry: p.geometry,
      }))
    );
  }, []);

  const selectedParcelData = useMemo(() => {
    if (!selectedParcel) return null;
    for (const farm of farmData as FarmDataItem[]) {
      const parcel = farm.children?.find((p) => p.id === selectedParcel.id);
      if (parcel) {
        return {
          eosdaFieldId: parcel.eosdaFieldId || null,
          geometry: parcel.geometry,
          area: parcel.area,
          name: parcel.name,
        };
      }
    }
    return null;
  }, [selectedParcel]);

  // Temporarily commented out - scene search request
  // const { imageDateOptions, isLoading: imageDateLoading } =
  //   useNitrogenFertilizationSceneSearch({
  //     selectedParcelId: selectedParcel?.id ?? null,
  //     eosdaFieldId: selectedParcelData?.eosdaFieldId ?? null,
  //     parcelGeometry: selectedParcelData?.geometry,
  //     parcelName: selectedParcelData?.name,
  //   });
  // Mock data for image date options
  const imageDateOptions: SelectOption[] = [
    { value: '2025-12-19', label: '2025-12-19' },
    { value: '2025-12-12', label: '2025-12-12' },
    { value: '2025-12-05', label: '2025-12-05' },
    { value: '2025-11-28', label: '2025-11-28' },
    { value: '2025-11-21', label: '2025-11-21' },
  ];
  const imageDateLoading = false;

  return (
    <div className="flex flex-col md:flex-row gap-2">
      <div className="md:w-[500px] md:flex-shrink-0">
        <NitrogenFertilizationForm
          parcels={parcels}
          parcelItems={parcelItems}
          selectedParcel={
            selectedParcel
              ? {
                  id: selectedParcel.id,
                  name:
                    parcels.find((p) => p.id === selectedParcel.id)?.name ??
                    selectedParcel.name ??
                    selectedParcel.id,
                }
              : null
          }
          eosdaFieldId={selectedParcelData?.eosdaFieldId ?? null}
          parcelGeometry={selectedParcelData?.geometry}
          parcelArea={selectedParcelData?.area}
          imageDateOptions={imageDateOptions}
          imageDateLoading={imageDateLoading}
          zoomToParcelRef={zoomToParcelRef}
          onClearSelection={() => setSelectedParcel(null)}
          onSelectParcelId={(parcelId) => {
            const p = parcels.find((x) => x.id === parcelId);
            if (!p) return;
            setSelectedParcel((prev) =>
              prev?.id === p.id ? prev : { id: p.id, name: p.name }
            );
            setVegetationZones(null);
            setVegetationMapData(null);
            setShowVegetationZones(false);
          }}
          onVegetationZonesLoaded={(zones: MapZone[] | null) => {
            setVegetationZones(zones);
            const shouldShow = zones !== null && zones.length > 0;
            setShowVegetationZones(shouldShow);
          }}
          onVegetationMapDataLoaded={(data) => {
            setVegetationMapData(data);
            const shouldShow = data !== null && data.zones.length > 0;
            setShowVegetationZones(shouldShow);
          }}
          vegetationMapData={vegetationMapData}
        />
      </div>
      <div className="flex-1 min-w-0">
        <NitrogenFertilizationMap
          farmData={farmData}
          selectedParcelId={selectedParcel?.id ?? null}
          onParcelSelect={(parcel: MapParcel) =>
            setSelectedParcel((prev) =>
              prev?.id === parcel.id
                ? prev
                : { id: parcel.id, name: parcel.name ?? parcel.id }
            )
          }
          vegetationZones={vegetationZones}
          showVegetationZones={showVegetationZones}
          vegetationMapData={vegetationMapData}
          onZoomToParcelRef={zoomToParcelRef}
        />
      </div>
    </div>
  );
}
