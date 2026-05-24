'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Breadcrumbs,
  ParcelForm,
  FarmItem,
  ParcelItem,
  SatellitePKForm,
  Button,
  type SatellitePKFormData,
} from '@@agrosphere/shared';
import { ViewParcelNavigation } from './view-parcel-navigation';
import type {
  ViewParcelFormParcelData,
  ViewParcelHistoryEntry,
} from '../types';
import type { ParcelOption } from './parcel-selector';
import {
  loadProductivityMapByFieldId,
  convertProductivityMapToParcelWithZones,
} from '../utils/load-productivity-map';
import { useSaveParcel } from '../hooks/use-save-parcel';
import { useDeleteManagementZone } from '../hooks/use-delete-management-zone';
import { useDeleteZone, FARMS_KEYS } from '@@agrosphere/shared';
import { useFarmData } from '../../my-farm/hooks/useFarmData';
import { useQueryClient } from '@tanstack/react-query';

const soilTypeOptions = [
  { label: 'Mineral', value: 'mineral' },
  { label: 'Peat', value: 'peat' },
];

const cropOptions = [
  { value: 'grassland', label: 'Grassland' },
  { value: 'arable', label: 'Arable' },
  { value: 'other', label: 'Other' },
];

export type { ViewParcelFormParcelData };

interface ViewParcelFormProps {
  parcel: ViewParcelFormParcelData;
  parcels?: ParcelOption[];
  farmItems?: FarmItem[];
  onParcelChange: (
    parcelId: string,
    updates: Partial<{
      farmName: string;
      parcelCode: string;
      parcelName: string;
      effectiveArea: string;
      soilType: string;
      crop: string;
      parcelId?: string;
      history?: ViewParcelHistoryEntry[];
    }>
  ) => void;
  onParcelSelect?: (parcelId: string) => void;
  onFarmSelect?: (farmName: string) => void;
  onParcelSelectFromForm?: (parcelId: string) => void;
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  onDelete?: () => void;
  hasChanges?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  navigationParcels?: Array<{ id: string }>;
  activeIndex?: number;
  zoomToParcelRef?: React.MutableRefObject<((parcelId: string) => void) | null>;
  isDisabled?: boolean;
  onDrawZone?: () => void;
  onSatelliteZone?: () => void;
}

interface FormState {
  farmName: string;
  parcelId: string;
  parcelCode: string;
  parcelName: string;
  effectiveArea: string;
  soilType: string;
  crop: string;
}

