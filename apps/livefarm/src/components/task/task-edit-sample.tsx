'use client';

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import type { Map as MapboxMap } from 'mapbox-gl';

import { Button, Dialog, Input, Label } from '@@agrosphere/shared';
import {
  CustomSelect,
  Map,
  FarmsLayer,
  ZonesLayer,
  SamplePathsLayer,
} from '@@agrosphere/shared';

interface SelectOption {
  value: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  isAssigned?: boolean;
  className?: string;
}
import { getSamplePathsByTaskId, getSamplesByTaskId } from '@@agrosphere/shared';
import type { FarmMarker, MapZone, Sample } from '@@agrosphere/shared';

const mockFarms: FarmMarker[] = [
  {
    id: 'farm-1',
    longitude: -8.225,
    latitude: 53.415,
    title: 'Smith Family Farm',
    name: 'Smith Family Farm',
    client_name: 'John Smith',
    address: '123 Farm Road, Rural County, ST 12345',
    size: 42.7,
    crop_type: 'Mixed Crops',
    last_visit: '',
    status: 'active',
    color: '#29b54c',
    clientId: 'client-1',
    visible: true,
  },
  {
    id: 'farm-2',
    longitude: -8.36,
    latitude: 53.51,
    title: 'Sunset Meadows',
    name: 'Sunset Meadows',
    client_name: 'Jane Doe',
    address: '456 Meadow Lane, Rural County, ST 12346',
    size: 38.5,
    crop_type: 'Mixed Crops',
    last_visit: '',
    status: 'active',
    color: '#29b54c',
    clientId: 'client-2',
    visible: true,
  },
];

