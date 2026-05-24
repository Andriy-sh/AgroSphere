import { useState, useEffect } from 'react';
import {
  loadVegetationMapByFieldId,
  convertVegetationMapToMapZones,
} from '../utils/load-vegetation-map';
import type { MapZone } from '@@agrosphere/shared';
import type { ZonePrescription, NitrogenFertilizationParcelOption } from '../types/form-types';
import { m2ToHa } from '../utils/zone-calculations';

type VegetationMapData = {
  zones: Array<{ [key: string]: unknown }>;
};

export function useVegetationMap(
  eosdaFieldId: string | null | undefined,
  selectedParcel: NitrogenFertilizationParcelOption | null | undefined,
  zonesCount: string,
  onVegetationZonesLoaded?: (zones: MapZone[] | null) => void,
  onVegetationMapDataLoaded?: (data: VegetationMapData | null) => void
) {
  const [isLoadingVegetationMap, setIsLoadingVegetationMap] = useState(false);
  const [vegetationMapData, setVegetationMapData] = useState<VegetationMapData | null>(null);

    useEffect(() => {
    setIsLoadingVegetationMap(false);
    setVegetationMapData(null);
    onVegetationMapDataLoaded?.(null);
    onVegetationZonesLoaded?.(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedParcel?.id]);

  const generateZones = async (): Promise<ZonePrescription[]> => {
    setIsLoadingVegetationMap(true);

    try {
      if (eosdaFieldId) {
        const loadedMapData = await loadVegetationMapByFieldId(eosdaFieldId);

        if (loadedMapData) {
          setVegetationMapData(loadedMapData);
          onVegetationMapDataLoaded?.(loadedMapData);

          const mapZones = convertVegetationMapToMapZones(
            loadedMapData,
            selectedParcel?.id,
            selectedParcel?.name
          );
          onVegetationZonesLoaded?.(mapZones);

          const generated: ZonePrescription[] = loadedMapData.zones.map((zoneObj) => {
            const zoneKey = Object.keys(zoneObj)[0];
            const zone = zoneObj[zoneKey] as {
              zone_area: number;
              kmean?: number[];
            };
            const zoneNumber = parseInt(zoneKey.replace('zone_', ''), 10);
            const areaHa = m2ToHa(zone.zone_area);

            return {
              zoneId: zoneNumber,
              zoneKey: zoneKey,
              rateKgHa: '0',
              zoneArea: zone.zone_area,
              zoneAreaHa: areaHa,
              kmean: zone.kmean?.[0],
              fertilizerAmount: 0,
            };
          });

          return generated;
        } else {
          console.log('No vegetation map found for fieldId:', eosdaFieldId);
        }
      } else {
        console.log('No eosdaFieldId available for selected parcel');
      }

      const count = Number(zonesCount);
      const generated: ZonePrescription[] = Array.from({ length: count }).map((_, i) => {
        const mockArea = 10000 + Math.random() * 40000;
        return {
          zoneId: i + 1,
          zoneKey: `zone_${i + 1}`,
          rateKgHa: '0',
          zoneArea: mockArea,
          zoneAreaHa: m2ToHa(mockArea),
          fertilizerAmount: 0,
        };
      });

      setVegetationMapData(null);
      onVegetationMapDataLoaded?.(null);
      onVegetationZonesLoaded?.(null);
      return generated;
    } catch (error) {
      console.error('Error loading vegetation map:', error);
      const count = Number(zonesCount);
      const generated: ZonePrescription[] = Array.from({ length: count }).map((_, i) => {
        const mockArea = 10000 + Math.random() * 40000;
        return {
          zoneId: i + 1,
          zoneKey: `zone_${i + 1}`,
          rateKgHa: '0',
          zoneArea: mockArea,
          zoneAreaHa: m2ToHa(mockArea),
          fertilizerAmount: 0,
        };
      });

      setVegetationMapData(null);
      onVegetationMapDataLoaded?.(null);
      onVegetationZonesLoaded?.(null);
      return generated;
    } finally {
      setIsLoadingVegetationMap(false);
    }
  };

  return {
    isLoadingVegetationMap,
    vegetationMapData,
    generateZones,
  };
}

