'use client';

import { useMemo } from 'react';
import { CustomSelect } from '@@agrosphere/shared';
import type { SelectOption } from '@@agrosphere/shared';
import type { MapZone } from '@@agrosphere/shared';
import { Step } from '../types/form-types';
import type { NitrogenFertilizationParcelOption } from '../types/form-types';
import { INPUT_LIKE_CLASS_NAME } from '../constants/form-constants';
import { useFormSteps } from '../hooks/use-form-steps';
import { useZonePrescriptions } from '../hooks/use-zone-prescriptions';
import { useApplicationStrategy } from '../hooks/use-application-strategy';
import { useVegetationMap } from '../hooks/use-vegetation-map';
import { exportShapefile } from '../utils/export-shapefile';
import EmptyState from './empty-state';
import ParcelSelector from './parcel-selector';
import ZoneMapSetup from './zone-map-setup';
import ApplicationParameters from './application-parameters';
import RatesDistributionSummary from './rates-distribution-summary';
import FormNavigationButtons from './form-navigation-buttons';

type ParcelItem = {
  id: string;
  name: string;
  area: number;
  geometry?: number[][];
};

type Props = {
  parcels: NitrogenFertilizationParcelOption[];
  parcelItems?: ParcelItem[];
  selectedParcel?: NitrogenFertilizationParcelOption | null;
  eosdaFieldId?: string | null;
  parcelGeometry?: number[][];
  parcelArea?: number;
  imageDateOptions?: SelectOption[];
  imageDateLoading?: boolean;
  onSelectParcelId: (parcelId: string) => void;
  onClearSelection?: () => void;
  zoomToParcelRef?: React.MutableRefObject<((parcelId: string) => void) | null>;
  onVegetationZonesLoaded?: (zones: MapZone[] | null) => void;
  onVegetationMapDataLoaded?: (
    data: { zones: Array<{ [key: string]: unknown }> } | null
  ) => void;
  vegetationMapData?: {
    zones: Array<{ [key: string]: unknown }>;
  } | null;
};

export default function NitrogenFertilizationForm({
  parcels,
  parcelItems,
  selectedParcel,
  eosdaFieldId,
  parcelGeometry,
  parcelArea,
  imageDateOptions,
  imageDateLoading = false,
  onSelectParcelId,
  zoomToParcelRef,
  onClearSelection,
  onVegetationZonesLoaded,
  onVegetationMapDataLoaded,
  vegetationMapData,
}: Props) {
  const {
    step,
    setStep,
    satelliteType,
    setSatelliteType,
    imageDate,
    setImageDate,
    zonesCount,
    setZonesCount,
  } = useFormSteps(selectedParcel, imageDateOptions);

  const { zones, setZones, updateZoneRate } =
    useZonePrescriptions(selectedParcel);

  const {
    applicationStrategy,
    setApplicationStrategy,
    baseRate,
    setBaseRate,
    rateStep,
    setRateStep,
  } = useApplicationStrategy(zones, setZones, step);

  const { isLoadingVegetationMap, generateZones } = useVegetationMap(
    eosdaFieldId,
    selectedParcel,
    zonesCount,
    onVegetationZonesLoaded,
    onVegetationMapDataLoaded
  );

  const parcelOptions: SelectOption[] = useMemo(
    () =>
      parcels.map((parcel) => ({
        value: parcel.id,
        label: parcel.name,
      })),
    [parcels]
  );

  const handleGenerateZones = async () => {
    const generatedZones = await generateZones();
    if (generatedZones && generatedZones.length > 0) {
      setZones(generatedZones);
      setStep(() => Step.ZONES);
      if (zoomToParcelRef?.current && selectedParcel?.id) {
        setTimeout(() => {
          zoomToParcelRef.current?.(selectedParcel.id);
        }, 100);
      }
    }
  };

  const handleSave = () => {
    console.log('SAVE', zones);
  };

  const handleExport = async () => {
    await exportShapefile(
      vegetationMapData as {
        zones: Array<{ [key: string]: { zone_area: number; zone_p: number; fertilizer: number; geometry: { type: 'MultiPolygon'; coordinates: number[][][] | number[][][][]; }; kmean?: number[] } }>;
      } | null,
      selectedParcel?.name,
      selectedParcel?.id,
      zones
    );
  };

  if (!selectedParcel) {
    return (
      <EmptyState
        parcels={
          parcelItems ||
          parcels.map((p) => ({
            id: p.id,
            name: p.name,
            area: 0,
          }))
        }
        onSelectParcel={onSelectParcelId}
        zoomToParcelRef={zoomToParcelRef}
      />
    );
  }

  return (
    <div className="bg-white rounded-md border border-basic-gray-light h-[calc(100vh-1rem)] p-4 flex flex-col">
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
        <ParcelSelector
          options={parcelOptions}
          selectedParcelId={selectedParcel.id}
          onSelectParcel={onSelectParcelId}
          parcelGeometry={parcelGeometry}
          parcelArea={parcelArea}
          parcelName={selectedParcel.name}
        />

        {step === Step.SETUP && (
          <>
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-basic-gray">
                Select parcel
              </div>
              <CustomSelect
                options={parcelOptions}
                value={selectedParcel.id}
                onValueChange={(parcelId) => {
                  onSelectParcelId(parcelId);
                  if (zoomToParcelRef?.current) {
                    setTimeout(() => {
                      zoomToParcelRef.current?.(parcelId);
                    }, 100);
                  }
                }}
                triggerClassName={INPUT_LIKE_CLASS_NAME}
              />
            </div>

            <ZoneMapSetup
              satelliteType={satelliteType}
              onSatelliteTypeChange={setSatelliteType}
              imageDate={imageDate}
              onImageDateChange={setImageDate}
              zonesCount={zonesCount}
              onZonesCountChange={setZonesCount}
              imageDateOptions={imageDateOptions}
              imageDateLoading={imageDateLoading}
            />
          </>
        )}

        {step === Step.ZONES && (
          <>
            <ApplicationParameters
              applicationStrategy={applicationStrategy}
              onApplicationStrategyChange={setApplicationStrategy}
              baseRate={baseRate}
              onBaseRateChange={setBaseRate}
              rateStep={rateStep}
              onRateStepChange={setRateStep}
            />

            <RatesDistributionSummary
              zones={zones}
              baseRate={baseRate}
              applicationStrategy={applicationStrategy}
              onZoneRateChange={updateZoneRate}
            />
          </>
        )}
      </div>

      <FormNavigationButtons
        step={step}
        isLoading={isLoadingVegetationMap}
        isSceneSearchLoading={
          imageDateLoading || !imageDateOptions || imageDateOptions.length === 0
        }
        onBack={() => {
          setStep(Step.SETUP);
        }}
        onBackToParcelList={
          onClearSelection
            ? onClearSelection
            : () => {
                onSelectParcelId('');
              }
        }
        onCalculate={handleGenerateZones}
        onSave={handleSave}
        onExport={handleExport}
      />
    </div>
  );
}
