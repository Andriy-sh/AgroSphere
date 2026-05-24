'use client';

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useParams, usePathname } from 'next/navigation';
import {
  MapToggleButton,
  ParcelItem,
  ConfirmationDialog,
  Icon,
  useFarms,
  useDeleteParcel,
  type MapParcel,
  type DrawingFeature,
  type DownloadVisualGeometry,
  type MapMultiPolygon,
  type MapZone,
  type ParcelSplitLine,
  type ParcelData,
  type ParcelWithZones,
} from '@@agrosphere/shared';
import { useMapStore } from '@/stores/use-map-store';
import { DrawingMapContainer } from '../create-parcel-zones/drawing-map-container';
import type { SelectedFarm } from '../create-parcel-zones/types';
import { ViewParcelForm } from './components/view-parcel-form';
import { useFarmData } from '../my-farm/hooks/useFarmData';
import { useParcelNavigation } from './hooks/use-parcel-navigation';
import { hasParcelChanges } from './utils/parcel-changes';
import { useSaveParcel } from './hooks/use-save-parcel';
import {
  cloneParcelData,
  convertParcelItemToViewParcelData,
  findParcelInFarmItems,
  findFarmIdByParcelId,
  convertFarmItemsToFarmMarkers,
  convertParcelDataToViewParcelData,
} from './utils/parcel-converters';
import { ensureClosedRing, calculateCentroid } from './utils/parcel-geometry';
import { convertSampleZonesToMapZones } from './utils/convert-sample-zones-to-map-zones';
import type {
  ViewParcelData,
  ViewParcelFormParcelData,
  Coordinate,
} from './types';

const EMPTY_PARCEL: ViewParcelFormParcelData = {
  id: 'placeholder',
  farmName: '—',
  parcelCode: '—',
  parcelName: 'No parcel selected',
  areaLabel: '—',
  effectiveArea: '',
  soilType: '',
  geometry: [],
  center: [0, 0],
  history: [],
};

