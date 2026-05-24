'use client';

import { useState, useCallback } from 'react';
import * as turf from '@turf/turf';
import type {
  ParcelData,
  SelectedFarm,
  CreateParcelZonesFormData,
  FormStep,
} from '../types';
import { getNextParcelName } from '../utils/form-helpers';
import {
  useCreateParcel,
  type CreateParcelRequest,
  type ParcelWithZones,
} from '@@agrosphere/shared';
import type { Feature as GeoJsonFeature } from 'geojson';

/**
 * Converts boundaries (lng/lat) to local planar XY coordinates in meters
 * Uses the first point as origin and calculates distance + bearing for each point
 */
function buildBoundariesXY(boundaries: number[][]): number[][] {
  if (boundaries.length === 0) {
    return [];
  }

  const origin = boundaries[0];
  const [originLat, originLng] = origin;

  return boundaries.map(([lat, lng]) => {
    const from = turf.point([originLng, originLat]);
    const to = turf.point([lng, lat]);

    const distance = turf.distance(from, to, { units: 'meters' });
    const bearing = (turf.bearing(from, to) * Math.PI) / 180;

    const x = distance * Math.cos(bearing);
    const y = distance * Math.sin(bearing);

    return [x, y];
  });
}

interface UseParcelManagementProps {
  selectedFarm: SelectedFarm | null;
  formData: CreateParcelZonesFormData;
  drawnFeatures: unknown[];
  drawnArea: number;
  clearDrawingRef?: React.MutableRefObject<(() => void) | null>;
  onParcelSaved?: (parcel: ParcelData) => void;
  eosdaFieldId?: string | null;
  parcelWithZones?: ParcelWithZones | null;
}

