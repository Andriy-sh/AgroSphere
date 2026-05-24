'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  ParcelWithZones,
  FarmItem,
  FarmMarker,
  MapParcel,
  MapMultiPolygon,
  MapZone,
} from '@@agrosphere/shared';
import type {
  CreateParcelZonesFormData,
  SelectedFarm,
  ZonesHistoryEntry,
  DrawingMode,
} from '../types';
import type { DownloadVisualGeometry } from '@@agrosphere/shared';
import type { Feature as GeoJsonFeature } from 'geojson';
import {
  soilTypeOptions,
  cropOptions,
  mockFarmsData,
  type FarmOption,
} from '../constants';
import { useCreateEosdaField, useFarms } from '@@agrosphere/shared';
import { convertGeoJsonToCreateFieldDto } from '../utils/eosda-field-converter';
import { useSatelliteImage } from './use-satellite-image';
import { useFormValidation } from './use-form-validation';
import { useParcelManagement } from './use-parcel-management';
import { useZonesHistory } from './use-zones-history';

export type {
  CreateParcelZonesFormData,
  SelectedFarm,
  ParcelData,
  ZonesHistoryEntry,
} from '../types';

const INITIAL_FORM_STATE: CreateParcelZonesFormData = {
  farm: '',
  name: '',
  id: '',
  area: '',
  effectiveArea: '',
  soilType: 'not_set',
  crop: 'not_set',
};

