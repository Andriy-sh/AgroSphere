'use client';

import { Button, Breadcrumbs, Icon, SatellitePKForm } from '@@agrosphere/shared';
import type { SatellitePKFormData } from '@@agrosphere/shared';
import Image from 'next/image';
import { InfoBanner } from './components/info-banner';
import { ParcelForm } from './components/parcel-form';
import { ZonesManagement } from './components/zones-management';
import type { FormStep } from './types';
import mapboxgl from 'mapbox-gl';

interface CreateParcelFormProps {
  isSatelliteFormOpen: boolean;
  setIsSatelliteFormOpen: (open: boolean) => void;
  canCreateSatellite: boolean;
  setCanCreateSatellite: (can: boolean) => void;
  satelliteFormRef: React.MutableRefObject<{
    getFormData: () => SatellitePKFormData;
  } | null>;
  isLoadingSatellite: boolean;
  isCreatingImage: boolean;
  isImageReady: boolean;
  currentStep: FormStep;
  formData: any;
  errors: any;
  farmOptions: any[];
  soilTypeOptions: any[];
  cropOptions: any[];
  drawnArea: number;
  canCreateParcel: boolean;
  updateField: (field: string, value: string) => void;
  canCreateZones: boolean;
  zonesHistory: any[];
  handleDrawZone: () => void;
  handleCreatePKZoning?: (data: any) => Promise<void>;
  mapRefRef: React.MutableRefObject<React.MutableRefObject<mapboxgl.Map | null> | null>;
  deleteHistoryEntry: (id: string) => void;
  updateHistoryEntryName: (id: string, name: string) => void;
  updateHistoryEntryZones: (id: string, zones: any) => void;
  handleCancelClick: () => void;
  handleSaveClick: () => void;
  isFormValid: boolean;
  drawnFeatures: unknown[];
}

export function CreateParcelForm({
  isSatelliteFormOpen,
  setIsSatelliteFormOpen,
  canCreateSatellite,
  setCanCreateSatellite,
  satelliteFormRef,
  isLoadingSatellite,
  isCreatingImage,
  isImageReady,
  currentStep,
  formData,
  errors,
  farmOptions,
  soilTypeOptions,
  cropOptions,
  drawnArea,
  canCreateParcel,
  updateField,
  canCreateZones,
  zonesHistory,
  handleDrawZone,
  handleCreatePKZoning,
  mapRefRef,
  deleteHistoryEntry,
  updateHistoryEntryName,
  updateHistoryEntryZones,
  handleCancelClick,
  handleSaveClick,
  isFormValid,
  drawnFeatures,
}: CreateParcelFormProps) {
  return (
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
            canCreateParcel && (
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
            )
          )}
        </div>
      </div>
    </div>
  );
}