export function useParcelManagement({
  selectedFarm,
  formData,
  drawnFeatures,
  drawnArea,
  clearDrawingRef,
  onParcelSaved,
  eosdaFieldId,
  parcelWithZones,
}: UseParcelManagementProps) {
  const createParcelMutation = useCreateParcel();
  const [savedParcels, setSavedParcels] = useState<ParcelData[]>([]);
  const [currentStep, setCurrentStep] = useState<FormStep>('select-farm');

  const clearCurrentDrawing = useCallback(() => {
    setCurrentStep('create-parcel');
  }, []);

  const clearAllSavedParcels = useCallback(() => {
    setSavedParcels([]);
    clearCurrentDrawing();
  }, [clearCurrentDrawing]);

  const deleteLastParcel = useCallback(() => {
    if (drawnFeatures.length === 0) {
      return;
    }

    if (clearDrawingRef?.current) {
      clearDrawingRef.current();
    }

    clearCurrentDrawing();
  }, [drawnFeatures, clearDrawingRef, clearCurrentDrawing]);

  const hectareToAcre = (hectare: number): number => {
    return hectare * 2.47105;
  };

  const handleSave = useCallback(async () => {
    if (drawnFeatures.length === 0) {
      return;
    }

    try {
      const firstFeature = drawnFeatures[0] as GeoJsonFeature;
      const geometry = firstFeature?.geometry;

      if (!geometry || geometry.type !== 'Polygon') {
        console.error('Expected Polygon geometry for parcel');
        return;
      }

      const firstRing = geometry.coordinates?.[0] ?? [];
      if (!firstRing.length) {
        console.error('Parcel polygon has no coordinates');
        return;
      }

      // Convert coordinates to [lat, lng] format for boundaries
      // firstRing is Position[] which can be [number, number] or [number, number, number]
      const boundaries: number[][] = firstRing.map((coord) => {
        const lng = coord[0];
        const lat = coord[1];
        return [lat, lng];
      });

      // Calculate boundaries_xy from boundaries using Turf.js
      const boundaries_xy: number[][] = buildBoundariesXY(boundaries);

      const hectare =
        typeof drawnArea === 'number' && drawnArea > 0
          ? drawnArea
          : parseFloat(
              (formData.area || '').toString().replace(/≈/g, '').trim()
            ) || 0;

      const effectiveHectare =
        parseFloat(formData.effectiveArea || '') || hectare;
      const acre = hectareToAcre(hectare);

      const farmId = selectedFarm?.id ?? formData.farm;
      if (!farmId) {
        console.error('Farm ID is required to save parcel');
        return;
      }

      // Transform zones if they exist
      // Only include zones if parcelWithZones exists AND has 2 or more zones with valid coordinates
      const validZones =
        parcelWithZones?.zones?.filter(
          (zone) => zone.coordinates && zone.coordinates.length > 0
        ) || [];
      const hasZones = validZones.length >= 2;

      const createParcelRequest: CreateParcelRequest = {
        name: formData.name || 'Unnamed',
        itemId: formData.id ? String(formData.id) : undefined,
        crop: formData.crop || 'not_set',
        soilType: formData.soilType || 'not_set',
        acre: acre,
        hectare: hectare,
        effectiveHectare:
          effectiveHectare !== hectare ? effectiveHectare : undefined,
        boundaries: boundaries,
        boundaries_xy: boundaries_xy,
        ...(hasZones && {
          hasZones: true,
          zones: validZones.map((zone, index) => {
            // zone.area is in square meters (from turf.area), convert to hectares
            const zoneHectare = zone.area ? zone.area / 10000 : 0;
            const zoneAcre = hectareToAcre(zoneHectare);

            let zoneBoundaries: number[][] = [];
            if (zone.coordinates && zone.coordinates.length > 0) {
              // zone.coordinates is number[][] (array of [lng, lat] pairs)
              const coords = zone.coordinates;
              zoneBoundaries = coords.map((coord: number[]) => [
                coord[1], // lat
                coord[0], // lng
              ]);
            }

            // Calculate boundaries_xy for zone
            const zoneBoundariesXY =
              zoneBoundaries.length > 0
                ? buildBoundariesXY(zoneBoundaries)
                : [[0, 0]];

            // Use zone index + 1 as itemId (1, 2, 3, ...)
            const zoneNumber = index + 1;

            return {
              name: zone.zoneName || zone.zoneId,
              itemId: String(zoneNumber),
              crop: formData.crop || 'not_set',
              soilType: formData.soilType || 'not_set',
              acre: zoneAcre,
              hectare: zoneHectare,
              boundaries: zoneBoundaries.length > 0 ? zoneBoundaries : [[0, 0]],
              boundaries_xy: zoneBoundariesXY,
            };
          }),
        }),
      };

      const response = await createParcelMutation.mutateAsync({
        farmId,
        data: createParcelRequest,
      });

      const parcelData: ParcelData = {
        id: response.id,
        farm: formData.farm,
        farmData: selectedFarm,
        name: response.name,
        parcelId: formData.id || response.id,
        area: formData.area,
        effectiveArea: formData.effectiveArea,
        soilType: formData.soilType,
        drawnFeatures: drawnFeatures,
        drawnArea: drawnArea,
        createdAt: response.created_at,
      };

      setSavedParcels((prev) => [...prev, parcelData]);
      onParcelSaved?.(parcelData);
    } catch (error) {
      console.error('Error saving parcel:', error);
      throw error; // Re-throw to allow error handling in calling component
    }
  }, [
    drawnFeatures,
    formData,
    selectedFarm,
    drawnArea,
    onParcelSaved,
    parcelWithZones,
    createParcelMutation,
  ]);

  const getNextParcelNameForFarm = useCallback(() => {
    return getNextParcelName(savedParcels, selectedFarm);
  }, [savedParcels, selectedFarm]);

  return {
    savedParcels,
    setSavedParcels,
    currentStep,
    setCurrentStep,
    clearCurrentDrawing,
    clearAllSavedParcels,
    deleteLastParcel,
    handleSave,
    getNextParcelNameForFarm,
  };
}
