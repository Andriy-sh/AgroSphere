'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  useCreateEosdaField,
  useCreatePKZoning,
  useGetPKZoningMap,
} from '@@agrosphere/shared';
import type {
  DownloadVisualGeometry,
  CreatePKZoningRequest,
} from '@@agrosphere/shared';
import type { Feature as GeoJsonFeature } from 'geojson';
import { convertGeoJsonToCreateFieldDto } from '../utils/eosda-field-converter';
import type { CreateParcelZonesFormData } from '../types';
import type { ParcelWithZones } from '@@agrosphere/shared';

interface UseSatelliteImageProps {
  drawnFeatures: unknown[];
  formData: CreateParcelZonesFormData;
  drawnArea: number;
  parcelWithZones?: ParcelWithZones | null;
  clearDrawingRef?: React.MutableRefObject<(() => void) | null>;
  onImageReady: (
    imageUrl: string,
    geometry: DownloadVisualGeometry,
    satelliteDate: Date | null
  ) => void;
}

export function useSatelliteImage({
  drawnFeatures,
  formData,
  drawnArea,
  parcelWithZones,
  clearDrawingRef,
  onImageReady,
}: UseSatelliteImageProps) {
  const [createdFieldId, setCreatedFieldId] = useState<string | null>(null);
  const [zmapId, setZmapId] = useState<string | null>(null);
  const [shouldPollPKZoning, setShouldPollPKZoning] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [savedGeometry, setSavedGeometry] =
    useState<DownloadVisualGeometry | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImageReady, setIsImageReady] = useState(false);
  const savedPolygonGeometryRef = useRef<DownloadVisualGeometry | null>(null);
  const savedParcelNameRef = useRef<string | null>(null);
  const savedParcelAreaRef = useRef<number | null>(null);

  const createFieldMutation = useCreateEosdaField();
  const createPKZoningMutation = useCreatePKZoning();

  const { data: pkZoningStatus } = useGetPKZoningMap(
    createdFieldId,
    zmapId,
    shouldPollPKZoning,
    shouldPollPKZoning ? 5000 : undefined
  );

  // Poll PK Zoning status
  useEffect(() => {
    if (!shouldPollPKZoning || !pkZoningStatus) {
      return;
    }

    if (pkZoningStatus.status === 'done') {
      setShouldPollPKZoning(false);
      setIsImageReady(true);

      let geometry: DownloadVisualGeometry | null =
        savedPolygonGeometryRef.current;

      if (!geometry) {
        const firstFeature = drawnFeatures[0] as GeoJsonFeature;
        if (firstFeature && firstFeature.geometry?.type === 'Polygon') {
          geometry = {
            type: 'Polygon',
            coordinates:
              (firstFeature.geometry.coordinates as number[][][]) || [],
          };
          savedPolygonGeometryRef.current = geometry;
          setSavedGeometry(geometry);
          const featureParcelName = (
            firstFeature.properties as { parcelName?: string }
          )?.parcelName;
          if (featureParcelName && !savedParcelNameRef.current) {
            savedParcelNameRef.current = featureParcelName;
          }
        }
      } else {
        setSavedGeometry(geometry);
      }

      if (pkZoningStatus.image_link && geometry) {
        const imageUrlValue = pkZoningStatus.image_link;
        setImageUrl(imageUrlValue);

        onImageReady(imageUrlValue, geometry, null);

        setTimeout(() => {
          if (clearDrawingRef?.current) {
            clearDrawingRef.current();
          }
        }, 500);
      }
    } else if (pkZoningStatus.status === 'failed') {
      setShouldPollPKZoning(false);
      setIsGenerating(false);
    }
  }, [
    pkZoningStatus,
    shouldPollPKZoning,
    drawnFeatures,
    clearDrawingRef,
    onImageReady,
  ]);

  const handleGenerateField = useCallback(async (): Promise<string> => {
    if (!formData.name.trim()) {
      throw new Error('Parcel name is required');
    }

    let polygonFeature: GeoJsonFeature | null = null;

    for (const feature of drawnFeatures) {
      const geoFeature = feature as GeoJsonFeature;
      if (geoFeature?.geometry?.type === 'Polygon') {
        polygonFeature = geoFeature;
        break;
      }
    }

    if (!polygonFeature && parcelWithZones?.parcelCoordinates) {
      polygonFeature = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Polygon',
          coordinates: [parcelWithZones.parcelCoordinates],
        },
      };
    }

    if (!polygonFeature) {
      throw new Error('No polygon found');
    }

    const polygonGeometry: DownloadVisualGeometry = {
      type: 'Polygon',
      coordinates:
        polygonFeature.geometry.type === 'Polygon'
          ? (polygonFeature.geometry.coordinates as number[][][])
          : [],
    };
    savedPolygonGeometryRef.current = polygonGeometry;
    setSavedGeometry(polygonGeometry);
    savedParcelNameRef.current = formData.name || null;
    savedParcelAreaRef.current = drawnArea > 0 ? drawnArea : null;

    setIsGenerating(true);
    try {
      setZmapId(null);
      setShouldPollPKZoning(false);

      const fieldDto = convertGeoJsonToCreateFieldDto(
        polygonFeature,
        formData.name
      );
      if (!fieldDto) {
        throw new Error('Failed to convert parcel to field format');
      }

      const fieldResponse = await createFieldMutation.mutateAsync(fieldDto);

      const createdFieldIdValue =
        typeof fieldResponse === 'object' && 'id' in fieldResponse
          ? String(fieldResponse.id)
          : null;

      if (!createdFieldIdValue) {
        throw new Error('Failed to get field ID from response');
      }

      setCreatedFieldId(createdFieldIdValue);
      setIsGenerating(false);
      return createdFieldIdValue;
    } catch (error) {
      setIsGenerating(false);
      throw error;
    }
  }, [
    drawnFeatures,
    parcelWithZones,
    formData.name,
    drawnArea,
    createFieldMutation,
  ]);

  const handleCreatePKZoning = useCallback(
    async (data: {
      periodStart: string;
      periodEnd: string;
      zonesCount: number;
      vegetationIndex: string;
    }) => {
      let fieldId = createdFieldId;

      if (!fieldId) {
        fieldId = await handleGenerateField();
      }

      const firstFeature = drawnFeatures[0] as GeoJsonFeature;
      if (!firstFeature || firstFeature.geometry?.type !== 'Polygon') {
        throw new Error('Missing polygon geometry');
      }

      if (!savedPolygonGeometryRef.current) {
        const geometry: DownloadVisualGeometry = {
          type: 'Polygon',
          coordinates:
            (firstFeature.geometry.coordinates as number[][][]) || [],
        };
        savedPolygonGeometryRef.current = geometry;
        setSavedGeometry(geometry);
      }

      const pkZoningRequest: CreatePKZoningRequest = {
        type_zmap: 2,
        start_date: data.periodStart,
        end_date: data.periodEnd,
        zones: data.zonesCount,
        vegetation_index: data.vegetationIndex as
          | 'NDVI'
          | 'EVI'
          | 'NDWI'
          | 'SAVI',
      };

      try {
        setIsImageReady(false);
        setIsGenerating(true);
        const response = await createPKZoningMutation.mutateAsync({
          fieldId: fieldId,
          data: pkZoningRequest,
        });

        setZmapId(String(response.zmap_id));
        setShouldPollPKZoning(true);
        setIsGenerating(false);
      } catch (error) {
        setShouldPollPKZoning(false);
        setIsGenerating(false);
        throw error;
      }
    },
    [createdFieldId, drawnFeatures, createPKZoningMutation, handleGenerateField]
  );

  const resetSatelliteState = useCallback(() => {
    setImageUrl(null);
    setCreatedFieldId(null);
    setZmapId(null);
    setShouldPollPKZoning(false);
    setIsGenerating(false);
    setIsImageReady(false);
  }, []);

  const getSavedParcelData = useCallback(() => {
    return {
      geometry: savedPolygonGeometryRef.current,
      parcelName: savedParcelNameRef.current,
      parcelArea: savedParcelAreaRef.current,
    };
  }, []);

  return {
    handleGenerateField,
    handleCreatePKZoning,
    imageUrl,
    savedGeometry,
    resetSatelliteState,
    getSavedParcelData,
    sceneSearchResults: [], 
    isGenerating,
    isLoading: shouldPollPKZoning || isGenerating,
    isCreatingImage: shouldPollPKZoning,
    isImageReady,
  };
}
