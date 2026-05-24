export interface Sample {
  id: string;
  sampleId: string;
  testType: string;
  farm: string;
  parcelId: string | null;
  zoneId: string | null;
  parcel: string | null;
  zone: string | null;
  lpisId: string;
  labOrderId: string;
  latitude?: string;
  longitude?: string;
}

export interface SamplePath {
  id: string;
  sampleId: string;
  farm: string;
  zoneId: string;
  coordinates: [number, number][];
  color?: string;
  width?: number;
}

const smithFamilyFarmCoords = {
  center: [-8.22, 53.4125] as [number, number],
  zone1: [
    [-8.225, 53.415],
    [-8.22, 53.415],
    [-8.22, 53.41],
    [-8.225, 53.41],
    [-8.225, 53.415],
  ] as [number, number][],
  zone2: [
    [-8.22, 53.415],
    [-8.215, 53.415],
    [-8.215, 53.41],
    [-8.22, 53.41],
    [-8.22, 53.415],
  ] as [number, number][],
  zone3: [
    [-8.225, 53.41],
    [-8.22, 53.41],
    [-8.22, 53.405],
    [-8.225, 53.405],
    [-8.225, 53.41],
  ] as [number, number][],
  zone4: [
    [-8.22, 53.41],
    [-8.215, 53.41],
    [-8.215, 53.405],
    [-8.22, 53.405],
    [-8.22, 53.41],
  ] as [number, number][],
};

const sunsetMeadowsCoords = {
  center: [-8.36, 53.51] as [number, number],
  zone1: [
    [-8.365, 53.515],
    [-8.355, 53.515],
    [-8.355, 53.505],
    [-8.365, 53.505],
    [-8.365, 53.515],
  ] as [number, number][],
  zone2: [
    [-8.355, 53.515],
    [-8.345, 53.515],
    [-8.345, 53.505],
    [-8.355, 53.505],
    [-8.355, 53.515],
  ] as [number, number][],
  zone3: [
    [-8.365, 53.505],
    [-8.355, 53.505],
    [-8.355, 53.495],
    [-8.365, 53.495],
    [-8.365, 53.505],
  ] as [number, number][],
};

const generateSnakePath = (
  farmCenter: [number, number],
  zoneCoords: [number, number][],
  sampleId: string,
  farm: string,
  zoneId: string
): SamplePath => {
  const minLng = Math.min(...zoneCoords.map((coord) => coord[0]));
  const maxLng = Math.max(...zoneCoords.map((coord) => coord[0]));
  const minLat = Math.min(...zoneCoords.map((coord) => coord[1]));
  const maxLat = Math.max(...zoneCoords.map((coord) => coord[1]));

  const zoneWidth = maxLng - minLng;
  const zoneHeight = maxLat - minLat;

  const pathPoints: [number, number][] = [];

  const numPoints = 50;

  for (let i = 0; i < numPoints; i++) {
    const progress = i / (numPoints - 1);

    const margin = 0.001;
    let lng = minLng + margin + (maxLng - minLng - 2 * margin) * progress;
    let lat = minLat + margin + (maxLat - minLat - 2 * margin) * progress;

    const snakeAmplitude = Math.min(zoneWidth, zoneHeight) * 0.15;
    const snakeFrequency = 3;

    if (i % 2 === 0) {
      const snakeOffset =
        Math.sin(progress * snakeFrequency * Math.PI) * snakeAmplitude;
      lng += snakeOffset;
    } else {
      const snakeOffset =
        Math.cos(progress * snakeFrequency * Math.PI) * snakeAmplitude;
      lat += snakeOffset;
    }

    lng = Math.max(minLng + margin, Math.min(maxLng - margin, lng));
    lat = Math.max(minLat + margin, Math.min(maxLat - margin, lat));

    pathPoints.push([lng, lat]);
  }

  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
  ];
  const colorIndex = parseInt(zoneId.split('-')[1] || '1') - 1;
  const pathColor = colors[colorIndex % colors.length];

  return {
    id: `path-${sampleId}`,
    sampleId,
    farm,
    zoneId,
    coordinates: pathPoints,
    color: pathColor,
    width: 3,
  };
};

const generatePaperclipPath = (
  farmCenter: [number, number],
  zoneCoords: [number, number][],
  sampleId: string,
  farm: string,
  zoneId: string
): SamplePath => {
  const minLng = Math.min(...zoneCoords.map((coord) => coord[0]));
  const maxLng = Math.max(...zoneCoords.map((coord) => coord[0]));
  const minLat = Math.min(...zoneCoords.map((coord) => coord[1]));
  const maxLat = Math.max(...zoneCoords.map((coord) => coord[1]));

  const zoneWidth = maxLng - minLng;
  const zoneHeight = maxLat - minLat;

  const pathPoints: [number, number][] = [];

  const numPoints = 60;

  for (let i = 0; i < numPoints; i++) {
    const progress = i / (numPoints - 1);

    const margin = 0.001;
    let lng = minLng + margin + (maxLng - minLng - 2 * margin) * progress;
    let lat = minLat + margin + (maxLat - minLat - 2 * margin) * progress;

    const paperclipAmplitude = Math.min(zoneWidth, zoneHeight) * 0.12;
    const paperclipFrequency = 2.5;

    const angle = progress * paperclipFrequency * 2 * Math.PI;
    const radius = paperclipAmplitude * (1 - progress * 0.3);

    lng += Math.cos(angle) * radius;
    lat += Math.sin(angle) * radius;

    if (progress > 0.3 && progress < 0.7) {
      const extraAngle = (progress - 0.3) * 3 * Math.PI;
      const extraRadius = paperclipAmplitude * 0.3;
      lng += Math.cos(extraAngle) * extraRadius;
      lat += Math.sin(extraAngle) * extraRadius;
    }

    lng = Math.max(minLng + margin, Math.min(maxLng - margin, lng));
    lat = Math.max(minLat + margin, Math.min(maxLat - margin, lat));

    pathPoints.push([lng, lat]);
  }

  const colors = [
    '#ff6b6b',
    '#4ecdc4',
    '#45b7d1',
    '#96ceb4',
    '#feca57',
    '#ff9ff3',
    '#54a0ff',
    '#5f27cd',
  ];
  const colorIndex = parseInt(zoneId.split('-')[1] || '1') - 1;
  const pathColor = colors[colorIndex % colors.length];

  return {
    id: `path-${sampleId}`,
    sampleId,
    farm,
    zoneId,
    coordinates: pathPoints,
    color: pathColor,
    width: 3,
  };
};