const mockZones: MapZone[] = [
  {
    id: 'zone-1',
    name: 'Zone 1',
    cropType: 'Wheat',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 1',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 12.5,
    coordinates: [
      [
        [
          [-8.23, 53.42],
          [-8.22, 53.42],
          [-8.22, 53.41],
          [-8.23, 53.41],
          [-8.23, 53.42],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-2',
    name: 'Zone 2',
    cropType: 'Corn',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 1',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 15.2,
    coordinates: [
      [
        [
          [-8.22, 53.42],
          [-8.21, 53.42],
          [-8.21, 53.41],
          [-8.22, 53.41],
          [-8.22, 53.42],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-3',
    name: 'Zone 3',
    cropType: 'Barley',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 1',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 14.0,
    coordinates: [
      [
        [
          [-8.21, 53.42],
          [-8.2, 53.42],
          [-8.2, 53.41],
          [-8.21, 53.41],
          [-8.21, 53.42],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-4',
    name: 'Zone 1',
    cropType: 'Oats',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 2',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 12.0,
    coordinates: [
      [
        [
          [-8.23, 53.41],
          [-8.22, 53.41],
          [-8.22, 53.4],
          [-8.23, 53.4],
          [-8.23, 53.41],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-5',
    name: 'Zone 2',
    cropType: 'Rye',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 2',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 13.5,
    coordinates: [
      [
        [
          [-8.22, 53.41],
          [-8.21, 53.41],
          [-8.21, 53.4],
          [-8.22, 53.4],
          [-8.22, 53.41],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-6',
    name: 'Zone 3',
    cropType: 'Triticale',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 2',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 13.0,
    coordinates: [
      [
        [
          [-8.21, 53.41],
          [-8.2, 53.41],
          [-8.2, 53.4],
          [-8.21, 53.4],
          [-8.21, 53.41],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-7',
    name: 'Zone 1',
    cropType: 'Wheat',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 3',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 11.5,
    coordinates: [
      [
        [
          [-8.23, 53.4],
          [-8.22, 53.4],
          [-8.22, 53.39],
          [-8.23, 53.39],
          [-8.23, 53.4],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-8',
    name: 'Zone 2',
    cropType: 'Corn',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 3',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 12.0,
    coordinates: [
      [
        [
          [-8.22, 53.4],
          [-8.21, 53.4],
          [-8.21, 53.39],
          [-8.22, 53.39],
          [-8.22, 53.4],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-9',
    name: 'Zone 3',
    cropType: 'Barley',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Parcel 3',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 10.5,
    coordinates: [
      [
        [
          [-8.21, 53.4],
          [-8.2, 53.4],
          [-8.2, 53.39],
          [-8.21, 53.39],
          [-8.21, 53.4],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-10',
    name: 'Zone A1',
    cropType: 'Wheat',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Wheat Field A',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 12.5,
    coordinates: [
      [
        [
          [-8.225, 53.415],
          [-8.205, 53.415],
          [-8.205, 53.405],
          [-8.225, 53.405],
          [-8.225, 53.415],
        ],
      ],
    ],
    zIndex: 5,
  },
  {
    id: 'zone-11',
    name: 'Zone A2',
    cropType: 'Wheat',
    clientId: 'client-1',
    farmId: 'farm-1',
    farmName: 'Smith Family Farm',
    parcelName: 'Wheat Field A',
    fillColor: '#FFFFFF12',
    borderColor: '#FFFFFF',
    fillOpacity: 0.1,
    borderWidth: 1,
    visible: true,
    area: 12.5,
    coordinates: [
      [
        [
          [-8.195, 53.41],
          [-8.19, 53.412],
          [-8.185, 53.413],
          [-8.18, 53.413],
          [-8.175, 53.412],
          [-8.17, 53.41],
          [-8.17, 53.408],
          [-8.175, 53.406],
          [-8.18, 53.405],
          [-8.185, 53.405],
          [-8.19, 53.406],
          [-8.195, 53.408],
          [-8.195, 53.41],
        ],
      ],
    ],
    zIndex: 5,
  },
];

interface SearchResult {
  place_name: string;
  center: [number, number];
  bbox?: [number, number, number, number];
}

interface TaskEditSampleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TaskSampleData) => void;
  sampleData: TaskSampleData;
  geoCoords?: { latitude: string; longitude: string } | null;
  taskId?: string;
  farms?: FarmMarker[];
  zones?: MapZone[];
  existingSamples?: Sample[];
}

export interface TaskSampleData {
  sampleId: string;
  testType: string;
  farm: string;
  parcel: string;
  zone: string;
  lpisId: string;
  latitude: string;
  longitude: string;
}

const testTypeOptions: SelectOption[] = [
  { value: 'pH, P, K, Trace', label: 'pH, P, K, Trace' },
  { value: 'pH, P, K', label: 'pH, P, K' },
  { value: 'pH, P, K, OM', label: 'pH, P, K, OM' },
  { value: 'pH only', label: 'pH only' },
  { value: 'P, K', label: 'P, K' },
  { value: 'Trace elements', label: 'Trace elements' },
];

const farmOptions: SelectOption[] = [
  { value: '', label: '--Select farm--', placeholder: 'Select farm' },
  { value: 'Smith Family Farm', label: 'Smith Family Farm' },
];

const getParcelOptions = (
  selectedFarm: string,
  zones: MapZone[] = mockZones
): SelectOption[] => {
  const options = [
    { value: '', label: '--Select parcel--', placeholder: 'Select parcel' },
  ];

  if (!selectedFarm) return options;

  const parcels = new Set<string>();
  zones.forEach((zone) => {
    if (zone.farmName === selectedFarm && zone.parcelName) {
      parcels.add(zone.parcelName);
    }
  });

  const parcelOptions = Array.from(parcels).map((parcel) => ({
    value: parcel,
    label: parcel,
  }));

  return [...options, ...parcelOptions];
};

const getZoneOptions = (
  selectedFarm: string,
  selectedParcel: string,
  existingSamples: Sample[] = [],
  currentSampleId?: string,
  zones: MapZone[] = mockZones
): SelectOption[] => {
  const options = [
    { value: '', label: '--Select zone--', placeholder: 'Select zone' },
  ];

  if (!selectedFarm || !selectedParcel) return options;

  const zoneNames = new Set<string>();
  zones.forEach((zone) => {
    if (zone.farmName === selectedFarm && zone.parcelName === selectedParcel) {
      zoneNames.add(zone.name);
    }
  });

  const zoneOptions = Array.from(zoneNames).map((zone) => {
    const isAssigned = existingSamples.some(
      (sample) =>
        sample.farm === selectedFarm &&
        sample.parcel === selectedParcel &&
        sample.zone === zone &&
        sample.sampleId !== currentSampleId
    );

    return {
      value: zone,
      label: zone,
      disabled: isAssigned,
      isAssigned,
      className: isAssigned ? 'cursor-disabled' : '',
    };
  });

  const sortedZoneOptions = zoneOptions.sort((a, b) => {
    if (a.isAssigned && !b.isAssigned) return 1;
    if (!a.isAssigned && b.isAssigned) return -1;
    return a.label.localeCompare(b.label);
  });

  return [...options, ...sortedZoneOptions];
};

const lpisIdOptions: SelectOption[] = [
  { value: '081234567', label: '081234567' },
  { value: '081234568', label: '081234568' },
  { value: '081234569', label: '081234569' },
  { value: '081234570', label: '081234570' },
  { value: '081234571', label: '081234571' },
];

export function TaskEditSample({
  isOpen,
  onClose,
  onSave,
  sampleData,
  geoCoords,
  taskId,
  farms: externalFarms,
  zones: externalZones,
  existingSamples: externalExistingSamples,
}: TaskEditSampleProps) {
  const [formData, setFormData] = useState<TaskSampleData>(sampleData);
  const [showMap, setShowMap] = useState(false);

  const samplePaths = useMemo(() => {
    if (taskId) {
      return getSamplePathsByTaskId(taskId);
    }
    return [];
  }, [taskId]);

  const existingSamples = useMemo(() => {
    if (externalExistingSamples) {
      return externalExistingSamples;
    }
    if (taskId) {
      return getSamplesByTaskId(taskId);
    }
    return [];
  }, [externalExistingSamples, taskId]);

  const farms = useMemo(() => {
    const farmsToUse = externalFarms || mockFarms;
    if (formData.farm) {
      return farmsToUse.filter((farm) => farm.name === formData.farm);
    }
    return farmsToUse;
  }, [externalFarms, formData.farm]);

  const zones = useMemo(() => {
    const zonesToUse = externalZones || mockZones;
    return zonesToUse
      .filter((zone) => {
        if (formData.farm && formData.parcel) {
          return (
            zone.farmName === formData.farm &&
            zone.parcelName === formData.parcel
          );
        }
        return false;
      })
      .map((zone) => {
        const isSelected =
          formData.farm === zone.farmName &&
          formData.parcel === zone.parcelName &&
          formData.zone === zone.name;

        return {
          ...zone,
          fillColor: isSelected ? '#29b54c' : '#FFFFFF12',
          borderColor: isSelected ? '#29b54c' : '#FFFFFF',
          fillOpacity: isSelected ? 0.3 : 0.1,
          borderWidth: isSelected ? 2 : 1,
          zIndex: isSelected ? 10 : 5,
        };
      });
  }, [externalZones, formData.farm, formData.parcel, formData.zone]);

  const filteredSamplePaths = useMemo(() => {
    if (!formData.farm || !formData.parcel || !formData.zone) {
      return [];
    }

    return samplePaths.filter((path) => {
      const farmMatch = path.farm === formData.farm;

      if (path.zoneId) {
        const zoneBelongsToParcelAndMatches = mockZones.some(
          (zone) =>
            zone.farmName === formData.farm &&
            zone.parcelName === formData.parcel &&
            zone.name === formData.zone &&
            zone.id === path.zoneId
        );
        return farmMatch && zoneBelongsToParcelAndMatches;
      }

      return farmMatch;
    });
  }, [samplePaths, formData.farm, formData.parcel, formData.zone]);

  const handleFarmChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      farm: value,
      parcel: '',
      zone: '',
    }));
  };

  const handleParcelChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      parcel: value,
      zone: '',
    }));
  };

  useEffect(() => {
    if (formData.farm && formData.parcel && formData.zone) {
      const zoneOptions = getZoneOptions(
        formData.farm,
        formData.parcel,
        existingSamples,
        formData.sampleId,
        externalZones || mockZones
      );

      const currentZoneOption = zoneOptions.find(
        (option) => option.value === formData.zone
      );

      if (currentZoneOption && currentZoneOption.disabled) {
        setFormData((prev) => ({
          ...prev,
          zone: '',
        }));
      }
    }
  }, [
    formData.farm,
    formData.parcel,
    formData.zone,
    existingSamples,
    formData.sampleId,
    externalZones,
  ]);
  const mapRef = useRef<MapboxMap>(null);
  const clearMarkerRef = useRef<(() => void) | null>(null);
  const setMarkerRef = useRef<
    ((lat: number, lng: number, color?: string) => void) | null
  >(null);
  const resetAutoGeolocateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setFormData({
      ...sampleData,
      farm: sampleData.farm || '',
      parcel: sampleData.parcel || '',
      zone: sampleData.zone || '',
    });
  }, [sampleData]);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...sampleData,
        farm: sampleData.farm || '',
        parcel: sampleData.parcel || '',
        zone: sampleData.zone || '',
      });
    }
  }, [isOpen, sampleData]);

  useEffect(() => {
    if (setMarkerRef.current && formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarkerRef.current(lat, lng);
      }
    }
  }, [formData.latitude, formData.longitude]);

  const handleSave = () => {
    if (formData.farm && formData.parcel && formData.zone) {
      getZoneOptions(
        formData.farm,
        formData.parcel,
        existingSamples,
        formData.sampleId,
        externalZones || mockZones
      );
    }

    onSave(formData);
    onClose();
  };

  const handleClose = () => {
    if (clearMarkerRef.current) {
      clearMarkerRef.current();
    }
    if (resetAutoGeolocateRef.current) {
      resetAutoGeolocateRef.current();
    }
    onClose();
  };

  const handleMapPickerClick = () => {
    setShowMap(!showMap);
    if (!showMap && geoCoords) {
      setFormData((prev) => ({
        ...prev,
        latitude: geoCoords.latitude,
        longitude: geoCoords.longitude,
      }));
    }
  };

  useEffect(() => {
    if (!isOpen && clearMarkerRef.current) {
      clearMarkerRef.current();
    }
  }, [isOpen]);

  const handleSearchResult = useCallback((result: SearchResult) => {
    if (result.center) {
      const [lng, lat] = result.center;
      setFormData((prev) => ({
        ...prev,
        latitude: lat.toFixed(6),
        longitude: lng.toFixed(6),
      }));
    }
  }, []);

  const handleGeolocate = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      setFormData((prev) => ({
        ...prev,
        latitude: coords.latitude.toFixed(6),
        longitude: coords.longitude.toFixed(6),
      }));
    },
    []
  );

  const handleMapClick = useCallback(
    (coords: { latitude: number; longitude: number }) => {
      setFormData((prev) => ({
        ...prev,
        latitude: coords.latitude.toFixed(6),
        longitude: coords.longitude.toFixed(6),
      }));
    },
    []
  );

  const handleZoneClick = useCallback((zone: MapZone) => {
    setFormData((prev) => ({
      ...prev,
      farm: zone.farmName || '',
      parcel: zone.parcelName || '',
      zone: zone.name || '',
    }));
  }, []);

  const handleFarmClick = useCallback((farm: FarmMarker) => {
    setFormData((prev) => ({
      ...prev,
      farm: farm.name || '',
      zone: '',
    }));
  }, []);

  const getInitialCenter = (): [number, number] => {
    if (formData.latitude && formData.longitude) {
      return [parseFloat(formData.longitude), parseFloat(formData.latitude)];
    }

    if (formData.farm) {
      const selectedFarm = farms.find((farm) => farm.name === formData.farm);
      if (selectedFarm) {
        return [selectedFarm.longitude, selectedFarm.latitude];
      }
    }

    return [-8.225, 53.415];
  };

  const dialogTitle = (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-basic-green text-xl">
        science
      </span>
      <span className="text-xl">
        Edit sample:{' '}
        <span className="text-basic-green">{sampleData.sampleId}</span>
      </span>
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleClose}
      title={dialogTitle}
      className="sm:max-w-xl"
    >
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Sample ID</Label>
          <Input
            type="text"
            value={formData.sampleId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, sampleId: e.target.value })
            }
            className="w-full px-3 py-2 rounded-md bg-white text-basic-black border border-basic-white text-sm"
            placeholder="Enter sample ID"
          />
        </div>

        <div className="space-y-2">
          <Label>Test type</Label>
          <CustomSelect
            options={testTypeOptions}
            value={formData.testType}
            onValueChange={(value) =>
              setFormData({ ...formData, testType: value })
            }
            className="w-full"
            triggerClassName="w-full px-3 py-2  rounded-md bg-white text-basic-black "
          />
        </div>

        <div className="space-y-2">
          <Label>Farm</Label>
          <CustomSelect
            options={farmOptions}
            value={formData.farm}
            onValueChange={handleFarmChange}
            className="w-full"
            triggerClassName="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Label>Parcel</Label>
              <CustomSelect
                options={getParcelOptions(
                  formData.farm,
                  externalZones || mockZones
                )}
                value={formData.parcel}
                onValueChange={handleParcelChange}
                className="w-full"
                triggerClassName={`w-full  ${
                  !formData.farm ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!formData.farm}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label>Zone</Label>
              <CustomSelect
                options={getZoneOptions(
                  formData.farm,
                  formData.parcel,
                  existingSamples,
                  formData.sampleId,
                  externalZones || mockZones
                )}
                value={formData.zone}
                onValueChange={(value) =>
                  setFormData({ ...formData, zone: value })
                }
                className="w-full"
                triggerClassName={`w-full ${
                  !formData.parcel ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={!formData.parcel}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label>LPIS ID</Label>
          <CustomSelect
            options={lpisIdOptions}
            value={formData.lpisId}
            onValueChange={(value) =>
              setFormData({ ...formData, lpisId: value })
            }
            className="w-full"
            triggerClassName="w-full px-3 py-2 rounded-md bg-white text-basic-black focus:border-green-500 focus:ring-green-500"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Reference Co-ordinate</Label>
            <button
              type="button"
              onClick={handleMapPickerClick}
              className="text-basic-green text-sm hover:underline cursor-pointer"
            >
              Use map picker
            </button>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 space-y-1">
              <Input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, latitude: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-white text-basic-black border border-basic-white text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                placeholder="Latitude"
              />
            </div>
            <div className="flex-1 space-y-1">
              <Input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, longitude: e.target.value })
                }
                className="w-full px-3 py-2 rounded-md bg-white text-basic-black border border-basic-white text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                placeholder="Longitude"
              />
            </div>
          </div>
        </div>

        {showMap && (
          <div className="space-y-3">
            <div className="h-80 rounded-md border border-gray-300 overflow-hidden relative">
              <Map
                ref={mapRef}
                accessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
                initialCenter={getInitialCenter()}
                initialZoom={14}
                showMapboxControls={false}
                showLayerSelector={false}
                showSearch={true}
                searchPlaceholder="Find address or places..."
                className="w-full h-full"
                onGeolocate={handleGeolocate}
                onMapClick={handleMapClick}
                onSearchResult={handleSearchResult}
                onClearMarkerRef={clearMarkerRef}
                onSetMarkerRef={setMarkerRef}
                onResetAutoGeolocateRef={resetAutoGeolocateRef}
                autoGeolocate={true}
                zones={zones}
                onZoneClick={handleZoneClick}
                layerVisibility={{
                  farmLocations: true,
                  farmParcels: true,
                  farmZones: true,
                  showTasks: false,
                }}
              >
                <FarmsLayer
                  farms={farms}
                  onFarmClick={handleFarmClick}
                  visible={true}
                />
                <ZonesLayer
                  zones={zones}
                  onZoneClick={handleZoneClick}
                  visible={true}
                />
                {filteredSamplePaths && filteredSamplePaths.length > 0 && (
                  <SamplePathsLayer
                    samplePaths={filteredSamplePaths}
                    visible={true}
                  />
                )}
              </Map>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 w-full flex-1">
        <Button
          onClick={handleSave}
          className="bg-basic-green flex-1 hover:bg-basic-green/80"
        >
          Save
        </Button>
      </div>
    </Dialog>
  );
}
