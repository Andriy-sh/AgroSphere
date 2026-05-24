'use client';

import { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import { CreateParcelZonesMap } from './create-parcel-zones-map';
import {
  Button,
  Breadcrumbs,
  ConfirmationDialog,
  Icon,
  SatellitePKForm,
} from '@@agrosphere/shared';
import type { SatellitePKFormData } from '@@agrosphere/shared';
import type {
  MapParcel,
  DownloadVisualGeometry,
  DrawingFeature,
} from '@@agrosphere/shared';
import Image from 'next/image';
import { useCreateParcelZonesForm } from './hooks/use-create-parcel-zones-form';
import { convertParcelDataToMapParcel } from './utils/parcel-converters';
import { InfoBanner } from './components/info-banner';
import { ParcelForm } from './components/parcel-form';
import { ZonesManagement } from './components/zones-management';
import mapboxgl from 'mapbox-gl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { DrawingMapContainer } from './drawing-map-container';

export function CreateParcelZones() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const farmIdFromUrl = searchParams.get('farmId');
  const queryClient = useQueryClient();
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isSatelliteFormOpen, setIsSatelliteFormOpen] = useState(false);
  const [canCreateSatellite, setCanCreateSatellite] = useState(false);
  const [currentParcel, setCurrentParcel] = useState<MapParcel | null>(null);
  const [mapDrawnArea, setMapDrawnArea] = useState<number>(0);
  const satelliteFormRef = useRef<{
    getFormData: () => SatellitePKFormData;
  } | null>(null);
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
  const mapRefRef = useRef<React.MutableRefObject<mapboxgl.Map | null> | null>(
    null
  );

  const {
    isFormVisible,
    selectedFarm,
    formData,
    drawnFeatures,
    drawnArea,
    currentParcelAreaNumber,
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
    imageUrl,
    savedGeometry,
    sceneSearchResults,
    isGenerating,
    isLoadingSatellite,
    isCreatingImage,
    isImageReady,
  } = useCreateParcelZonesForm(
    clearDrawingRef,
    changeModeRef,
    restorePolygonRef,
    farmIdFromUrl || undefined
  );

  const handleCancelClick = () => {
    setIsCancelDialogOpen(true);
  };

  const handleCancelConfirm = () => {
    setIsCancelDialogOpen(false);
    router.push('/my-farm');
  };

  const handleCancelDialogClose = () => {
    setIsCancelDialogOpen(false);
  };

  const handleSaveClick = () => {
    if (!isFormValid || drawnFeatures.length === 0) {
      return;
    }
    setIsSaveDialogOpen(true);
  };

  const getParcelDataForConsole = useCallback(() => {
    const getBoundaries = (): number[][] => {
      if (currentParcel?.coordinates && currentParcel.coordinates.length > 0) {
        const firstPolygon = currentParcel.coordinates[0];
        if (firstPolygon && firstPolygon.length > 0) {
          const firstRing = firstPolygon[0];
          const coords =
            firstRing.length > 0 &&
            firstRing[0][0] === firstRing[firstRing.length - 1][0] &&
            firstRing[0][1] === firstRing[firstRing.length - 1][1]
              ? firstRing.slice(0, -1)
              : firstRing;
          return coords.map((coord: number[]) => [coord[1], coord[0]]); // Convert to [lat, lng]
        }
      }
      if (drawnFeatures && drawnFeatures.length > 0) {
        const feature = drawnFeatures[0] as DrawingFeature;
        if (feature?.geometry?.coordinates) {
          let coords: number[][] = [];
          if (feature.geometry.type === 'Polygon') {
            const polygonCoords = feature.geometry.coordinates as number[][][];
            coords = polygonCoords[0] || [];
          } else if (feature.geometry.type === 'MultiPolygon') {
            const multiPolygonCoords = feature.geometry
              .coordinates as number[][][][];
            if (multiPolygonCoords[0] && multiPolygonCoords[0][0]) {
              coords = multiPolygonCoords[0][0] || [];
            }
          }
          if (coords.length > 0) {
            return coords.map((coord: number[]) => [coord[1], coord[0]]);
          }
        }
      }
      return [];
    };

    const hectareToAcre = (hectare: number): number => {
      return hectare * 2.47105;
    };

    const hectare = parseFloat(formData.area) || mapDrawnArea || drawnArea;
    const effectiveHectare = parseFloat(formData.effectiveArea) || hectare;
    const acre = hectareToAcre(hectare);
    const boundaries = getBoundaries();
    // const hasZones = currentParcel?.zones && currentParcel.zones.length > 0;
    // const zoneType = hasZones ? 'manual' : null;

    // const zones =
    //   currentParcel?.zones?.map((zone) => {
    //     const zoneHectare = zone.area ? zone.area / 10000 : 0;
    //     const zoneAcre = hectareToAcre(zoneHectare);

    //     let zoneBoundaries: number[][] = [[0]];
    //     if (zone.coordinates && zone.coordinates.length > 0) {
    //       const firstPolygon = zone.coordinates[0];
    //       if (firstPolygon && firstPolygon.length > 0) {
    //         const firstRing = firstPolygon[0];
    //         const coords =
    //           firstRing.length > 0 &&
    //           firstRing[0][0] === firstRing[firstRing.length - 1][0] &&
    //           firstRing[0][1] === firstRing[firstRing.length - 1][1]
    //             ? firstRing.slice(0, -1)
    //             : firstRing;
    //         zoneBoundaries = coords.map((coord: number[]) => [
    //           coord[1],
    //           coord[0],
    //         ]);
    //       }
    //     }

    //     return {
    //       name: zone.name || zone.id,
    //       itemId: zone.id,
    //       crop: '',
    //       soilType: '',
    //       acre: zoneAcre.toFixed(2),
    //       hectare: zoneHectare.toFixed(2),
    //       boundaries: zoneBoundaries,
    //       boundaries_xy: [[0]],
    //     };
    //   }) || [];

    return {
      name: formData.name || currentParcel?.name || 'Unnamed',
      itemId: formData.id || '',
      crop: '',
      soilType: formData.soilType || '',
      acre: acre.toFixed(2),
      hectare: hectare.toFixed(2),
      effectiveHectare: effectiveHectare.toFixed(2),
      boundaries: boundaries,
      boundaries_xy: [],
      // hasZones: hasZones,
      // zoneType: zoneType,
      // zones: zones,
    };
  }, [currentParcel, drawnFeatures, formData, mapDrawnArea, drawnArea]);

  const handleSaveConfirm = async () => {
    const parcelData = getParcelDataForConsole();
    console.log('Parcel data to save:', JSON.stringify(parcelData, null, 2));

    try {
      await handleSave();

      await queryClient.invalidateQueries({ queryKey: ['farms'] });

      setIsSaveDialogOpen(false);

      resetForm();
    } catch (error) {
      console.error('Error saving parcel:', error);
    }
  };

  const handleSaveDialogClose = () => {
    setIsSaveDialogOpen(false);
  };

  const handleParcelChange = useCallback((parcel: MapParcel | null) => {
    setCurrentParcel(parcel);
  }, []);

  const handleAreaChange = useCallback((area: number) => {
    setMapDrawnArea(area);
  }, []);

  useEffect(() => {
    if (currentParcel) {
      if (currentParcel.name && !formData.name) {
        updateField('name', currentParcel.name);
      }
    }
  }, [currentParcel, formData.name, updateField]);

  useEffect(() => {
    if (farmIdFromUrl) {
      router.replace('/my-farm/create-parcel-zone');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (mapDrawnArea > 0) {
      const areaString = mapDrawnArea.toFixed(2);
      if (!formData.area || formData.area !== areaString) {
        updateField('area', areaString);
      }
    }
  }, [mapDrawnArea, formData.area, updateField]);

  const mapParcels = useMemo<MapParcel[]>(
    () =>
      savedParcels.map((parcel) =>
        convertParcelDataToMapParcel(parcel, zonesHistory)
      ),
    [savedParcels, zonesHistory]
  );

  const allParcels = useMemo<MapParcel[]>(() => {
    const parcelsMap = new Map<string, MapParcel>();

    apiParcels.forEach((parcel) => {
      parcelsMap.set(parcel.id, parcel);
    });

    mapParcels.forEach((parcel) => {
      parcelsMap.set(parcel.id, parcel);
    });

    return Array.from(parcelsMap.values());
  }, [apiParcels, mapParcels]);

  useEffect(() => {
    if (isImageReady && isSatelliteFormOpen) {
      setIsSatelliteFormOpen(false);
      setCanCreateSatellite(false);
    }
  }, [isImageReady, isSatelliteFormOpen]);

  return (
    <div className="flex gap-2 h-full">
      {isFormVisible && (
        <div className="flex-1">
          <div className="flex flex-col h-full bg-white border border-basic-gray-light rounded-xl overflow-y-auto ">
            <div className="p-5 border-b border-basic-gray-light">
              <Breadcrumbs
                items={[
                  { label: 'My farms', href: '/my-farm' },
                  { label: 'Add parcel', href: '#' },
                ]}
              />
            </div>

            <div className="flex-1 p-5 flex flex-col gap-5">
              {!isSatelliteFormOpen && (
                <div className="flex items-center gap-2">
                  <Image
                    src="/draw-polygon-2.svg"
                    alt="Draw polygon"
                    width={28}
                    height={28}
                  />
                  <h1 className="text-[28px] font-semibold text-basic-black">
                    Add parcel
                  </h1>
                </div>
              )}

              {isSatelliteFormOpen ? (
                <>
                  <SatellitePKForm
                    ref={satelliteFormRef}
                    isLoading={isLoadingSatellite}
                    isCreatingImage={isCreatingImage}
                    isImageReady={isImageReady}
                    onCanCreateChange={setCanCreateSatellite}
                  />
                </>
              ) : (
                <>
                  <InfoBanner currentStep={currentStep} />

                  <ParcelForm
                    formData={formData}
                    errors={errors}
                    farmOptions={farmOptions}
                    soilTypeOptions={soilTypeOptions}
                    cropOptions={cropOptions}
                    drawnArea={drawnArea}
                    canCreateParcel={canCreateParcel}
                    updateField={updateField}
                  />

                  <ZonesManagement
                    canCreateZones={canCreateZones}
                    zonesHistory={zonesHistory}
                    onDrawZone={handleDrawZone}
                    onSatelliteZone={() => {
                      setIsSatelliteFormOpen(true);
                      setCanCreateSatellite(false);
                    }}
                    mapRef={mapRefRef}
                    onDeleteHistoryEntry={deleteHistoryEntry}
                    onUpdateHistoryEntryName={updateHistoryEntryName}
                    onUpdateHistoryEntryZones={updateHistoryEntryZones}
                  />
                </>
              )}

              {isSatelliteFormOpen ? (
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="cancel"
                    className="flex-1"
                    onClick={() => {
                      setIsSatelliteFormOpen(false);
                      setCanCreateSatellite(false);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="default"
                    className="flex-1"
                    disabled={!canCreateSatellite || isCreatingImage}
                    onClick={async () => {
                      if (satelliteFormRef.current && handleCreatePKZoning) {
                        const formData = satelliteFormRef.current.getFormData();
                        if (
                          formData.periodStart &&
                          formData.periodEnd &&
                          formData.zonesCount
                        ) {
                          try {
                            await handleCreatePKZoning({
                              periodStart: formData.periodStart,
                              periodEnd: formData.periodEnd,
                              zonesCount: parseInt(formData.zonesCount, 10),
                              vegetationIndex: formData.satellite || 'NDVI',
                            });
                          } catch (error) {
                            console.error('Error creating P&K map:', error);
                          }
                        }
                      }
                    }}
                  >
                    {isCreatingImage ? 'Creating...' : 'Create'}
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 mt-auto">
                  <Button
                    variant="cancel"
                    className="flex-1"
                    onClick={handleCancelClick}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={handleSaveClick}
                    disabled={!isFormValid || drawnFeatures.length === 0}
                  >
                    Save Parcel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* <div className={isFormVisible ? '' : 'w-full'}>
        <CreateParcelZonesMap
          onMapSizeChange={handleMapSizeChange}
          selectedFarm={selectedFarm}
          enableDrawing={enableDrawing}
          drawingMode={drawingMode}
          onDrawingChange={handleDrawingChange}
          onDrawingAreaChange={handleDrawingAreaChange}
          parcels={mapParcels}
          onParcelWithZonesChange={handleParcelWithZonesChange}
          onDeleteLastParcel={deleteLastParcel}
          parcelName={formData.name}
          parcelArea={currentParcelAreaNumber || drawnArea}
          onClearDrawingRef={clearDrawingRef}
          onChangeModeRef={changeModeRef}
          onRestorePolygonRef={restorePolygonRef}
          hasDrawnFeatures={drawnFeatures.length > 0}
          imageUrl={imageUrl}
          savedGeometry={savedGeometry}
          onMapRefRef={mapRefRef}
        />в
      </div> */}

      <DrawingMapContainer
        onParcelChange={handleParcelChange}
        onAreaChange={handleAreaChange}
        onDrawingChange={handleDrawingChange}
        onParcelWithZonesChange={handleParcelWithZonesChange}
        drawnFeatures={drawnFeatures as DrawingFeature[]}
        parcelName={formData.name}
        drawingMode={drawingMode}
        selectedFarm={selectedFarm}
        farmMarkers={farmMarkers}
        apiParcels={allParcels}
        apiZones={apiZones}
        onChangeModeRef={changeModeRef}
        onClearDrawingRef={clearDrawingRef}
        onRestorePolygonRef={restorePolygonRef}
      />

      <ConfirmationDialog
        isOpen={isCancelDialogOpen}
        onClose={handleCancelDialogClose}
        onConfirm={handleCancelConfirm}
        title="Cancel creating parcel?"
        message="Are you sure you want to cancel? All unsaved changes will be lost."
        confirmText="Yes, cancel"
        cancelText="Return to form"
        confirmButtonVariant="danger"
        icon={
          <Icon
            icon="close"
            className="w-9 h-9 flex items-center bg-basic-red-opacity rounded-lg text-basic-red justify-center"
          />
        }
      />

      <ConfirmationDialog
        isOpen={isSaveDialogOpen}
        onClose={handleSaveDialogClose}
        onConfirm={handleSaveConfirm}
        title="Save parcel?"
        message={`Are you sure you want to save the parcel "${formData.name}"? This will create a new parcel in your farm.`}
        confirmText="Yes, save"
        cancelText="Cancel"
        confirmButtonVariant="primary"
        icon={
          <Icon
            icon="check_circle"
            className="w-9 h-9 flex items-center bg-basic-green-light rounded-lg text-basic-green justify-center"
          />
        }
      />
    </div>
  );
}
