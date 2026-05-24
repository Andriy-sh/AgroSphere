'use client';

import { Breadcrumbs, Input, Button, FormField } from '@@agrosphere/shared';
import { CreateFarmMap } from './create-farm-map';
import { CreateFarmMissingDialog } from './create-farm-missing-dialog';
import { useCreateFarmForm } from './hooks/use-create-farm-form';
import { useFarmData } from '@/components/my-farm/hooks/useFarmData';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { transformFarmItemsToMarkers } from './utils/farm-transformers';
import {
  CREATE_FARM_PROGRESS_STEPS,
  calculateCreateFarmProgressStep,
  MAP_SIZE_SMALL,
  MAP_SIZE_FULL,
} from './constants';

export function CreateFarm() {
  const router = useRouter();
  const [isFormVisible, setIsFormVisible] = useState(true);
  const [showMissingLocationDialog, setShowMissingLocationDialog] =
    useState(false);
  const [mapSize, setMapSize] = useState(MAP_SIZE_SMALL);
  const [isProgressBarVisible, setIsProgressBarVisible] = useState(true);

  const { farmItems } = useFarmData();

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    updateLocation,
    submit,
    farmName,
    selectedLocation,
    isSubmitting,
  } = useCreateFarmForm();

  const existingFarmMarkers = useMemo(
    () => transformFarmItemsToMarkers(farmItems),
    [farmItems]
  );

  const currentProgressStep = useMemo(
    () =>
      calculateCreateFarmProgressStep(!!selectedLocation, !!farmName.trim()),
    [selectedLocation, farmName]
  );

  const handleLocationSelect = (coords: {
    latitude: number;
    longitude: number;
    location_xy?: [number, number];
  }) => {
    updateLocation(coords.latitude, coords.longitude, coords.location_xy);
  };

  const handleMapSizeChange = (size: number) => {
    setMapSize(size);
    if (size === MAP_SIZE_FULL) {
      setIsFormVisible(false);
    } else if (size === MAP_SIZE_SMALL) {
      setIsFormVisible(true);
    }
  };

  const handleFormSubmit = async () => {
    if (!selectedLocation) {
      setShowMissingLocationDialog(true);
      return;
    }

    await handleSubmit();
  };

  const handleConfirmSaveWithoutLocation = async () => {
    setShowMissingLocationDialog(false);
    await submit({
      name: farmName,
      farmLocation: null,
    });
  };

  const handleCancelSaveWithoutLocation = () => {
    setShowMissingLocationDialog(false);
  };

  const handleCancel = () => {
    router.push('/my-farm');
  };

  const breadcrumbItems = [
    { label: 'My farms', href: '/my-farm' },
    { label: 'Add new farm' },
  ];

  return (
    <div className="flex gap-2 h-full">
      {isFormVisible && (
        <div className="flex-1">
          <div className="flex flex-col h-full bg-white border border-basic-gray-light rounded-xl">
            <div className="p-5 border-b border-basic-gray-light">
              <Breadcrumbs items={breadcrumbItems} />
            </div>

            <div className="flex-1 p-5 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-5">
                  <span className="material-symbols-outlined text-basic-green text-2xl">
                    home_work
                  </span>
                  <h1 className="text-[28px] font-semibold text-basic-black">
                    Add new farm
                  </h1>
                </div>

                <form onSubmit={handleSubmit}>
                  <FormField
                    label="Farm name"
                    required
                    error={errors.name?.message}
                  >
                    <Input>
                      <Input.Content
                        {...register('name')}
                        placeholder="Enter farm name"
                        className="w-full"
                      />
                    </Input>
                  </FormField>

                  {errors.farmLocation && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-basic-red text-sm">
                        {errors.farmLocation.message || 'Location is required'}
                      </p>
                    </div>
                  )}
                </form>
              </div>

              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="cancel"
                  className="flex-1"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="default"
                  className="flex-1"
                  onClick={handleFormSubmit}
                  disabled={!isValid || isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={isFormVisible ? '' : 'w-full'}>
        <CreateFarmMap
          onLocationSelect={handleLocationSelect}
          selectedLocation={selectedLocation}
          onMapSizeChange={handleMapSizeChange}
          mapSize={mapSize}
          farmMarkers={existingFarmMarkers}
          progressSteps={CREATE_FARM_PROGRESS_STEPS}
          currentProgressStep={currentProgressStep}
          showProgressBar={isProgressBarVisible}
          onProgressBarClose={() => setIsProgressBarVisible(false)}
          isFarmMarker={true}
        />
      </div>

      <CreateFarmMissingDialog
        isOpen={showMissingLocationDialog}
        onClose={handleCancelSaveWithoutLocation}
        onConfirm={handleConfirmSaveWithoutLocation}
        onCancel={handleCancelSaveWithoutLocation}
      />
    </div>
  );
}