const generateSoilSamplePath = (
  farmCenter: [number, number],
  zoneCoords: [number, number][],
  sampleId: string,
  farm: string,
  zoneId: string
): SamplePath => {
  const zoneNumber = parseInt(zoneId.split('-')[1] || '1');

  if (zoneNumber % 2 === 1) {
    return generateSnakePath(farmCenter, zoneCoords, sampleId, farm, zoneId);
  } else {
    return generatePaperclipPath(
      farmCenter,
      zoneCoords,
      sampleId,
      farm,
      zoneId
    );
  }
};

export const mockSamplePaths: SamplePath[] = [
  generateSoilSamplePath(
    [-8.22, 53.4125],
    smithFamilyFarmCoords.zone1,
    'S-2024-001',
    'Smith Family Farm',
    'zone-1'
  ),
  generateSoilSamplePath(
    [-8.21, 53.415],
    smithFamilyFarmCoords.zone2,
    'S-2024-002',
    'Smith Family Farm',
    'zone-2'
  ),
  generateSoilSamplePath(
    [-8.23, 53.41],
    smithFamilyFarmCoords.zone3,
    'S-2024-003',
    'Smith Family Farm',
    'zone-3'
  ),
  generateSoilSamplePath(
    [-8.365, 53.515],
    sunsetMeadowsCoords.zone1,
    'S-2024-004',
    'Sunset Meadows',
    'zone-1'
  ),
  generateSoilSamplePath(
    [-8.355, 53.51],
    sunsetMeadowsCoords.zone2,
    'S-2024-005',
    'Sunset Meadows',
    'zone-2'
  ),
  generateSoilSamplePath(
    [-8.22, 53.405],
    smithFamilyFarmCoords.zone4,
    'S-2024-006',
    'Smith Family Farm',
    'zone-4'
  ),
  generateSoilSamplePath(
    [-8.365, 53.505],
    sunsetMeadowsCoords.zone3,
    'S-2024-007',
    'Sunset Meadows',
    'zone-3'
  ),
];

export const mockSamplesForLab001: Sample[] = [
  {
    id: '1',
    sampleId: 'S-2024-001',
    testType: 'pH, P, K, Trace',
    farm: 'Smith Family Farm',
    parcelId: 'Wheat Field A',
    zoneId: 'Zone A1',
    parcel: 'Wheat Field A',
    zone: 'Zone A1',
    lpisId: '081234567',
    labOrderId: 'LO-2024-001',
    latitude: '53.4125',
    longitude: '-8.22',
  },
  {
    id: '2',
    sampleId: 'S-2024-002',
    testType: 'pH, P, K',
    farm: 'Smith Family Farm',
    parcelId: 'Wheat Field A',
    zoneId: 'Zone A2',
    parcel: 'Wheat Field A',
    zone: 'Zone A2',
    lpisId: '081234568',
    labOrderId: 'LO-2024-001',
    latitude: '53.415',
    longitude: '-8.21',
  },
  {
    id: '3',
    sampleId: 'S-2024-003',
    testType: 'pH, P, K',
    farm: 'Smith Family Farm',
    parcelId: 'Wheat Field A',
    zoneId: 'Zone A2',
    parcel: 'Wheat Field A',
    zone: 'Zone A2',
    lpisId: '081234568',
    labOrderId: 'LO-2024-001',
    latitude: '53.415',
    longitude: '-8.21',
  },
];

export const mockSamplesForLab002: Sample[] = [];

export const getSamplesByLabOrderId = (labOrderId: string): Sample[] => {
  switch (labOrderId) {
    case 'LO-2024-001':
      return mockSamplesForLab001;
    case 'LO-2024-002':
      return mockSamplesForLab002;
    default:
      return [];
  }
};

export const getSamplesByTaskId = (taskId: string): Sample[] => {
  switch (taskId) {
    case '123':
      return mockSamplesForLab001;
    case '124':
      return mockSamplesForLab002;
    default:
      return [];
  }
};

export const getSamplePathsByTaskId = (taskId: string): SamplePath[] => {
  switch (taskId) {
    case '123':
      return mockSamplePaths;
    case '124':
      return mockSamplePaths;
    default:
      return mockSamplePaths;
  }
};

export const getSamplePathsByLabOrderId = (
  labOrderId: string
): SamplePath[] => {
  switch (labOrderId) {
    case 'LO-2024-001':
      return mockSamplePaths;
    case 'LO-2024-002':
      return mockSamplePaths;
    default:
      return [];
  }
};

export const getSamplePathBySampleId = (
  sampleId: string
): SamplePath | null => {
  return mockSamplePaths.find((path) => path.sampleId === sampleId) || null;
};

export const allMockSamples: Sample[] = [
  ...mockSamplesForLab001,
  ...mockSamplesForLab002,
];

export const allMockSamplePaths: SamplePath[] = mockSamplePaths;