export function useCreateParcelZonesForm(
  clearDrawingRef?: React.MutableRefObject<(() => void) | null>,
  changeModeRef?: React.MutableRefObject<((mode: string) => void) | null>,
  restorePolygonRef?: React.MutableRefObject<
    | ((
        geometry: DownloadVisualGeometry,
        parcelName?: string,
        parcelArea?: number
      ) => void)
    | null
  >,
  initialFarmId?: string
) {
  const { data: farmsData, isLoading: isLoadingFarms } = useFarms();

  const farmItems: FarmItem[] = useMemo(() => {
    if (!farmsData?.farms) {
      return [];
    }
    return farmsData.farms.map((farm) => ({
      id: farm.id,
      name: farm.name,
      lat: farm.location?.[0] ?? 0,
      lng: farm.location?.[1] ?? 0,
      area: 0,
      parcels: 0,
      children: [],
      item_id: farm.item_id,
      created_at: farm.created_at,
    })) as FarmItem[];
  }, [farmsData]);

  const farmOptions: FarmOption[] = useMemo(
    () => [
      { value: '', label: 'Select farm' },
      ...farmItems.map((farm) => ({
        value: farm.id,
        label: farm.name,
        id: farm.id,
        latitude: farm.lat ?? 0,
        longitude: farm.lng ?? 0,
      })),
    ],
    [farmItems]
  );

  const [isFormVisible, setIsFormVisible] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState<SelectedFarm | null>(null);
  const [formData, setFormData] =
    useState<CreateParcelZonesFormData>(INITIAL_FORM_STATE);
  const [drawnFeatures, setDrawnFeatures] = useState<unknown[]>([]);
  const [drawnArea, setDrawnArea] = useState<number>(0);
  const [parcelWithZones, setParcelWithZones] =
    useState<ParcelWithZones | null>(null);
  const [enableDrawing, setEnableDrawing] = useState(false);
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('draw_polygon');

  useEffect(() => {
    if (changeModeRef?.current) {
      const originalChangeMode = changeModeRef.current;
      changeModeRef.current = (mode: string) => {
        originalChangeMode(mode);
        setDrawingMode(mode as DrawingMode);
      };
      return () => {
        if (changeModeRef?.current) {
          changeModeRef.current = originalChangeMode;
        }
      };
    }
    return undefined;
  }, [changeModeRef]);

  const [currentParcelName, setCurrentParcelName] = useState<string>('');
  const [currentParcelArea, setCurrentParcelArea] = useState<string>('');
  const [currentParcelAreaNumber, setCurrentParcelAreaNumber] =
    useState<number>(0);
  const createFieldMutation = useCreateEosdaField();
  const [eosdaFieldId, setEosdaFieldId] = useState<string | null>(null);

  const {
    errors,
    validateField,
    clearErrors,
    isFormValid: validateForm,
    setErrors,
  } = useFormValidation();

  const {
    savedParcels,
    setSavedParcels,
    currentStep,
    setCurrentStep,
    clearAllSavedParcels,
    handleSave: saveParcel,
  } = useParcelManagement({
    selectedFarm,
    formData,
    drawnFeatures,
    drawnArea,
    clearDrawingRef,
    onParcelSaved: () => {
      setFormData((prev) => ({
        ...prev,
        name: '',
        id: '',
        area: '',
        effectiveArea: '',
        soilType: '',
      }));
      setCurrentParcelName('');
      setCurrentParcelArea('');
      setCurrentParcelAreaNumber(0);
      clearCurrentDrawing();
      clearErrors();
    },
    eosdaFieldId,
    parcelWithZones,
  });

  const {
    zonesHistory,
    handleParcelWithZonesChange: handleParcelWithZonesChangeFromHistory,
    addHistoryEntry,
    clearHistory,
    deleteHistoryEntry,
    updateHistoryEntryName,
    updateHistoryEntryZones,
    mapZones,
  } = useZonesHistory({ selectedFarm });

  const handleParcelWithZonesChange = useCallback(
    (parcel: ParcelWithZones | null) => {
      setParcelWithZones(parcel);

      if (parcel) {
        if (
          parcel.area !== undefined &&
          parcel.area !== null &&
          parcel.area > 0
        ) {
          const areaString = `≈${parcel.area.toFixed(2)}`;
          setCurrentParcelArea(areaString);
          setCurrentParcelAreaNumber(parcel.area);
          setFormData((prev) => ({
            ...prev,
            area: areaString,
          }));
        } else {
          if (currentParcelArea && currentParcelAreaNumber > 0) {
            setFormData((prev) => ({
              ...prev,
              area: prev.area || currentParcelArea,
            }));
          } else if (drawnArea > 0) {
            const areaString = `≈${drawnArea.toFixed(2)}`;
            setCurrentParcelArea(areaString);
            setCurrentParcelAreaNumber(drawnArea);
            setFormData((prev) => ({
              ...prev,
              area: prev.area || areaString,
            }));
          }
        }

        // Removed automatic name setting - user must manually enter the name
        // if (parcel.parcelId) {
        //   setCurrentParcelName(parcel.parcelId);
        //   setFormData((prev) => ({
        //     ...prev,
        //     name: parcel.parcelId,
        //   }));
        // } else if (currentParcelName) {
        //   setFormData((prev) => ({
        //     ...prev,
        //     name: currentParcelName,
        //   }));
        // }
      }

      handleParcelWithZonesChangeFromHistory(parcel);
    },
    [
      currentParcelArea,
      currentParcelAreaNumber,
      drawnArea,
      handleParcelWithZonesChangeFromHistory,
    ]
  );

  const handleImageReady = useCallback(
    (
      imageUrl: string,
      geometry: DownloadVisualGeometry,
      satelliteDate: Date | null
    ) => {
      const parcelCoordinates = geometry.coordinates[0] || [];

      const parcelWithZonesForImage: ParcelWithZones = {
        parcelId: formData.id || formData.name || 'satellite-image',
        parcelCoordinates: parcelCoordinates,
        zones: [],
        splitLines: [],
        area: drawnArea,
      };

      const historyEntry: ZonesHistoryEntry = {
        id: Date.now().toString(),
        parcelWithZones: parcelWithZonesForImage,
        createdAt: new Date(),
        zonesCount: 0,
        method: 'Satellite Image',
        imageUrl: imageUrl,
        savedGeometry: geometry,
        satelliteDate: satelliteDate,
      };

      addHistoryEntry(historyEntry);
    },
    [formData.id, formData.name, drawnArea, addHistoryEntry]
  );

  const {
    handleGenerateField,
    handleCreatePKZoning,
    imageUrl,
    savedGeometry,
    resetSatelliteState,
    getSavedParcelData,
    sceneSearchResults,
    isGenerating,
    isLoading: isLoadingSatellite,
    isCreatingImage,
    isImageReady,
  } = useSatelliteImage({
    drawnFeatures,
    formData,
    drawnArea,
    parcelWithZones,
    clearDrawingRef,
    onImageReady: handleImageReady,
  });

  const handleMapSizeChange = (size: number) => {
    setIsFormVisible(size === 40);
  };

  const handleDrawingChange = async (features: unknown[]) => {
    setDrawnFeatures(features);

    // Log when a new parcel polygon is finished
    if (features.length > 0) {
      const lastFeature = features[features.length - 1] as GeoJsonFeature;
      if (lastFeature?.geometry?.type === 'Polygon') {
        const parcelName =
          formData.name && formData.name.trim().length > 0
            ? formData.name
            : currentParcelName || 'New parcel';

        // TODO: Temporarily commented out EOSDA field creation request
        // const fieldDto = convertGeoJsonToCreateFieldDto(
        //   lastFeature,
        //   parcelName
        // );

        // if (fieldDto) {
        //   try {
        //     const response = await createFieldMutation.mutateAsync(fieldDto);
        //     const fieldId =
        //       (response as any)?.field_id ?? (response as any)?.id ?? null;

        //     if (fieldId != null) {
        //       setEosdaFieldId(String(fieldId));
        //     }
        //   } catch (error) {
        //     console.error('Error creating EOSDA field on draw:', error);
        //   }
        // } else {
        //   setEosdaFieldId(null);
        // }

        // Set eosdaFieldId to null since we're not creating fields via API
        setEosdaFieldId(null);
      }
    }

    // Removed automatic name generation - user must manually enter the name

    if (features.length > 0 && currentStep === 'create-parcel') {
      setCurrentStep('create-zones');
    }
  };

  const clearCurrentDrawing = useCallback(() => {
    if (clearDrawingRef?.current) {
      clearDrawingRef.current();
    }
    setDrawnFeatures([]);
    setDrawnArea(0);
    setParcelWithZones(null);
    clearHistory();
    setFormData((prev) => ({
      ...prev,
      area: prev.area || '',
    }));
    setCurrentStep('create-parcel');
    resetSatelliteState();
  }, [clearDrawingRef, clearHistory, resetSatelliteState, setCurrentStep]);

  const deleteLastParcel = () => {
    if (drawnFeatures.length === 0) {
      return;
    }

    if (clearDrawingRef?.current) {
      clearDrawingRef.current();
    }

    clearCurrentDrawing();

    const currentFarm = formData.farm;
    setCurrentParcelName('');
    setCurrentParcelArea('');
    setCurrentParcelAreaNumber(0);
    setFormData({
      farm: currentFarm,
      name: '',
      id: '',
      area: '',
      effectiveArea: '',
      soilType: '',
      crop: 'not_set',
    });
  };

  const handleDrawingAreaChange = (area: number) => {
    setDrawnArea(area);

    if (area > 0) {
      const areaString = `≈${area.toFixed(2)}`;
      setCurrentParcelArea(areaString);
      setCurrentParcelAreaNumber(area);
      setFormData((prev) => ({
        ...prev,
        area: areaString,
      }));
    } else {
      setFormData((prev) => {
        if (prev.area && prev.area.trim() !== '') {
          return prev;
        }
        if (!currentParcelArea) {
          return {
            ...prev,
            area: '',
          };
        }
        return {
          ...prev,
          area: currentParcelArea,
        };
      });

      if (!currentParcelAreaNumber && currentParcelArea) {
        const numericValue = parseFloat(
          currentParcelArea.replace(/≈/g, '').trim()
        );
        if (!isNaN(numericValue) && numericValue > 0) {
          setCurrentParcelAreaNumber(numericValue);
        }
      }
    }
  };

  const updateField = (
    field: keyof CreateParcelZonesFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'name') {
      setCurrentParcelName(value);
    } else if (field === 'area') {
      setCurrentParcelArea(value);
      const numericValue = parseFloat(value.replace(/≈/g, '').trim());
      if (!isNaN(numericValue) && numericValue > 0) {
        setCurrentParcelAreaNumber(numericValue);
      }
    }

    if (field === 'farm') {
      const selectedFarmData = farmOptions.find(
        (option) => option.value === value
      );

      if (
        selectedFarmData &&
        selectedFarmData.id &&
        selectedFarmData.latitude != null &&
        selectedFarmData.longitude != null
      ) {
        const farmData: SelectedFarm = {
          id: selectedFarmData.id,
          label: selectedFarmData.label,
          latitude: selectedFarmData.latitude,
          longitude: selectedFarmData.longitude,
        };

        setSelectedFarm(farmData);
        setEnableDrawing(true);
        setCurrentStep('create-parcel');

        const apiFarm = farmItems.find(
          (farm) => farm.id === selectedFarmData.id
        ) as FarmItem | undefined;

        if (
          apiFarm &&
          Array.isArray(apiFarm.children) &&
          apiFarm.children.length > 0
        ) {
          const existingParcels = apiFarm.children
            .filter(
              (
                child
              ): child is Extract<typeof child, { geometry: number[][] }> =>
                'geometry' in child &&
                Array.isArray(child.geometry) &&
                child.geometry.length > 0
            )
            .map((child) => {
              const ring = child.geometry as [number, number][];

              const feature: GeoJsonFeature = {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Polygon',
                  coordinates: [ring],
                },
              };

              const areaHa =
                typeof child.area === 'number' && !Number.isNaN(child.area)
                  ? child.area
                  : 0;

              const parcelData = {
                id: child.id,
                farm: selectedFarmData.value,
                farmData,
                name: child.name,
                parcelId: child.id,
                area: areaHa > 0 ? areaHa.toString() : '',
                effectiveArea: '',
                soilType: child.type ?? '',
                drawnFeatures: [feature],
                drawnArea: areaHa,
                createdAt: new Date().toISOString(),
              };

              return parcelData;
            });

          setSavedParcels(existingParcels);
          clearHistory();
        } else {
          setSavedParcels([]);
          clearHistory();
        }
      } else {
        setSelectedFarm(null);
        setEnableDrawing(false);
        setCurrentStep('select-farm');
        setSavedParcels([]);
        clearHistory();
      }
    }

    validateField(field, value);
  };

  // Set initial farmId from URL when farms are loaded
  useEffect(() => {
    if (initialFarmId && farmOptions.length > 1 && !formData.farm) {
      const farmExists = farmOptions.some(
        (option) => option.value === initialFarmId
      );
      if (farmExists) {
        updateField('farm', initialFarmId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFarmId, farmOptions.length]);

  const resetForm = () => {
    const currentFarm = formData.farm;

    if (clearDrawingRef?.current) {
      clearDrawingRef.current();
    }

    handleDrawingChange([]);
    handleParcelWithZonesChange(null);

    setDrawnFeatures([]);
    setDrawnArea(0);
    setParcelWithZones(null);
    clearHistory();
    resetSatelliteState();

    setCurrentParcelName('');
    setCurrentParcelArea('');
    setCurrentParcelAreaNumber(0);
    setFormData({
      farm: currentFarm,
      name: '',
      id: '',
      area: '',
      effectiveArea: '',
      soilType: '',
      crop: 'not_set',
    });

    setDrawingMode('draw_polygon');
    clearErrors();
    setCurrentStep(currentFarm ? 'create-parcel' : 'select-farm');
  };

  const handleCancel = () => {
    if (clearDrawingRef?.current) {
      clearDrawingRef.current();
    }

    handleDrawingChange([]);
    handleParcelWithZonesChange(null);

    setIsFormVisible(true);
    setSelectedFarm(null);
    setEnableDrawing(false);
    setDrawnFeatures([]);
    setDrawnArea(0);
    setParcelWithZones(null);
    setSavedParcels([]);
    setCurrentStep('select-farm');

    setCurrentParcelName('');
    setCurrentParcelArea('');
    setCurrentParcelAreaNumber(0);
    setFormData(INITIAL_FORM_STATE);

    clearHistory();
    resetSatelliteState();
    clearErrors();
    setDrawingMode('draw_polygon');
  };

  const handleSave = async () => {
    if (errors.name || errors.id) {
      return;
    }

    await saveParcel();
  };

  const handleDrawZone = () => {
    // Enable drawing if not already enabled
    if (!enableDrawing) {
      setEnableDrawing(true);
    }

    const savedData = getSavedParcelData();
    const geometryToRestore = savedGeometry || savedData.geometry;
    const savedParcelName = savedData.parcelName || formData.name || '';
    const savedParcelArea =
      savedData.parcelArea ||
      (formData.area ? parseFloat(formData.area) : undefined);

    const hasPolygon = drawnFeatures.some(
      (f: unknown) => (f as GeoJsonFeature)?.geometry?.type === 'Polygon'
    );

    // Restore polygon if needed (for satellite images or saved geometry)
    if (geometryToRestore && (!hasPolygon || imageUrl)) {
      if (restorePolygonRef?.current) {
        const restoredFeature: GeoJsonFeature = {
          type: 'Feature',
          properties: {
            parcelName: savedParcelName,
            parcelAreaLabel: savedParcelArea
              ? `${savedParcelArea.toFixed(2)} ha`
              : '',
          },
          geometry: {
            type: 'Polygon',
            coordinates: geometryToRestore.coordinates,
          },
        };

        const existingFeatures = drawnFeatures.filter(
          (f: unknown) => (f as GeoJsonFeature)?.geometry?.type !== 'Polygon'
        );

        handleDrawingChange([restoredFeature, ...existingFeatures]);

        if (drawnArea === 0 && savedParcelArea) {
          setDrawnArea(savedParcelArea);
        }

        restorePolygonRef.current(
          geometryToRestore,
          savedParcelName,
          savedParcelArea
        );

        if (imageUrl) {
          resetSatelliteState();
        }
      }
    }

    // Always switch to draw_line_string mode for drawing zones
    setTimeout(() => {
      if (changeModeRef?.current) {
        changeModeRef.current('draw_line_string');
      } else {
        setDrawingMode('draw_line_string');
      }
    }, 100);
  };

  const farmMarkers: FarmMarker[] = useMemo(() => {
    return farmItems
      .filter((farm) => farm.lat != null && farm.lng != null)
      .map((farm) => ({
        id: farm.id,
        longitude: farm.lng ?? 0,
        latitude: farm.lat ?? 0,
        title: farm.name,
        status: 'active' as const,
        type: 'farm' as const,
        name: farm.name,
        visible: true,
        color: '#29B54C',
      }));
  }, [farmItems]);

  // Convert API parcels to MapParcel format for display
  const apiParcels: MapParcel[] = useMemo(() => {
    if (!farmsData?.farms) {
      return [];
    }

    const allParcels: MapParcel[] = [];

    farmsData.farms.forEach((farm) => {
      if (!farm.parcels || !Array.isArray(farm.parcels)) {
        return;
      }

      farm.parcels.forEach(
        (parcel: {
          id: string;
          name: string;
          boundaries: number[][];
          hectare?: number | string;
        }) => {
          if (!parcel.boundaries || !Array.isArray(parcel.boundaries)) {
            return;
          }

          // Convert boundaries from [[lat, lng], ...] to MapMultiPolygon format [[[[lng, lat], ...]]]
          // Close the polygon by adding the first point at the end if needed
          const coordinates = parcel.boundaries.map(
            (coord: number[]) => [coord[1], coord[0]] as [number, number]
          );

          // Ensure polygon is closed
          const firstCoord = coordinates[0];
          const lastCoord = coordinates[coordinates.length - 1];
          const closedCoordinates =
            firstCoord[0] === lastCoord[0] && firstCoord[1] === lastCoord[1]
              ? coordinates
              : [...coordinates, firstCoord];

          // Parse hectare value (keep in hectares for display)
          const hectareValue =
            typeof parcel.hectare === 'string'
              ? parseFloat(parcel.hectare)
              : parcel.hectare || 0;
          const areaInHectares = hectareValue > 0 ? hectareValue : undefined;

          const mapParcel: MapParcel = {
            id: parcel.id,
            name: parcel.name,
            area: areaInHectares,
            coordinates: [[closedCoordinates]] as MapMultiPolygon,
            visible: true,
            farmId: farm.id,
          };

          allParcels.push(mapParcel);
        }
      );
    });

    return allParcels;
  }, [farmsData]);

  // Convert API sample_zones to MapZone format for display
  const apiZones: MapZone[] = useMemo(() => {
    if (!farmsData?.farms) {
      return [];
    }

    const allZones: MapZone[] = [];

    farmsData.farms.forEach((farm) => {
      if (!farm.parcels || !Array.isArray(farm.parcels)) {
        return;
      }

      farm.parcels.forEach(
        (parcel: {
          id: string;
          name: string;
          sample_zones?: Array<{
            id: string;
            name: string;
            boundaries: number[][];
            hectare?: number | string;
            item_id?: number;
          }>;
        }) => {
          if (
            !parcel.sample_zones ||
            !Array.isArray(parcel.sample_zones) ||
            parcel.sample_zones.length === 0
          ) {
            return;
          }

          parcel.sample_zones.forEach((zone) => {
            if (!zone.boundaries || !Array.isArray(zone.boundaries)) {
              return;
            }

            // Convert boundaries from [[lat, lng], ...] to MapMultiPolygon format [[[[lng, lat], ...]]]
            const coordinates = zone.boundaries.map(
              (coord: number[]) => [coord[1], coord[0]] as [number, number]
            );

            // Ensure polygon is closed
            const firstCoord = coordinates[0];
            const lastCoord = coordinates[coordinates.length - 1];
            const closedCoordinates =
              firstCoord[0] === lastCoord[0] && firstCoord[1] === lastCoord[1]
                ? coordinates
                : [...coordinates, firstCoord];

            // Parse hectare value (keep in hectares for display)
            const hectareValue =
              typeof zone.hectare === 'string'
                ? parseFloat(zone.hectare)
                : zone.hectare || 0;
            const areaInHectares = hectareValue > 0 ? hectareValue : undefined;

            const mapZone: MapZone = {
              id: zone.id,
              name: zone.name,
              area: areaInHectares,
              coordinates: [[closedCoordinates]] as MapMultiPolygon,
              visible: true,
              farmId: farm.id,
              parcelId: parcel.id,
              parcelName: parcel.name,
              zIndex: 6,
            };

            allZones.push(mapZone);
          });
        }
      );
    });

    return allZones;
  }, [farmsData]);

  const isFormValid = validateForm(formData);
  const isFarmSelected = selectedFarm !== null;
  const canCreateParcel = isFarmSelected;
  const canCreateZones = isFarmSelected && drawnFeatures.length > 0;

  return {
    isFormVisible,
    selectedFarm,
    formData,
    drawnFeatures,
    drawnArea,
    currentParcelAreaNumber,
    parcelWithZones,
    enableDrawing,
    drawingMode,
    savedParcels,
    zonesHistory,
    errors,
    farmOptions,
    soilTypeOptions,
    cropOptions,
    farmMarkers,
    apiParcels,
    apiZones,

    handleMapSizeChange,
    handleDrawingChange,
    handleParcelWithZonesChange,
    clearCurrentDrawing,
    clearAllSavedParcels,
    deleteLastParcel,
    handleDrawingAreaChange,
    updateField,
    handleSave,
    handleCancel,
    handleDrawZone,
    handleGenerateField,
    handleCreatePKZoning,
    resetForm,
    deleteHistoryEntry,
    updateHistoryEntryName,
    updateHistoryEntryZones,

    isFormValid,
    currentStep,
    canCreateParcel,
    canCreateZones,
    mapZones,
    imageUrl,
    savedGeometry,
    sceneSearchResults,
    isGenerating,
    isLoadingSatellite,
    isCreatingImage,
    isImageReady,
  };
}