export function ViewParcel({ parcelId: propParcelId }: { parcelId?: string }) {
  const params = useParams();
  const parcelIdFromUrl = params?.parcelId as string | undefined;
  const parcelId = propParcelId || parcelIdFromUrl;
  const pathname = usePathname();
  const { farmItems, setFarmItems, refresh } = useFarmData();
  const { mapSize, setMapSize, validateAndSetMapSize, resetMapSize } =
    useMapStore();
  const { mutate: saveParcel } = useSaveParcel();
  const { mutateAsync: deleteParcel } = useDeleteParcel();
  const [parcels, setParcels] = useState<ViewParcelData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [originalParcels, setOriginalParcels] = useState<
    Map<string, ViewParcelData>
  >(new Map());
  const syncedParcelsRef = useRef<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [parcelIdPendingDelete, setParcelIdPendingDelete] = useState<
    string | null
  >(null);
  const zoomToParcelRef = useRef<((parcelId: string) => void) | null>(null);
  const initialZoomDoneRef = useRef<boolean>(false);
  const switchToZonesRef = useRef<(() => void) | null>(null);
  const clearDrawingRef = useRef<(() => void) | null>(null);
  const changeModeRef = useRef<((mode: string) => void) | null>(null);
  const restorePolygonRef = useRef<
    | ((
        geometry: DownloadVisualGeometry,
        parcelName?: string,
        parcelArea?: number
      ) => void)
    | null
  >(null);
  const [drawnFeatures, setDrawnFeatures] = useState<DrawingFeature[]>([]);
  const [isDrawingEnabled, setIsDrawingEnabled] = useState(false);
  const [drawingMode, setDrawingMode] = useState<
    'draw_polygon' | 'draw_line_string' | 'simple_select'
  >('simple_select');

  const baseViewParcelPath = useMemo(() => {
    if (!pathname) {
      return '/my-farm/view-parcel';
    }
    const marker = '/view-parcel';
    const markerIndex = pathname.indexOf(marker);
    if (markerIndex !== -1) {
      return pathname.slice(0, markerIndex + marker.length);
    }
    return '/my-farm/view-parcel';
  }, [pathname]);

  const updateParcelUrl = useCallback(
    (targetParcelId?: string | null) => {
      if (typeof window === 'undefined') {
        return;
      }
      const targetPath = targetParcelId
        ? `${baseViewParcelPath}/${targetParcelId}`
        : baseViewParcelPath;
      if (window.location.pathname === targetPath) {
        return;
      }
      window.history.replaceState(null, '', targetPath);
    },
    [baseViewParcelPath]
  );

  const queueZoomToParcel = useCallback((parcelId?: string | null) => {
    if (!parcelId) {
      return;
    }
    window.setTimeout(() => {
      zoomToParcelRef.current?.(parcelId);
    }, 300);
  }, []);

  const farmMarkers = useMemo(
    () => convertFarmItemsToFarmMarkers(farmItems),
    [farmItems]
  );

  const loadedParcelData = useMemo(() => {
    if (!parcelId || farmItems.length === 0) {
      return null;
    }
    return findParcelInFarmItems(farmItems, parcelId);
  }, [parcelId, farmItems]);

  const { data: farmsResponse } = useFarms(!!parcelId);

  const convertedParcelData = useMemo(() => {
    if (loadedParcelData) {
      return convertParcelItemToViewParcelData(
        loadedParcelData.parcel,
        loadedParcelData.farmName
      );
    }

    if (farmsResponse?.farms && parcelId) {
      for (const farm of farmsResponse.farms) {
        if (farm.parcels) {
          const parcel = farm.parcels.find((p) => p.id === parcelId);
          if (parcel) {
            const parcelData: ParcelData = {
              id: parcel.id,
              item_id:
                typeof parcel.item_id === 'number'
                  ? parcel.item_id
                  : parseInt(String(parcel.item_id), 10) || 0,
              name: parcel.name,
              field_no: parcel.field_no || 0,
              crop:
                parcel.crop && parcel.crop.trim() !== ''
                  ? parcel.crop
                  : 'not_set',
              soil_type: parcel.soil_type || '',
              soil_type_formatted: parcel.soil_type_formatted || '',
              acre: parcel.acre || 0,
              hectare:
                typeof parcel.hectare === 'string'
                  ? parcel.hectare
                  : String(parcel.hectare || '0'),
              boundaries: parcel.boundaries || [],
              boundaries_xy: parcel.boundaries_xy || [],
              sample_zones:
                parcel.sample_zones?.map((zone) => ({
                  id: zone.id,
                  item_id: zone.item_id,
                  name: zone.name,
                  field_no: zone.field_no ?? 0,
                  crop: zone.crop,
                  soil_type: zone.soil_type,
                  acre: zone.acre,
                  hectare:
                    typeof zone.hectare === 'string'
                      ? zone.hectare
                      : String(zone.hectare || '0'),
                  boundaries: zone.boundaries,
                  boundaries_xy: zone.boundaries_xy,
                  created_at: zone.created_at,
                  parcel_item_id: Array.isArray(zone.parcel_item_id)
                    ? zone.parcel_item_id
                    : [],
                  is_merged: zone.is_merged ?? false,
                  is_split: zone.is_split ?? false,
                  show_default_plan: zone.show_default_plan ?? false,
                  sample_plan: zone.sample_plan ?? 0,
                  lab_tests: Array.isArray(zone.lab_tests)
                    ? zone.lab_tests
                    : [],
                })) || [],
              created_at: parcel.created_at || '',
              updated_at: parcel.updated_at,
            };

            return convertParcelDataToViewParcelData(parcelData, farm.name);
          }
        }
      }
    }

    return null;
  }, [loadedParcelData, farmsResponse, parcelId]);

  const allParcelsFromFarms = useMemo(() => {
    const result: ViewParcelFormParcelData[] = [];
    for (const farm of farmItems) {
      if (farm.children) {
        for (const child of farm.children) {
          if ('type' in child && child.type !== 'group') {
            const parcel = child as ParcelItem;
            const converted = convertParcelItemToViewParcelData(
              parcel,
              farm.name
            );
            result.push(converted);
          }
        }
      }
    }
    return result;
  }, [farmItems]);

  const allParcelsFromApi = useMemo(() => {
    const result: ViewParcelFormParcelData[] = [];
    if (farmsResponse?.farms) {
      for (const farm of farmsResponse.farms) {
        if (farm.parcels) {
          for (const parcel of farm.parcels) {
            const parcelData: ParcelData = {
              id: parcel.id,
              item_id:
                typeof parcel.item_id === 'number'
                  ? parcel.item_id
                  : parseInt(String(parcel.item_id), 10) || 0,
              name: parcel.name,
              field_no: parcel.field_no || 0,
              crop:
                parcel.crop && parcel.crop.trim() !== ''
                  ? parcel.crop
                  : 'not_set',
              soil_type: parcel.soil_type || '',
              soil_type_formatted: parcel.soil_type_formatted || '',
              acre: parcel.acre || 0,
              hectare:
                typeof parcel.hectare === 'string'
                  ? parcel.hectare
                  : String(parcel.hectare || '0'),
              boundaries: parcel.boundaries || [],
              boundaries_xy: parcel.boundaries_xy || [],
              sample_zones:
                parcel.sample_zones?.map((zone) => ({
                  id: zone.id,
                  item_id: zone.item_id,
                  name: zone.name,
                  field_no: zone.field_no ?? 0,
                  crop: zone.crop,
                  soil_type: zone.soil_type,
                  acre: zone.acre,
                  hectare:
                    typeof zone.hectare === 'string'
                      ? zone.hectare
                      : String(zone.hectare || '0'),
                  boundaries: zone.boundaries,
                  boundaries_xy: zone.boundaries_xy,
                  created_at: zone.created_at,
                  parcel_item_id: Array.isArray(zone.parcel_item_id)
                    ? zone.parcel_item_id
                    : [],
                  is_merged: zone.is_merged ?? false,
                  is_split: zone.is_split ?? false,
                  show_default_plan: zone.show_default_plan ?? false,
                  sample_plan: zone.sample_plan ?? 0,
                  lab_tests: Array.isArray(zone.lab_tests)
                    ? zone.lab_tests
                    : [],
                })) || [],
              created_at: parcel.created_at || '',
              updated_at: parcel.updated_at,
            };

            const converted = convertParcelDataToViewParcelData(
              parcelData,
              farm.name
            );
            result.push(converted);
          }
        }
      }
    }
    return result;
  }, [farmsResponse]);

  const getParcelFromApi = useCallback(
    (parcelId: string): ViewParcelData | null => {
      if (!farmsResponse?.farms) {
        return null;
      }

      for (const farm of farmsResponse.farms) {
        if (farm.parcels) {
          const parcel = farm.parcels.find((p) => p.id === parcelId);
          if (parcel) {
            const parcelData: ParcelData = {
              id: parcel.id,
              item_id:
                typeof parcel.item_id === 'number'
                  ? parcel.item_id
                  : parseInt(String(parcel.item_id), 10) || 0,
              name: parcel.name,
              field_no: parcel.field_no || 0,
              crop:
                parcel.crop && parcel.crop.trim() !== ''
                  ? parcel.crop
                  : 'not_set',
              soil_type: parcel.soil_type || '',
              soil_type_formatted: parcel.soil_type_formatted || '',
              acre: parcel.acre || 0,
              hectare:
                typeof parcel.hectare === 'string'
                  ? parcel.hectare
                  : String(parcel.hectare || '0'),
              boundaries: parcel.boundaries || [],
              boundaries_xy: parcel.boundaries_xy || [],
              sample_zones:
                parcel.sample_zones?.map((zone) => ({
                  id: zone.id,
                  item_id: zone.item_id,
                  name: zone.name,
                  field_no: zone.field_no ?? 0,
                  crop: zone.crop,
                  soil_type: zone.soil_type,
                  acre: zone.acre,
                  hectare:
                    typeof zone.hectare === 'string'
                      ? zone.hectare
                      : String(zone.hectare || '0'),
                  boundaries: zone.boundaries,
                  boundaries_xy: zone.boundaries_xy,
                  created_at: zone.created_at,
                  parcel_item_id: Array.isArray(zone.parcel_item_id)
                    ? zone.parcel_item_id
                    : [],
                  is_merged: zone.is_merged ?? false,
                  is_split: zone.is_split ?? false,
                  show_default_plan: zone.show_default_plan ?? false,
                  sample_plan: zone.sample_plan ?? 0,
                  lab_tests: Array.isArray(zone.lab_tests)
                    ? zone.lab_tests
                    : [],
                })) || [],
              created_at: parcel.created_at || '',
              updated_at: parcel.updated_at,
            };

            return convertParcelDataToViewParcelData(parcelData, farm.name);
          }
        }
      }

      return null;
    },
    [farmsResponse]
  );

  const enrichParcelWithSampleZones = useCallback(
    (parcel: ViewParcelData, forceRefresh = false): ViewParcelData => {
      if (forceRefresh) {
        const apiParcel = getParcelFromApi(parcel.id);
        if (apiParcel) {
          return apiParcel;
        }
      }

      if (parcel.history && parcel.history.length > 0 && !forceRefresh) {
        return parcel;
      }

      const apiParcel = getParcelFromApi(parcel.id);
      if (apiParcel) {
        return apiParcel;
      }

      return parcel;
    },
    [getParcelFromApi]
  );

  useEffect(() => {
    const allParcels = [...allParcelsFromFarms];

    const parcelIds = new Set(allParcels.map((p) => p.id));
    for (const apiParcel of allParcelsFromApi) {
      if (!parcelIds.has(apiParcel.id)) {
        allParcels.push(apiParcel);
        parcelIds.add(apiParcel.id);
      }
    }

    if (allParcels.length > 0) {
      const clonedParcels = allParcels.map(cloneParcelData);

      if (convertedParcelData) {
        const existingIndex = clonedParcels.findIndex(
          (p) => p.id === convertedParcelData.id
        );
        if (existingIndex !== -1) {
          clonedParcels[existingIndex] = cloneParcelData(convertedParcelData);
        } else {
          clonedParcels.push(cloneParcelData(convertedParcelData));
        }
      }

      const enrichedParcels = clonedParcels.map((parcel) =>
        enrichParcelWithSampleZones(parcel, false)
      );

      setParcels(enrichedParcels);

      setOriginalParcels((prevOriginal) => {
        const newOriginal = new Map(prevOriginal);
        enrichedParcels.forEach((parcel) => {
          if (convertedParcelData && parcel.id === convertedParcelData.id) {
            newOriginal.set(parcel.id, cloneParcelData(parcel));
          } else if (!newOriginal.has(parcel.id)) {
            newOriginal.set(parcel.id, cloneParcelData(parcel));
          }
        });
        return newOriginal;
      });

      if (convertedParcelData) {
        const targetIndex = enrichedParcels.findIndex(
          (p) => p.id === convertedParcelData.id
        );
        if (targetIndex !== -1) {
          setActiveIndex(targetIndex);
        } else if (enrichedParcels.length > 0) {
          setActiveIndex(0);
        }
      } else if (enrichedParcels.length > 0) {
        setActiveIndex(0);
      }
    } else if (convertedParcelData) {
      const clonedData = cloneParcelData(convertedParcelData);
      const enrichedData = enrichParcelWithSampleZones(clonedData, false);
      setParcels([enrichedData]);
      setActiveIndex(0);
      setOriginalParcels((prevOriginal) => {
        const newOriginal = new Map(prevOriginal);
        newOriginal.set(enrichedData.id, cloneParcelData(enrichedData));
        return newOriginal;
      });
    } else {
      setParcels([]);
      setActiveIndex(0);
    }
  }, [
    allParcelsFromFarms,
    allParcelsFromApi,
    convertedParcelData,
    enrichParcelWithSampleZones,
  ]);

  const activeParcel = parcels[activeIndex];

  const hasChanges = useMemo(() => {
    if (!activeParcel) {
      return false;
    }
    const original = originalParcels.get(activeParcel.id);
    if (!original) {
      return false;
    }
    return hasParcelChanges(activeParcel, original);
  }, [activeParcel, originalParcels]);

  useEffect(() => {
    validateAndSetMapSize(40, false);

    return () => {
      resetMapSize();
    };
  }, [validateAndSetMapSize, resetMapSize]);

  const handleMapSizeChange = useCallback(
    (size: number) => {
      const nextSize = size >= 100 ? 100 : 40;
      setMapSize(nextSize);
    },
    [setMapSize]
  );

  const handleParcelChange = useCallback(
    (
      parcelId: string,
      updates: Partial<{
        farmName: string;
        parcelCode: string;
        parcelName: string;
        effectiveArea: string;
        soilType: string;
        crop?: string;
        history?: ViewParcelData['history'];
      }>
    ) => {
      setParcels((prev) =>
        prev.map((parcel) =>
          parcel.id === parcelId
            ? {
                ...parcel,
                ...updates,
                farmName: updates.farmName ?? parcel.farmName,
                parcelCode: updates.parcelCode ?? parcel.parcelCode,
                parcelName: updates.parcelName ?? parcel.parcelName,
                effectiveArea: updates.effectiveArea ?? parcel.effectiveArea,
                soilType: updates.soilType ?? parcel.soilType,
                crop: updates.crop ?? parcel.crop,
                history: updates.history ?? parcel.history,
              }
            : parcel
        )
      );
    },
    []
  );

  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      let newIndex: number;
      if (direction === 'prev') {
        newIndex = Math.max(0, activeIndex - 1);
      } else {
        newIndex = Math.min(parcels.length - 1, activeIndex + 1);
      }

      const newParcel = parcels[newIndex];
      if (!newParcel) {
        return;
      }

      const apiParcel = getParcelFromApi(newParcel.id);
      if (apiParcel) {
        setParcels((prev) =>
          prev.map((p) =>
            p.id === newParcel.id ? cloneParcelData(apiParcel) : p
          )
        );

        setOriginalParcels((prev) => {
          const next = new Map(prev);
          next.set(newParcel.id, cloneParcelData(apiParcel));
          return next;
        });
      }

      setActiveIndex(newIndex);
      updateParcelUrl(newParcel.id);
      queueZoomToParcel(newParcel.id);
    },
    [parcels, activeIndex, queueZoomToParcel, updateParcelUrl, getParcelFromApi]
  );

  const handleDiscardChanges = useCallback(() => {
    if (!activeParcel) {
      return;
    }

    const original = originalParcels.get(activeParcel.id);
    if (original) {
      setParcels((prev) =>
        prev.map((parcel) =>
          parcel.id === activeParcel.id ? cloneParcelData(original) : parcel
        )
      );
    }
  }, [activeParcel, originalParcels]);

  const [pendingParcelId, setPendingParcelId] = useState<string | null>(null);

  const {
    handlePrev,
    handleNext,
    showUnsavedChangesDialog,
    handleConfirmNavigation: handleConfirmNavigationFromHook,
    handleCancelNavigation,
  } = useParcelNavigation({
    hasChanges,
    totalParcels: parcels.length,
    activeIndex,
    onNavigate: handleNavigate,
    onDiscardChanges: handleDiscardChanges,
  });

  const handleParcelSelect = useCallback(
    (parcelId: string) => {
      const targetIndex = parcels.findIndex((p) => p.id === parcelId);
      if (targetIndex === -1 || targetIndex === activeIndex) {
        return;
      }

      if (hasChanges) {
        setPendingParcelId(parcelId);
        return;
      }

      const apiParcel = getParcelFromApi(parcelId);
      if (apiParcel) {
        setParcels((prev) =>
          prev.map((p) => (p.id === parcelId ? cloneParcelData(apiParcel) : p))
        );

        setOriginalParcels((prev) => {
          const next = new Map(prev);
          next.set(parcelId, cloneParcelData(apiParcel));
          return next;
        });
      }

      setActiveIndex(targetIndex);
      updateParcelUrl(parcelId);
      queueZoomToParcel(parcelId);
    },
    [
      parcels,
      activeIndex,
      hasChanges,
      queueZoomToParcel,
      updateParcelUrl,
      getParcelFromApi,
    ]
  );

  const handleConfirmNavigation = useCallback(() => {
    handleDiscardChanges();

    if (pendingParcelId) {
      const targetIndex = parcels.findIndex((p) => p.id === pendingParcelId);
      if (targetIndex !== -1) {
        const apiParcel = getParcelFromApi(pendingParcelId);
        if (apiParcel) {
          setParcels((prev) =>
            prev.map((p) =>
              p.id === pendingParcelId ? cloneParcelData(apiParcel) : p
            )
          );

          setOriginalParcels((prev) => {
            const next = new Map(prev);
            next.set(pendingParcelId, cloneParcelData(apiParcel));
            return next;
          });
        }

        setActiveIndex(targetIndex);
        updateParcelUrl(pendingParcelId);
        queueZoomToParcel(pendingParcelId);
      }
      setPendingParcelId(null);
    } else {
      handleConfirmNavigationFromHook();
    }
  }, [
    pendingParcelId,
    parcels,
    handleConfirmNavigationFromHook,
    handleDiscardChanges,
    updateParcelUrl,
    queueZoomToParcel,
    getParcelFromApi,
  ]);

  const showDialog = showUnsavedChangesDialog || pendingParcelId !== null;

  const handleCancelNavigationWithSelect = useCallback(() => {
    setPendingParcelId(null);
    handleCancelNavigation();
  }, [handleCancelNavigation]);

  const parcelOptions = useMemo(
    () =>
      parcels.map((parcel) => ({
        id: parcel.id,
        parcelCode: parcel.parcelCode,
        parcelName: parcel.parcelName,
      })),
    [parcels]
  );

  const handleRequestDeleteParcel = useCallback(() => {
    if (!activeParcel) {
      return;
    }
    setParcelIdPendingDelete(activeParcel.id);
    setDeleteDialogOpen(true);
  }, [activeParcel]);

  const handleCancelDeleteParcel = useCallback(() => {
    setDeleteDialogOpen(false);
    setParcelIdPendingDelete(null);
  }, []);

  const handleConfirmDeleteParcel = useCallback(async () => {
    if (!parcelIdPendingDelete) {
      return;
    }

    const parcelToDelete = parcels.find(
      (parcel) => parcel.id === parcelIdPendingDelete
    );
    if (!parcelToDelete) {
      return;
    }

    const farmId = findFarmIdByParcelId(farmItems, parcelIdPendingDelete);
    if (!farmId) {
      console.error('Farm ID not found for parcel:', parcelIdPendingDelete);
      setDeleteDialogOpen(false);
      setParcelIdPendingDelete(null);
      return;
    }

    try {
      await deleteParcel({ farmId, parcelId: parcelIdPendingDelete });

      const indexToDelete = parcels.findIndex(
        (parcel) => parcel.id === parcelIdPendingDelete
      );
      const updatedParcels = parcels.filter(
        (parcel) => parcel.id !== parcelIdPendingDelete
      );

      let nextIndex = 0;
      let nextActiveParcelId: string | null = null;

      if (updatedParcels.length > 0) {
        nextIndex = Math.min(indexToDelete, updatedParcels.length - 1);
        nextActiveParcelId = updatedParcels[nextIndex]?.id ?? null;
      } else {
        nextIndex = 0;
        nextActiveParcelId = null;
      }

      setParcels(updatedParcels);
      setActiveIndex(nextIndex);

      setOriginalParcels((prev) => {
        const next = new Map(prev);
        next.delete(parcelIdPendingDelete);
        return next;
      });

      syncedParcelsRef.current.delete(parcelIdPendingDelete);

      if (nextActiveParcelId) {
        initialZoomDoneRef.current = false;
      }

      setPendingParcelId((prev) =>
        prev === parcelIdPendingDelete ? null : prev
      );
      setDeleteDialogOpen(false);
      setParcelIdPendingDelete(null);

      await refresh();

      updateParcelUrl(nextActiveParcelId);
      if (nextActiveParcelId) {
        queueZoomToParcel(nextActiveParcelId);
      } else {
        updateParcelUrl(null);
      }
    } catch (error) {
      console.error('Error deleting parcel:', error);
    }
  }, [
    parcelIdPendingDelete,
    parcels,
    farmItems,
    deleteParcel,
    refresh,
    updateParcelUrl,
    queueZoomToParcel,
  ]);

  const parcelPendingDelete = useMemo(
    () =>
      parcelIdPendingDelete
        ? parcels.find((parcel) => parcel.id === parcelIdPendingDelete)
        : null,
    [parcelIdPendingDelete, parcels]
  );

  const convertGeometryToDownloadVisual = useCallback(
    (geometry: Coordinate[]): DownloadVisualGeometry => {
      const closedRing = ensureClosedRing(geometry);
      return {
        type: 'Polygon',
        coordinates: [closedRing],
      };
    },
    []
  );

  const convertMapParcelToGeometry = useCallback(
    (mapParcel: MapParcel | null): Coordinate[] => {
      if (
        !mapParcel ||
        !mapParcel.coordinates ||
        mapParcel.coordinates.length === 0
      ) {
        return [];
      }
      const firstPolygon = mapParcel.coordinates[0];
      if (!firstPolygon || firstPolygon.length === 0) {
        return [];
      }
      const firstRing = firstPolygon[0];
      const coords =
        firstRing.length > 1 &&
        firstRing[0][0] === firstRing[firstRing.length - 1][0] &&
        firstRing[0][1] === firstRing[firstRing.length - 1][1]
          ? firstRing.slice(0, -1)
          : firstRing;
      return coords.map((coord) => [coord[0], coord[1]] as Coordinate);
    },
    []
  );

  const handleDrawingChange = useCallback(
    (features: DrawingFeature[]) => {
      setDrawnFeatures(features);
      if (!activeParcel || features.length === 0) {
        return;
      }

      const feature = features[0];
      if (
        feature?.geometry?.type === 'Polygon' &&
        feature.geometry.coordinates
      ) {
        const coords = (feature.geometry.coordinates[0] || []) as number[][];
        const geometry = coords.map(
          (coord) => [coord[0], coord[1]] as Coordinate
        );
        const normalizedCoordinates = ensureClosedRing(geometry);
        const centroid = calculateCentroid(normalizedCoordinates);

        setParcels((prev) =>
          prev.map((parcel) =>
            parcel.id === activeParcel.id
              ? {
                  ...parcel,
                  geometry: normalizedCoordinates.map(
                    (coordinate) => [...coordinate] as Coordinate
                  ),
                  center: [...centroid] as Coordinate,
                }
              : parcel
          )
        );
      }
    },
    [activeParcel]
  );

  const handleParcelWithZonesChange = useCallback(
    (parcel: MapParcel | null) => {
      if (!activeParcel || !parcel) {
        return;
      }

      const geometry = convertMapParcelToGeometry(parcel);
      if (geometry.length > 0) {
        const normalizedCoordinates = ensureClosedRing(geometry);
        const centroid = calculateCentroid(normalizedCoordinates);

        setParcels((prev) =>
          prev.map((p) =>
            p.id === activeParcel.id
              ? {
                  ...p,
                  geometry: normalizedCoordinates.map(
                    (coordinate) => [...coordinate] as Coordinate
                  ),
                  center: [...centroid] as Coordinate,
                }
              : p
          )
        );
      }
    },
    [activeParcel, convertMapParcelToGeometry]
  );

  const convertParcelWithZonesToMapParcel = useCallback(
    (parcelWithZones: ParcelWithZones): MapParcel => {
      const extractCoordinates = (coords: number[][]): MapMultiPolygon => {
        if (coords.length === 0) {
          return [];
        }
        const closedCoords = [...coords, coords[0]] as [number, number][];
        return [[closedCoords]];
      };

      const zones = parcelWithZones.zones.map((zone) => ({
        id: zone.zoneId,
        name: zone.zoneName || '',
        area: zone.area,
        coordinates: extractCoordinates(zone.coordinates),
        visible: true,
        parcelId: parcelWithZones.parcelId,
        parcelName: activeParcel?.parcelName || '',
      }));

      const splitLines = parcelWithZones.splitLines.map((line, index) => ({
        id: `${parcelWithZones.parcelId}-split-${index + 1}`,
        coordinates: line.coordinates as [number, number][],
      }));

      const parcelCoords = extractCoordinates(
        parcelWithZones.parcelCoordinates
      );

      return {
        id: parcelWithZones.parcelId,
        name: activeParcel?.parcelName || '',
        area: parcelWithZones.area,
        coordinates: parcelCoords,
        zones: zones as MapZone[],
        splitLines: splitLines as ParcelSplitLine[],
        createdAt: new Date().toISOString(),
        visible: true,
      };
    },
    [activeParcel]
  );

  const handleParcelWithZonesChangeRaw = useCallback(
    (parcelWithZones: ParcelWithZones | null) => {
      if (!parcelWithZones) {
        handleParcelWithZonesChange(null);
        return;
      }
      const mapParcel = convertParcelWithZonesToMapParcel(parcelWithZones);
      handleParcelWithZonesChange(mapParcel);
    },
    [handleParcelWithZonesChange, convertParcelWithZonesToMapParcel]
  );

  useEffect(() => {
    if (activeParcel && !syncedParcelsRef.current.has(activeParcel.id)) {
      const original = originalParcels.get(activeParcel.id);

      const enrichedParcel = enrichParcelWithSampleZones(activeParcel, false);

      if (!original) {
        setOriginalParcels((prev) => {
          const newOriginal = new Map(prev);
          newOriginal.set(enrichedParcel.id, cloneParcelData(enrichedParcel));
          return newOriginal;
        });
        syncedParcelsRef.current.add(activeParcel.id);
      } else {
        const hasChanges = hasParcelChanges(enrichedParcel, original);
        if (hasChanges) {
          setOriginalParcels((prev) => {
            const newOriginal = new Map(prev);
            newOriginal.set(enrichedParcel.id, cloneParcelData(enrichedParcel));
            return newOriginal;
          });
        }
        syncedParcelsRef.current.add(activeParcel.id);
      }
    }
  }, [activeParcel?.id, enrichParcelWithSampleZones]);

  useEffect(() => {
    if (
      !parcelId ||
      initialZoomDoneRef.current ||
      !activeParcel ||
      activeParcel.id !== parcelId ||
      activeParcel.geometry.length === 0
    ) {
      return;
    }

    let timeoutId: NodeJS.Timeout | null = null;
    let retryTimeoutId: NodeJS.Timeout | null = null;
    let retryCount = 0;
    const MAX_RETRIES = 50;

    const checkAndZoom = () => {
      if (initialZoomDoneRef.current || retryCount >= MAX_RETRIES) {
        return;
      }

      if (zoomToParcelRef.current) {
        timeoutId = setTimeout(() => {
          if (
            zoomToParcelRef.current &&
            activeParcel.id === parcelId &&
            !initialZoomDoneRef.current
          ) {
            zoomToParcelRef.current(activeParcel.id);
            initialZoomDoneRef.current = true;
          }
        }, 500);
      } else {
        retryCount++;
        retryTimeoutId = setTimeout(checkAndZoom, 100);
      }
    };

    checkAndZoom();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (retryTimeoutId) {
        clearTimeout(retryTimeoutId);
      }
    };
  }, [parcelId, activeParcel]);

  useEffect(() => {
    if (
      activeParcel &&
      restorePolygonRef.current &&
      activeParcel.geometry.length > 0
    ) {
      const coordinates = activeParcel.geometry.map(
        (coord) => [coord[0], coord[1]] as Coordinate
      );
      const geometry = convertGeometryToDownloadVisual(coordinates);
      const area = parseFloat(activeParcel.effectiveArea) || 0;
      restorePolygonRef.current(geometry, activeParcel.parcelName, area);

      setDrawingMode('simple_select');
      setIsDrawingEnabled(true);

      if (changeModeRef.current) {
        changeModeRef.current('simple_select');
      }

      if (initialZoomDoneRef.current) {
        setTimeout(() => {
          queueZoomToParcel(activeParcel.id);
        }, 300);
      }
    } else if (
      restorePolygonRef.current &&
      (!activeParcel || activeParcel.geometry.length === 0)
    ) {
      setIsDrawingEnabled(false);
      setDrawingMode('simple_select');
      if (clearDrawingRef.current) {
        clearDrawingRef.current();
      }
    }
  }, [activeParcel, convertGeometryToDownloadVisual, queueZoomToParcel]);

  const handleParcelSelectFromForm = useCallback(
    (parcelId: string) => {
      const targetIndex = parcels.findIndex((p) => p.id === parcelId);
      if (targetIndex === -1) {
        return;
      }

      if (hasChanges) {
        setPendingParcelId(parcelId);
        return;
      }

      setActiveIndex(targetIndex);
      updateParcelUrl(parcelId);
      queueZoomToParcel(parcelId);
    },
    [parcels, hasChanges, updateParcelUrl, queueZoomToParcel]
  );

  const handleFarmSelectFromForm = useCallback(
    (farmName: string) => {
      if (activeParcel && activeParcel.farmName !== farmName) {
        handleParcelChange(activeParcel.id, { farmName });
      }
    },
    [activeParcel, handleParcelChange]
  );

  const handleDrawZone = useCallback(() => {
    if (!activeParcel) {
      return;
    }
    setIsDrawingEnabled(true);
    setDrawingMode('draw_line_string');
    if (changeModeRef.current) {
      changeModeRef.current('draw_line_string');
    }
  }, [activeParcel]);

  const handleSatelliteZone = useCallback(() => {
    if (!activeParcel) {
      return;
    }
    switchToZonesRef.current?.();
  }, [activeParcel]);

  const handleSave = useCallback(async () => {
    if (!activeParcel) {
      return;
    }

    const farm = farmItems.find((f) => f.name === activeParcel.farmName);
    if (!farm) {
      console.error('Farm not found for parcel:', activeParcel.farmName);
      return;
    }

    const farmId = farm.id;

    saveParcel(
      {
        farmId: farmId,
        parcelId: activeParcel.id,
        parcel: activeParcel,
      },
      {
        onSuccess: () => {
          setOriginalParcels((prev) => {
            const newOriginal = new Map(prev);
            newOriginal.set(activeParcel.id, cloneParcelData(activeParcel));
            return newOriginal;
          });

          syncedParcelsRef.current.delete(activeParcel.id);
        },
        onError: (error) => {
          console.error('Error saving parcel:', error);
        },
      }
    );
  }, [activeParcel, farmItems, saveParcel]);

  const handleCancel = useCallback(() => {
    if (!activeParcel) {
      return;
    }

    const original = originalParcels.get(activeParcel.id);
    if (!original) {
      return;
    }

    setParcels((prev) =>
      prev.map((parcel) =>
        parcel.id === activeParcel.id ? cloneParcelData(original) : parcel
      )
    );
  }, [activeParcel, originalParcels]);

  const apiParcelsForMap = useMemo(() => {
    if (!farmsResponse?.farms) {
      return [];
    }

    const allParcels: MapParcel[] = [];

    farmsResponse.farms.forEach((farm) => {
      if (!farm.parcels || !Array.isArray(farm.parcels)) {
        return;
      }

      farm.parcels.forEach((parcel) => {
        if (!parcel.boundaries || !Array.isArray(parcel.boundaries)) {
          return;
        }

        const coordinates = parcel.boundaries.map(
          (coord: number[]) => [coord[1], coord[0]] as [number, number]
        );

        const firstCoord = coordinates[0];
        const lastCoord = coordinates[coordinates.length - 1];
        const closedCoordinates =
          firstCoord &&
          lastCoord &&
          firstCoord[0] === lastCoord[0] &&
          firstCoord[1] === lastCoord[1]
            ? coordinates
            : firstCoord
            ? [...coordinates, firstCoord]
            : coordinates;

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
      });
    });

    return allParcels;
  }, [farmsResponse]);

  const selectedFarm = useMemo((): SelectedFarm | null => {
    if (!activeParcel) {
      return null;
    }
    const farm = farmItems.find((f) => f.name === activeParcel.farmName);
    if (!farm) {
      return null;
    }
    return {
      id: farm.id,
      label: farm.name,
      latitude: farm.lat || 0,
      longitude: farm.lng || 0,
    };
  }, [activeParcel, farmItems]);

  const apiZonesForActiveParcel = useMemo(() => {
    if (!activeParcel || !farmsResponse?.farms) {
      return [];
    }

    for (const farm of farmsResponse.farms) {
      if (farm.parcels) {
        const parcel = farm.parcels.find((p) => p.id === activeParcel.id);
        if (parcel && parcel.sample_zones && parcel.sample_zones.length > 0) {
          const sampleZones = parcel.sample_zones.map((zone) => ({
            id: zone.id,
            item_id: zone.item_id,
            name: zone.name,
            field_no: zone.field_no ?? 0,
            crop: zone.crop,
            soil_type: zone.soil_type,
            acre: zone.acre,
            hectare:
              typeof zone.hectare === 'string'
                ? zone.hectare
                : String(zone.hectare || '0'),
            boundaries: zone.boundaries,
            boundaries_xy: zone.boundaries_xy,
            created_at: zone.created_at,
            parcel_item_id: Array.isArray(zone.parcel_item_id)
              ? zone.parcel_item_id
              : [],
            is_merged: zone.is_merged ?? false,
            is_split: zone.is_split ?? false,
            show_default_plan: zone.show_default_plan ?? false,
            sample_plan: zone.sample_plan ?? 0,
            lab_tests: Array.isArray(zone.lab_tests) ? zone.lab_tests : [],
          }));

          return convertSampleZonesToMapZones(
            sampleZones,
            activeParcel.id,
            activeParcel.parcelName,
            activeParcel.farmName
          );
        }
      }
    }

    return [];
  }, [activeParcel, farmsResponse]);

  return (
    <div className="flex h-full w-full max-h-full flex-col gap-4">
      <div className="flex flex-1 flex-row gap-2 overflow-hidden">
        {mapSize < 100 && (
          <Suspense fallback={<div className="flex-1">Loading...</div>}>
            <ViewParcelForm
              parcel={activeParcel ?? EMPTY_PARCEL}
              parcels={parcelOptions}
              farmItems={farmItems}
              onParcelChange={handleParcelChange}
              onParcelSelect={activeParcel ? handleParcelSelect : undefined}
              onFarmSelect={handleFarmSelectFromForm}
              onParcelSelectFromForm={handleParcelSelectFromForm}
              onPrev={activeParcel && activeIndex > 0 ? handlePrev : undefined}
              onNext={
                activeParcel && activeIndex < parcels.length - 1
                  ? handleNext
                  : undefined
              }
              disablePrev={activeParcel ? activeIndex === 0 : true}
              disableNext={
                activeParcel ? activeIndex === parcels.length - 1 : true
              }
              hasChanges={hasChanges}
              onSave={activeParcel ? handleSave : undefined}
              onCancel={activeParcel ? handleCancel : undefined}
              onDelete={activeParcel ? handleRequestDeleteParcel : undefined}
              navigationParcels={parcels.map((p) => ({ id: p.id }))}
              activeIndex={activeIndex}
              zoomToParcelRef={zoomToParcelRef}
              isDisabled={!activeParcel}
              onDrawZone={activeParcel ? handleDrawZone : undefined}
              onSatelliteZone={activeParcel ? handleSatelliteZone : undefined}
            />
          </Suspense>
        )}
        {mapSize > 0 && (
          <div
            className={`flex flex-col overflow-hidden rounded-xl bg-white shadow-sm ${
              mapSize === 100 ? 'h-full w-full' : 'h-full flex-shrink-0'
            }`}
            style={
              mapSize === 100
                ? { width: '100%' }
                : { width: `${mapSize}%`, minWidth: `${mapSize}vw` }
            }
          >
            <DrawingMapContainer
              onParcelChange={handleParcelWithZonesChange}
              onDrawingChange={handleDrawingChange}
              onParcelWithZonesChange={handleParcelWithZonesChangeRaw}
              drawnFeatures={drawnFeatures}
              parcelName={activeParcel?.parcelName}
              drawingMode={drawingMode}
              selectedFarm={selectedFarm}
              farmMarkers={farmMarkers}
              apiParcels={apiParcelsForMap}
              apiZones={apiZonesForActiveParcel}
              onChangeModeRef={changeModeRef}
              onClearDrawingRef={clearDrawingRef}
              onRestorePolygonRef={restorePolygonRef}
              enabled={isDrawingEnabled}
              showOnlyLine={true}
              activeParcelGeometry={
                activeParcel?.geometry
                  ? (activeParcel.geometry.map(
                      (coord) => [coord[0], coord[1]] as [number, number]
                    ) as Array<[number, number]>)
                  : null
              }
              onZoomToParcelRef={zoomToParcelRef}
              activeParcelId={activeParcel?.id}
            />
          </div>
        )}
        <MapToggleButton
          mapSize={mapSize}
          showFilters={false}
          onMapSizeChange={handleMapSizeChange}
        />
      </div>

      <ConfirmationDialog
        isOpen={showDialog}
        onClose={handleCancelNavigationWithSelect}
        onConfirm={handleConfirmNavigation}
        title="Unsaved Changes"
        message="You have unsaved changes in the current parcel. If you continue, all unsaved changes will be lost."
        confirmText="Continue"
        cancelText="Return to Form"
        confirmButtonVariant="danger"
        size="md"
        icon={
          <Icon
            className="bg-basic-red-opacity text-basic-red p-2 rounded-lg"
            icon="warning"
          />
        }
      />

      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        onClose={handleCancelDeleteParcel}
        onConfirm={handleConfirmDeleteParcel}
        title="Delete parcel"
        message={`${
          parcelPendingDelete?.parcelName ?? 'This parcel'
        } will be permanently deleted. This action cannot be undone.`}
        confirmText="Delete parcel"
        cancelText="Keep parcel"
        confirmButtonVariant="danger"
        size="md"
        icon={
          <Icon
            className="bg-basic-red-opacity text-basic-red p-2 rounded-lg"
            icon="delete"
          />
        }
      />
    </div>
  );
}