export function ViewParcelForm({
  parcel,
  parcels = [],
  farmItems = [],
  onParcelChange,
  onParcelSelect,
  onFarmSelect,
  onParcelSelectFromForm,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  onDelete,
  hasChanges = false,
  onSave,
  onCancel,
  navigationParcels = [],
  activeIndex = 0,
  zoomToParcelRef,
  isDisabled = false,
  onDrawZone,
  onSatelliteZone,
}: ViewParcelFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isSatelliteFormOpen, setIsSatelliteFormOpen] = useState(false);
  const [canCreateSatellite, setCanCreateSatellite] = useState(false);
  const [isLoadingProductivityMap, setIsLoadingProductivityMap] =
    useState(false);
  const satelliteFormRef = useRef<{
    getFormData: () => SatellitePKFormData;
  } | null>(null);

  const { mutate: saveParcel, isPending: isSaving } = useSaveParcel();
  const { mutate: deleteManagementZone, isPending: isDeleting } =
    useDeleteManagementZone();
  const { mutateAsync: deleteZoneAsync, isPending: isDeletingZone } = useDeleteZone();
  const { refresh } = useFarmData();
  const queryClient = useQueryClient();
  
  const [zonesToDelete, setZonesToDelete] = useState<Array<{
    farmId: string;
    parcelId: string;
    zoneId: string;
    entryId: string;
  }>>([]);

  const [formState, setFormState] = useState<FormState>(() => ({
    farmName: parcel.farmName,
    parcelId: parcel.id,
    parcelCode: parcel.parcelCode,
    parcelName: parcel.parcelName,
    effectiveArea: parcel.effectiveArea,
    soilType: parcel.soilType,
    crop: parcel.crop || 'not_set',
  }));

  useEffect(() => {
    setFormState({
      farmName: parcel.farmName,
      parcelId: parcel.id,
      parcelCode: parcel.parcelCode,
      parcelName: parcel.parcelName,
      effectiveArea: parcel.effectiveArea,
      soilType: parcel.soilType,
      crop: parcel.crop || 'not_set',
    });
    setZonesToDelete([]);
  }, [parcel.id]);

  const managementHistory = useMemo(() => parcel.history, [parcel.history]);

  const farmOptions = useMemo(() => {
    const farmMap = new Map<string, { label: string; value: string }>();

    farmItems.forEach((farm) => {
      if (!farmMap.has(farm.name)) {
        farmMap.set(farm.name, { label: farm.name, value: farm.name });
      }
    });

    if (parcel.farmName && !farmMap.has(parcel.farmName)) {
      farmMap.set(parcel.farmName, {
        label: parcel.farmName,
        value: parcel.farmName,
      });
    }

    return Array.from(farmMap.values());
  }, [farmItems, parcel.farmName]);

  const parcelOptions = useMemo(() => {
    if (!formState.farmName) {
      return [];
    }

    const selectedFarm = farmItems.find(
      (farm) => farm.name === formState.farmName
    );
    if (!selectedFarm || !selectedFarm.children) {
      return [];
    }

    const options: Array<{ label: string; value: string }> = [];

    selectedFarm.children.forEach((child) => {
      if ('type' in child && child.type !== 'group') {
        const parcelItem = child as ParcelItem & { item_id?: string | number };
        const itemId = parcelItem.item_id
          ? String(parcelItem.item_id)
          : parcelItem.id;
        options.push({
          label: `${itemId} ${parcelItem.name}`,
          value: parcelItem.id,
        });
      }
    });

    return options;
  }, [farmItems, formState.farmName]);

  const soilTypeLabel = useMemo(() => {
    const match = soilTypeOptions.find(
      (option) => option.value === formState.soilType
    );
    return match ? match.label : formState.soilType;
  }, [formState.soilType]);

  const handleFieldChange = <K extends keyof FormState>(
    field: K,
    value: FormState[K]
  ) => {
    setFormState((prev) => {
      const next = { ...prev, [field]: value };

      onParcelChange(parcel.id, { [field]: value } as Partial<FormState>);
      return next;
    });

    if (field === 'farmName' && onFarmSelect) {
      onFarmSelect(value as string);
    }
  };

  const handleParcelSelect = (parcelId: string) => {
    setFormState((prev) => ({ ...prev, parcelId }));
    onParcelChange(parcel.id, { parcelId });

    if (onParcelSelectFromForm) {
      onParcelSelectFromForm(parcelId);
    }
  };

  const handleSatelliteZoneClick = () => {
    setIsSatelliteFormOpen(true);
    setCanCreateSatellite(false);
    if (onSatelliteZone) {
      onSatelliteZone();
    }
  };

  useEffect(() => {
    const openSatelliteForm = searchParams?.get('openSatelliteForm');
    if (openSatelliteForm === 'true' && parcel.id && !isSatelliteFormOpen) {
      setIsSatelliteFormOpen(true);
      setCanCreateSatellite(false);
      if (onSatelliteZone) {
        onSatelliteZone();
      }

      const newSearchParams = new URLSearchParams(
        searchParams?.toString() || ''
      );
      newSearchParams.delete('openSatelliteForm');
      const newUrl = newSearchParams.toString()
        ? `${window.location.pathname}?${newSearchParams.toString()}`
        : window.location.pathname;
      router.replace(newUrl);
    }
  }, [parcel.id, searchParams, isSatelliteFormOpen, router, onSatelliteZone]);

  const handleSatelliteCancel = () => {
    setIsSatelliteFormOpen(false);
    setCanCreateSatellite(false);
  };

  const handleSaveClick = async () => {
    if (!parcel || isDisabled || isSaving) {
      return;
    }

    const farm = farmItems.find((f) => f.name === parcel.farmName);
    if (!farm) {
      console.error('Farm not found for parcel:', parcel.farmName);
      return;
    }

    try {
      if (zonesToDelete.length > 0) {
        const deletePromises = zonesToDelete.map((zone) =>
          deleteZoneAsync({
            farmId: zone.farmId,
            parcelId: zone.parcelId,
            zoneId: zone.zoneId,
          })
        );

        await Promise.all(deletePromises);
        
        setZonesToDelete([]);
        
        queryClient.invalidateQueries({ queryKey: FARMS_KEYS.lists() });
        queryClient.invalidateQueries({
          queryKey: FARMS_KEYS.details(farm.id),
        });
        
        await refresh();
      }

      if (onSave) {
        onSave();
      } else {
        saveParcel(
          {
            farmId: farm.id,
            parcelId: parcel.id,
            parcel: parcel,
          },
          {
            onSuccess: () => {
              refresh();
            },
            onError: (error) => {
              console.error('Failed to save parcel:', error);
            },
          }
        );
      }
    } catch (error) {
      console.error('Failed to delete zones:', error);
    }
  };

  const handleDeleteManagementZone = (entryId: string) => {
    if (!parcel || isDisabled) {
      return;
    }

    const farm = farmItems.find((f) => f.name === parcel.farmName);
    if (!farm) {
      console.error('Farm not found for parcel:', parcel.farmName);
      return;
    }

    const historyEntry = parcel.history.find((entry) => entry.id === entryId);
    if (!historyEntry) {
      console.error('History entry not found:', entryId);
      return;
    }

    const isSampleZonesEntry = entryId.startsWith('sample-zones-');

    if (isSampleZonesEntry && historyEntry.parcelWithZones.zones.length > 0) {
      const zonesToDeleteForEntry = historyEntry.parcelWithZones.zones.map((zone) => ({
        farmId: farm.id,
        parcelId: parcel.id,
        zoneId: zone.zoneId,
        entryId: entryId,
      }));
      
      setZonesToDelete((prev) => [...prev, ...zonesToDeleteForEntry]);
    }

    const updatedHistory = parcel.history.filter(
      (entry) => entry.id !== entryId
    );
    onParcelChange(parcel.id, { history: updatedHistory });
  };

  const handleSatelliteCreate = async () => {
    if (satelliteFormRef.current && canCreateSatellite) {
      const formData = satelliteFormRef.current.getFormData();

      setIsLoadingProductivityMap(true);

      try {
        const productivityMapData = await loadProductivityMapByFieldId(
          parcel.eosdaFieldId ?? null
        );

        if (!productivityMapData) {
          console.warn(
            `Productivity map not found for parcel ${parcel.id} with eosdaFieldId ${parcel.eosdaFieldId}`
          );
          setIsSatelliteFormOpen(false);
          setCanCreateSatellite(false);
          setIsLoadingProductivityMap(false);
          return;
        }

        const zonesCount = parseInt(formData.zonesCount, 10);
        const parcelWithZones = convertProductivityMapToParcelWithZones(
          productivityMapData,
          parcel.id,
          parcel.geometry,
          zonesCount
        );

        const newHistoryEntry: ViewParcelHistoryEntry = {
          id: `satellite-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          createdAt: new Date(),
          zonesCount: zonesCount,
          method: 'Satellite P&K',
          parcelWithZones: parcelWithZones,
        };

        const updatedHistory = [...parcel.history, newHistoryEntry];
        const updatedParcel = { ...parcel, history: updatedHistory };
        onParcelChange(parcel.id, { history: updatedHistory });

        const farm = farmItems.find((f) => f.name === parcel.farmName);
        if (farm) {
          saveParcel(
            {
              farmId: farm.id,
              parcelId: parcel.id,
              parcel: updatedParcel,
            },
            {
              onSuccess: () => {
                console.log('Satellite zone saved to JSON successfully');
              },
              onError: (error) => {
                console.error('Error saving satellite zone to JSON:', error);
              },
            }
          );
        }

        setIsSatelliteFormOpen(false);
        setCanCreateSatellite(false);
      } catch (error) {
        console.error('Error creating satellite zone:', error);
      } finally {
        setIsLoadingProductivityMap(false);
      }
    }
  };

  return (
    <div className="flex w-full flex-1 flex-col overflow-y-auto">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-basic-gray-light bg-white">
        <div className="border-b border-basic-gray-light p-5">
          <Breadcrumbs
            items={[
              { label: 'My farms', href: '/my-farm' },
              { label: 'View parcel', href: '#' },
            ]}
          />
        </div>

        <div className="flex flex-col gap-5 p-5">
          <ViewParcelNavigation
            geometry={parcel.geometry}
            farmName={formState.farmName}
            parcelCode={formState.parcelCode}
            parcelName={formState.parcelName}
            areaLabel={parcel.areaLabel}
            effectiveAreaLabel={
              formState.effectiveArea ? `${formState.effectiveArea} ha` : '—'
            }
            soilTypeLabel={soilTypeLabel}
            parcels={parcels}
            activeParcelId={parcel.id}
            onParcelSelect={onParcelSelect}
            onPrev={onPrev}
            onNext={onNext}
            onDelete={onDelete}
            disablePrev={disablePrev}
            disableNext={disableNext}
            navigationParcels={navigationParcels}
            activeIndex={activeIndex}
            zoomToParcelRef={zoomToParcelRef}
            disabled={isDisabled}
          />
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-5">
          {isSatelliteFormOpen ? (
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <SatellitePKForm
                  ref={satelliteFormRef}
                  isLoading={isLoadingProductivityMap}
                  isCreatingImage={isLoadingProductivityMap}
                  isImageReady={false}
                  onCanCreateChange={setCanCreateSatellite}
                />
              </div>
              <div className="flex gap-2 mt-auto pt-5">
                <Button
                  variant="cancel"
                  className="flex-1"
                  onClick={handleSatelliteCancel}
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="flex-1"
                  disabled={!canCreateSatellite}
                  onClick={handleSatelliteCreate}
                >
                  Create
                </Button>
              </div>
            </div>
          ) : (
            <ParcelForm
              farmField={{
                label: 'Farm',
                options: farmOptions,
                value: formState.farmName,
                disabled: isDisabled,
                onChange: (value) =>
                  handleFieldChange('farmName', value ?? formState.farmName),
              }}
              parcelField={{
                label: 'Parcel',
                options: parcelOptions,
                value: formState.parcelId,
                disabled: isDisabled || !formState.farmName,
                onChange: (value) => handleParcelSelect(value ?? ''),
              }}
              nameField={{
                label: 'Name',
                value: formState.parcelName,
                required: true,
                disabled: isDisabled,
                readOnly: isDisabled,
                onChange: (value) =>
                  handleFieldChange(
                    'parcelName',
                    value ?? formState.parcelName
                  ),
              }}
              idField={{
                label: 'ID',
                value: formState.parcelCode,
                helperText: 'max 4 characters',
                disabled: isDisabled,
                readOnly: isDisabled,
                onChange: (value) =>
                  handleFieldChange(
                    'parcelCode',
                    value ?? formState.parcelCode
                  ),
              }}
              areaField={{
                label: 'Area',
                value: parcel.areaLabel,
                suffix: 'ha',
                disabled: true,
                readOnly: true,
                autoCalculated: true,
              }}
              effectiveAreaField={{
                label: 'Effective area',
                value: formState.effectiveArea,
                suffix: 'ha',
                disabled: isDisabled,
                readOnly: isDisabled,
                onChange: (value) =>
                  handleFieldChange(
                    'effectiveArea',
                    value ?? formState.effectiveArea
                  ),
              }}
              soilTypeField={{
                label: 'Soil type',
                options: soilTypeOptions,
                value: formState.soilType,
                disabled: isDisabled,
                onChange: (value) =>
                  handleFieldChange('soilType', value ?? formState.soilType),
              }}
              cropField={{
                label: 'Crop',
                options: cropOptions,
                value:
                  formState.crop && formState.crop !== 'not_set'
                    ? formState.crop
                    : '',
                disabled: isDisabled,
                onChange: (value) =>
                  handleFieldChange('crop', value || 'not_set'),
              }}
              managementZones={{
                title: 'Management zones',
                history: managementHistory,
                canCreateZones: !isDisabled && parcel.geometry.length > 0,
                addButtonDisabled: isDisabled || parcel.geometry.length === 0,
                sectionDisabled: isDisabled,
                disabledMessage: isDisabled
                  ? 'No parcel selected'
                  : parcel.geometry.length === 0
                  ? 'Draw parcel first'
                  : undefined,
                onDrawZone: onDrawZone,
                onSatelliteZone: handleSatelliteZoneClick,
                onDeleteHistoryEntry: handleDeleteManagementZone,
                emptyState: {
                  icon: 'info',
                  title: 'Add zones to your parcel',
                  description:
                    'You can create management zones to better organize your fields. Click "Plus" to get started.',
                },
              }}
              actions={{
                cancelText: 'Cancel',
                cancelDisabled: isDisabled || !hasChanges,
                showSaveButton: true,
                saveText: isSaving ? 'Saving...' : 'Save',
                saveDisabled: isDisabled || !hasChanges || isSaving,
                onCancel: isDisabled
                  ? undefined
                  : () => {
                      // Clear zones to delete when canceling
                      setZonesToDelete([]);
                      onCancel?.();
                    },
                onSave: isDisabled ? undefined : handleSaveClick,
              }}
              parcelFieldsDisabled={isDisabled}
            />
          )}
        </div>
      </div>
    </div>
  );
}
