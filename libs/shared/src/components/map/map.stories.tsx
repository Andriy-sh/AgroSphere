import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Map } from './map';
import { FarmsLayer } from './layers/farms-layer';
import { TasksLayer } from './layers/tasks-layer';
import { ZonesLayer } from './layers/zones-layer';
import { ParcelsLayer } from './layers/parcels-layer';
import { SceneTimelineLayer } from './layers/scene-timeline-layer';
import type { TaskMarker } from './layers/tasks-layer';
import type { FarmMarker, MapZone, MapParcel } from '../../types/map';
import type { SceneTimelineItem } from './components/map-scene-timeline';
import productivityMapData from '../../data/json/productivity-map-10821393.json';
import farmData from '../../data/json/farm-data.json';

const meta: Meta<typeof Map> = {
  title: 'Components/Map/Map',
  component: Map,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A comprehensive map component built with Mapbox GL JS that supports farm markers, task markers, zones, search functionality, and resizable panels. Features include layer visibility controls, popup management, and zoom controls.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    accessToken: {
      control: 'text',
      description: 'Mapbox access token for map functionality',
      table: {
        type: { summary: 'string' },
      },
    },
    initialCenter: {
      control: 'object',
      description: 'Initial map center coordinates [longitude, latitude]',
      table: {
        type: { summary: '[number, number]' },
        defaultValue: { summary: '[-8.2, 53.4]' },
      },
    },
    initialZoom: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Initial map zoom level',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '12' },
      },
    },
    maxZoom: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Maximum zoom level',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '18' },
      },
    },
    minZoom: {
      control: { type: 'range', min: 1, max: 20, step: 1 },
      description: 'Minimum zoom level',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
    showMapboxControls: {
      control: 'boolean',
      description:
        'Show default Mapbox controls (navigation, fullscreen, geolocation). Disabled by default in Storybook to avoid conflicts with custom controls.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    showLayerSelector: {
      control: 'boolean',
      description: 'Show layer visibility controls',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showSearch: {
      control: 'boolean',
      description: 'Show search functionality',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    showResizablePanel: {
      control: 'boolean',
      description: 'Show resizable side panel',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    panelSide: {
      control: 'select',
      options: ['left', 'right'],
      description: 'Side for the resizable panel',
      table: {
        type: { summary: "'left' | 'right'" },
        defaultValue: { summary: "'right'" },
      },
    },
    onTaskClick: {
      action: 'task clicked',
      description: 'Callback when a task marker is clicked',
    },
    onFarmClick: {
      action: 'farm clicked',
      description: 'Callback when a farm marker is clicked',
    },
    onZoneClick: {
      action: 'zone clicked',
      description: 'Callback when a zone is clicked',
    },
  },
  args: {
    initialCenter: [-8.2, 53.4],
    initialZoom: 10,
    maxZoom: 18,
    minZoom: 3,
    showMapboxControls: false,
    showLayerSelector: true,
    showSearch: true,
    showResizablePanel: false,
    panelSide: 'right',
    searchPlaceholder: 'Search for farms or locations...',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '600px', width: '100%' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

interface ProductivityZoneData {
  zone_area: number;
  zone_p: number;
  fertilizer: number;
  geometry: {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

interface ProductivityMapData {
  field_id: number;
  zmap_id: string;
  type_zmap: string;
  vegetation_index: string;
  date: string;
  zones: Array<{
    [key: string]: ProductivityZoneData;
  }>;
  total_fertilizer_consumption: number;
  image_link?: string;
}

function getZoneColor(zoneIndex: number): string {
  const colors = ['#F44336', '#FF9800', '#FFEB3B', '#8BC34A', '#2E7D32'];

  return colors[zoneIndex % colors.length];
}

function convertProductivityZonesToMapZones(): MapZone[] {
  const zones: MapZone[] = [];
  const data = productivityMapData as ProductivityMapData;

  data.zones.forEach((zoneObj) => {
    const zoneKey = Object.keys(zoneObj)[0];
    const zone = zoneObj[zoneKey];
    const zoneNumber = parseInt(zoneKey.replace('zone_', ''), 10);

    if (zone.geometry && zone.geometry.coordinates) {
      const coordinates: [number, number][][][] = zone.geometry.coordinates.map(
        (polygon: number[][][]) =>
          polygon.map((ring: number[][]) =>
            ring.map(
              (coord: number[]) => [coord[0], coord[1]] as [number, number]
            )
          )
      );

      zones.push({
        id: `zone-${zoneNumber}`,
        name: `Zone ${zoneNumber + 1}`,
        area: zone.zone_area,
        coordinates: coordinates,
        fillColor: getZoneColor(zoneNumber),
        borderColor: '#FFFFFF',
        fillOpacity: 0.12,
        borderWidth: 2,
        visible: true,
        zIndex: 5,
      });
    }
  });

  return zones;
}

function convertProductivityZonesToMapZonesWithColors(): MapZone[] {
  const zones: MapZone[] = [];
  const data = productivityMapData as ProductivityMapData;

  data.zones.forEach((zoneObj) => {
    const zoneKey = Object.keys(zoneObj)[0];
    const zone = zoneObj[zoneKey];
    const zoneNumber = parseInt(zoneKey.replace('zone_', ''), 10);

    if (zone.geometry && zone.geometry.coordinates) {
      const coordinates: [number, number][][][] = zone.geometry.coordinates.map(
        (polygon: number[][][]) =>
          polygon.map((ring: number[][]) =>
            ring.map(
              (coord: number[]) => [coord[0], coord[1]] as [number, number]
            )
          )
      );

      const fillColor = getZoneColor(zoneNumber);

      zones.push({
        id: `zone-${zoneNumber}`,
        name: `Zone ${zoneNumber + 1}`,
        area: zone.zone_area,
        coordinates: coordinates,
        fillColor: fillColor,
        borderColor: fillColor,
        fillOpacity: 0.3,
        borderWidth: 2,
        visible: true,
        zIndex: 5,
      });
    }
  });

  return zones;
}

const mockSceneTimelineItems: SceneTimelineItem[] = [
  {
    tms: 'link',
    sceneID: 'scene-1',
    cloudCoverage: 5,
    view_id: '10821393',
    date: new Date('2024-01-15'),
  },
  {
    tms: 'link',
    sceneID: 'scene-2',
    cloudCoverage: 10,
    view_id: '10821393',
    date: new Date('2024-02-20'),
  },
  {
    tms: 'link',
    sceneID: 'scene-3',
    cloudCoverage: 2,
    view_id: '10821393',
    date: new Date('2024-03-25'),
  },
  {
    tms: 'link',
    sceneID: 'scene-4',
    cloudCoverage: 8,
    view_id: '10821393',
    date: new Date('2024-04-30'),
  },
  {
    tms: 'link',
    sceneID: 'scene-5',
    cloudCoverage: 15,
    view_id: '10821393',
    date: new Date('2024-05-15'),
  },
  {
    tms: 'link',
    sceneID: 'scene-6',
    cloudCoverage: 12,
    view_id: '10821393',
    date: new Date('2024-06-10'),
  },
  {
    tms: 'link',
    sceneID: 'scene-7',
    cloudCoverage: 7,
    view_id: '10821393',
    date: new Date('2024-07-05'),
  },
  {
    tms: 'link',
    sceneID: 'scene-8',
    cloudCoverage: 20,
    view_id: '10821393',
    date: new Date('2024-08-20'),
  },
  {
    tms: 'link',
    sceneID: 'scene-9',
    cloudCoverage: 3,
    view_id: '10821393',
    date: new Date('2024-09-15'),
  },
  {
    tms: 'link',
    sceneID: 'scene-10',
    cloudCoverage: 18,
    view_id: '10821393',
    date: new Date('2024-10-01'),
  },
  {
    tms: 'link',
    sceneID: 'scene-11',
    cloudCoverage: 6,
    view_id: '10821393',
    date: new Date('2024-10-25'),
  },
  {
    tms: 'link',
    sceneID: 'scene-12',
    cloudCoverage: 14,
    view_id: '10821393',
    date: new Date('2024-11-10'),
  },
  {
    tms: 'link',
    sceneID: 'scene-13',
    cloudCoverage: 9,
    view_id: '10821393',
    date: new Date('2024-11-30'),
  },
  {
    tms: 'link',
    sceneID: 'scene-14',
    cloudCoverage: 11,
    view_id: '10821393',
    date: new Date('2024-12-15'),
  },
];

interface FarmParcelData {
  id: string;
  name: string;
  type: string;
  area: number;
  geometry: number[][];
  children: any[];
  eosdaFieldId?: string;
  history?: any[];
}

interface FarmData {
  id: string;
  name: string;
  area: number;
  parcels: number;
  children: FarmParcelData[];
  lat?: number;
  lng?: number;
}

function convertFarmParcelsToMapParcels(): MapParcel[] {
  const parcels: MapParcel[] = [];

  let farms: FarmData[];
  if (farmData && typeof farmData === 'object' && 'features' in farmData) {
    const featureCollection = farmData as { type: string; features: any[] };
    farms = featureCollection.features.map((feature) => {
      const coords = feature.geometry?.coordinates?.[0] || [];
      return {
        id: feature.properties?.id || feature.properties?.name || '',
        name: feature.properties?.name || '',
        area: 0,
        parcels: 0,
        children: [
          {
            id: feature.properties?.id || feature.properties?.name || '',
            name: feature.properties?.name || '',
            type: 'parcel',
            area: 0,
            geometry: coords,
            children: [],
          },
        ],
      } as FarmData;
    });
  } else {
    farms = farmData as FarmData[];
  }

  farms.forEach((farm) => {
    if (farm.children && Array.isArray(farm.children)) {
      farm.children.forEach((parcel) => {
        if (
          parcel.type === 'parcel' &&
          parcel.geometry &&
          parcel.geometry.length > 0
        ) {
          const coordinates = parcel.geometry.map(
            (coord) => [coord[0], coord[1]] as [number, number]
          );

          if (coordinates.length > 0) {
            const first = coordinates[0];
            const last = coordinates[coordinates.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              coordinates.push([first[0], first[1]]);
            }
          }

          const multiPolygon: [number, number][][][] = [[coordinates]];

          parcels.push({
            id: parcel.id,
            name: parcel.name,
            area: parcel.area ? parcel.area * 10000 : undefined,
            coordinates: multiPolygon,
            fillColor: '#FFFFFF',
            borderColor: '#FFFFFF',
            fillOpacity: 0.12,
            borderWidth: 2,
            visible: true,
            eosdaFieldId: parcel.eosdaFieldId,
          });
        }
      });
    }
  });

  return parcels;
}

const mockZonesFromJson = convertProductivityZonesToMapZones();
const mockZonesWithColors = convertProductivityZonesToMapZonesWithColors();
const mockParcelsFromJson = convertFarmParcelsToMapParcels();

const mockTasks: TaskMarker[] = [
  {
    id: 'task-1',
    longitude: -8.2,
    latitude: 53.4,
    title: 'Soil Sampling - Field 1',
    status: 'pending',
    color: '#ff6b6b',
    farmer_name: 'John Smith',
    task_type: 'Soil Sampling',
    farmteam_task_number: 'FT-001',
    complete_by: '2024-02-15',
    no_of_samples: 10,
    lab: 'AgriLab',
    advisor: 'Dr. Brown',
    priority: 'urgent',
    description: 'Collect soil samples from Field 1 for nutrient analysis',
    created_date: '2024-01-15',
    assigned_users: [
      {
        name: 'Alice',
        surname: 'Johnson',
        avatarSrc: 'https://via.placeholder.com/40',
      },
    ],
  },
  {
    id: 'task-2',
    longitude: -8.35,
    latitude: 53.5,
    title: 'Crop Monitoring - Field 2',
    status: 'in_progress',
    color: '#4ecdc4',
    farmer_name: 'Mary Wilson',
    task_type: 'Crop Monitoring',
    farmteam_task_number: 'FT-002',
    complete_by: '2024-02-20',
    no_of_samples: 5,
    lab: 'CropLab',
    advisor: 'Dr. Green',
    priority: 'normal',
    description: 'Monitor crop health and growth in Field 2',
    created_date: '2024-01-20',
    assigned_users: [
      {
        name: 'Bob',
        surname: 'Davis',
        avatarSrc: 'https://via.placeholder.com/40',
      },
    ],
  },
  {
    id: 'task-3',
    longitude: -8.05,
    latitude: 53.3,
    title: 'Pest Control - Field 3',
    status: 'completed',
    color: '#45b7d1',
    farmer_name: 'Tom Anderson',
    task_type: 'Pest Control',
    farmteam_task_number: 'FT-003',
    complete_by: '2024-02-10',
    no_of_samples: 0,
    lab: 'PestLab',
    advisor: 'Dr. White',
    priority: 'normal',
    description: 'Apply pest control measures to Field 3',
    created_date: '2024-01-10',
    assigned_users: [
      {
        name: 'Carol',
        surname: 'Miller',
        avatarSrc: 'https://via.placeholder.com/40',
      },
    ],
  },
];

const mockFarms: FarmMarker[] = (() => {
  const farms: FarmMarker[] = [];

  let farmsData: FarmData[];
  if (farmData && typeof farmData === 'object' && 'features' in farmData) {
    const featureCollection = farmData as { type: string; features: any[] };
    farmsData = featureCollection.features.slice(0, 2).map((feature) => {
      const coords = feature.geometry?.coordinates?.[0] || [];
      const sumLng = coords.reduce(
        (sum: number, coord: number[]) => sum + coord[0],
        0
      );
      const sumLat = coords.reduce(
        (sum: number, coord: number[]) => sum + coord[1],
        0
      );

      return {
        id: feature.properties?.id || feature.properties?.name || '',
        name: feature.properties?.name || '',
        area: 0,
        parcels: 0,
        children: [],
        lng: coords.length > 0 ? sumLng / coords.length : undefined,
        lat: coords.length > 0 ? sumLat / coords.length : undefined,
      } as FarmData;
    });
  } else {
    farmsData = (farmData as FarmData[]).slice(0, 2);
  }

  farmsData.forEach((farm, index) => {
    let centerLng: number;
    let centerLat: number;

    if (farm.lng !== undefined && farm.lat !== undefined) {
      centerLng = farm.lng;
      centerLat = farm.lat;
    } else if (farm.children && farm.children.length > 0) {
      const firstParcel = farm.children[0];
      if (firstParcel.geometry && firstParcel.geometry.length > 0) {
        const coords = firstParcel.geometry;
        const sumLng = coords.reduce((sum, coord) => sum + coord[0], 0);
        const sumLat = coords.reduce((sum, coord) => sum + coord[1], 0);
        centerLng = sumLng / coords.length;
        centerLat = sumLat / coords.length;
      } else {
        centerLng = -6.819;
        centerLat = 52.816;
      }
    } else {
      centerLng = -6.819;
      centerLat = 52.816;
    }

    farms.push({
      id: farm.id || `farm-${index + 1}`,
      longitude: centerLng,
      latitude: centerLat,
      title: farm.name || `Farm ${index + 1}`,
      name: farm.name || `Farm ${index + 1}`,
      client_name: 'Farm Owner',
      address: 'Farm Address',
      size: farm.area,
      crop_type: 'Mixed Crops',
      last_visit: '2024-01-15',
      status: 'active',
      clientId: `client-${index + 1}`,
      visible: true,
    });
  });

  return farms.length > 0
    ? farms
    : [
        {
          id: 'farm-1',
          longitude: -6.819,
          latitude: 52.816,
          title: 'Default Farm',
          name: 'Default Farm',
          client_name: 'John Smith',
          address: 'Farm Road, Ireland',
          size: 67.41,
          crop_type: 'Mixed Crops',
          last_visit: '2024-01-15',
          status: 'active',
          clientId: 'client-1',
          visible: true,
        },
      ];
})();

const mockZones =
  mockZonesFromJson.length > 0
    ? mockZonesFromJson
    : [
        {
          id: 'zone-1',
          name: 'Field 1',
          cropType: 'Wheat',
          clientId: 'client-1',
          farmId: 'farm-1',
          fillColor: '#fff',
          borderColor: '#fff',
          coordinates: [
            [
              [
                [-8.21, 53.41],
                [-8.19, 53.41],
                [-8.19, 53.39],
                [-8.21, 53.39],
                [-8.21, 53.41],
              ],
            ],
          ],
          visible: true,
          area: 150,
        },
        {
          id: 'zone-2',
          name: 'Field 2',
          cropType: 'Barley',
          clientId: 'client-2',
          farmId: 'farm-2',
          coordinates: [
            [
              [
                [-8.36, 53.51],
                [-8.34, 53.51],
                [-8.34, 53.49],
                [-8.36, 53.49],
                [-8.36, 53.51],
              ],
            ],
          ],
          visible: true,
          area: 200,
        },
      ];

export const Default: Story = {
  render: (args) => <Map {...args}>{/* No layers for default map */}</Map>,
  parameters: {
    docs: {
      description: {
        story:
          'Basic map with default settings. Shows the map with custom controls (layer selector, search) but without default Mapbox controls to avoid conflicts.',
      },
    },
  },
};

export const WithTasks: Story = {
  render: (args) => (
    <Map {...args}>
      <TasksLayer tasks={mockTasks} visible={true} />
    </Map>
  ),
  args: {
    layerVisibility: {
      showTasks: true,
      farmLocations: false,
      farmParcels: false,
      farmZones: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Map displaying task markers with different statuses and priorities. Tasks are color-coded and show detailed information in popups.',
      },
    },
  },
};

export const WithFarms: Story = {
  render: (args) => (
    <Map {...args}>
      <FarmsLayer farms={mockFarms} visible={true} />
    </Map>
  ),
  args: {
    layerVisibility: {
      showTasks: false,
      farmLocations: true,
      farmParcels: false,
      farmZones: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Map displaying farm markers with farm information. Each farm shows details like size, crop type, and last visit date.',
      },
    },
  },
};

export const WithTimeline: Story = {
  render: (args) => {
    const [selectedSceneId, setSelectedSceneId] = useState<string | undefined>(
      mockSceneTimelineItems[0]?.sceneID
    );
    const [selectedBand, setSelectedBand] = useState<string>('NDVI');

    return (
      <Map
        {...args}
        zones={mockZonesWithColors}
        initialCenter={[-6.794, 52.806]}
        initialZoom={14}
      >
        <ZonesLayer
          zones={mockZonesWithColors}
          visible={true}
          showZoneLabels={false}
        />
        <SceneTimelineLayer
          showSceneTimeline={true}
          sceneTimelineItems={mockSceneTimelineItems}
          sceneTimelineSelectedId={selectedSceneId}
          onSceneTimelineSelect={(scene) => {
            setSelectedSceneId(scene.sceneID);
            console.log('Scene selected:', scene);
          }}
          sceneTimelineLoading={false}
          showBandSelector={true}
          bandOptions={['NDVI', 'NDRE', 'MSAVI', 'RECI']}
          selectedBand={selectedBand}
          onBandChange={(band) => {
            setSelectedBand(band);
            console.log('Band changed:', band);
          }}
        />
      </Map>
    );
  },
  args: {
    layerVisibility: {
      showTasks: false,
      farmLocations: false,
      farmParcels: false,
      farmZones: true,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Map with zones from productivity map JSON and scene timeline. Zones are loaded from productivity-map-10821393.json file. The timeline allows selecting different scenes and bands for visualization.',
      },
    },
  },
};

export const CompleteMap: Story = {
  render: (args) => {
    const initialCenter: [number, number] =
      mockParcelsFromJson.length > 0 &&
      mockParcelsFromJson[0].coordinates.length > 0
        ? (() => {
            const firstRing = mockParcelsFromJson[0].coordinates[0][0];
            const sumLng = firstRing.reduce((sum, coord) => sum + coord[0], 0);
            const sumLat = firstRing.reduce((sum, coord) => sum + coord[1], 0);
            return [sumLng / firstRing.length, sumLat / firstRing.length] as [
              number,
              number
            ];
          })()
        : [-6.819, 52.816];

    return (
      <Map
        {...args}
        parcels={mockParcelsFromJson}
        parcelZoneMode="parcels"
        initialCenter={initialCenter}
        initialZoom={14}
      >
        <TasksLayer tasks={mockTasks} visible={true} />
        <FarmsLayer farms={mockFarms} visible={true} />
        <ParcelsLayer parcels={mockParcelsFromJson} visible={true} />
      </Map>
    );
  },
  args: {
    layerVisibility: {
      showTasks: true,
      farmLocations: true,
      farmParcels: true,
      farmZones: false,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete map with all layers enabled - tasks, farms with default colors, and parcels from farm-data.json. Parcels are displayed instead of zones.',
      },
    },
  },
};
