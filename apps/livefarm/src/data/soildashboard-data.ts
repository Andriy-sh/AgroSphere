import farmDataJson from '@/data/json/farm-data.json';

export interface ZoneMetrics {
  phGrassland: number;
  phCerealsMaize: number;
  lime: number;
  pIndexGrassland: number;
  pIndexOtherCrops: number;
  kIndexMineralSoil: number;
  kIndexPeatSoil: number;
  organicMatter: number;
  magnesiumMg: number;
  calciumC: number;
  copperCu: number;
  manganeseMn: number;
  zincZn: number;
  boronB: number;
}

interface FarmDataParcel {
  id: string;
  name: string;
  type?: string;
  area?: number;
  geometry?: [number, number][];
  children?: Array<{ id: string; name: string; area?: number }>;
  history?: Array<{
    parcelWithZones?: {
      parcelId: string;
      zones?: Array<{
        zoneId: string;
        zoneName: string;
        coordinates: [number, number][][];
      }>;
    };
  }>;
}

interface FarmDataRecord {
  id: string;
  name: string;
  area?: number;
  parcels?: number;
  children?: FarmDataParcel[];
}

export interface Zone {
  id: string;
  name: string;
  coordinates: [number, number][][][];
  metrics: ZoneMetrics;
}

export interface Parcel {
  id: string;
  name: string;
  coordinates: [number, number][][][];
  pH?: number;
  zones: Zone[];
  metrics: ZoneMetrics;
}

export interface Farm {
  id: string;
  name: string;
  parcels: Parcel[];
  metrics: ZoneMetrics;
}

function calculateAverageMetrics(zones: Zone[]): ZoneMetrics {
  if (zones.length === 0) {
    throw new Error('Cannot calculate average metrics for empty zones array');
  }

  const sum = zones.reduce(
    (acc, zone) => ({
      phGrassland: acc.phGrassland + zone.metrics.phGrassland,
      phCerealsMaize: acc.phCerealsMaize + zone.metrics.phCerealsMaize,
      lime: acc.lime + zone.metrics.lime,
      pIndexGrassland: acc.pIndexGrassland + zone.metrics.pIndexGrassland,
      pIndexOtherCrops: acc.pIndexOtherCrops + zone.metrics.pIndexOtherCrops,
      kIndexMineralSoil: acc.kIndexMineralSoil + zone.metrics.kIndexMineralSoil,
      kIndexPeatSoil: acc.kIndexPeatSoil + zone.metrics.kIndexPeatSoil,
      organicMatter: acc.organicMatter + zone.metrics.organicMatter,
      magnesiumMg: acc.magnesiumMg + zone.metrics.magnesiumMg,
      calciumC: acc.calciumC + zone.metrics.calciumC,
      copperCu: acc.copperCu + zone.metrics.copperCu,
      manganeseMn: acc.manganeseMn + zone.metrics.manganeseMn,
      zincZn: acc.zincZn + zone.metrics.zincZn,
      boronB: acc.boronB + zone.metrics.boronB,
    }),
    {
      phGrassland: 0,
      phCerealsMaize: 0,
      lime: 0,
      pIndexGrassland: 0,
      pIndexOtherCrops: 0,
      kIndexMineralSoil: 0,
      kIndexPeatSoil: 0,
      organicMatter: 0,
      magnesiumMg: 0,
      calciumC: 0,
      copperCu: 0,
      manganeseMn: 0,
      zincZn: 0,
      boronB: 0,
    }
  );

  const count = zones.length;
  return {
    phGrassland: Number((sum.phGrassland / count).toFixed(2)),
    phCerealsMaize: Number((sum.phCerealsMaize / count).toFixed(2)),
    lime: Number((sum.lime / count).toFixed(1)),
    pIndexGrassland: Number((sum.pIndexGrassland / count).toFixed(1)),
    pIndexOtherCrops: Number((sum.pIndexOtherCrops / count).toFixed(1)),
    kIndexMineralSoil: Number((sum.kIndexMineralSoil / count).toFixed(1)),
    kIndexPeatSoil: Number((sum.kIndexPeatSoil / count).toFixed(1)),
    organicMatter: Number((sum.organicMatter / count).toFixed(1)),
    magnesiumMg: Number((sum.magnesiumMg / count).toFixed(0)),
    calciumC: Number((sum.calciumC / count).toFixed(0)),
    copperCu: Number((sum.copperCu / count).toFixed(2)),
    manganeseMn: Number((sum.manganeseMn / count).toFixed(1)),
    zincZn: Number((sum.zincZn / count).toFixed(2)),
    boronB: Number((sum.boronB / count).toFixed(1)),
  };
}

function generateZoneMetrics(seed: string): ZoneMetrics {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  const random = (min: number, max: number) => {
    const normalized = Math.abs(Math.sin(hash + seed.length)) * 10000;
    return min + (normalized % (max - min + 1));
  };

  const phGrassland = 5.0 + random(0, 30) / 10;
  const phCerealsMaize = phGrassland + (random(0, 5) - 2) / 10;
  const lime = random(0, 100) / 10;
  const pIndexGrassland = random(10, 80) / 10;
  const pIndexOtherCrops = pIndexGrassland + (random(0, 20) - 10) / 10;
  const kIndexMineralSoil = random(30, 200);
  const kIndexPeatSoil = kIndexMineralSoil + random(0, 100);
  const organicMatter = random(20, 80);
  const magnesiumMg = random(50, 250);
  const calciumC = random(500, 2500);
  const copperCu = random(5, 35) / 10;
  const manganeseMn = random(5, 50);
  const zincZn = random(5, 40) / 10;
  const boronB = random(5, 30) / 10;

  return {
    phGrassland: Number(phGrassland.toFixed(2)),
    phCerealsMaize: Number(phCerealsMaize.toFixed(2)),
    lime: Number(lime.toFixed(1)),
    pIndexGrassland: Number(pIndexGrassland.toFixed(1)),
    pIndexOtherCrops: Number(pIndexOtherCrops.toFixed(1)),
    kIndexMineralSoil: Number(kIndexMineralSoil.toFixed(1)),
    kIndexPeatSoil: Number(kIndexPeatSoil.toFixed(1)),
    organicMatter: Number(organicMatter.toFixed(1)),
    magnesiumMg: Number(magnesiumMg.toFixed(0)),
    calciumC: Number(calciumC.toFixed(0)),
    copperCu: Number(copperCu.toFixed(2)),
    manganeseMn: Number(manganeseMn.toFixed(1)),
    zincZn: Number(zincZn.toFixed(2)),
    boronB: Number(boronB.toFixed(1)),
  };
}

function convertGeometryToCoordinates(
  geometry:
    | [number, number][]
    | [number, number][][]
    | [number, number][][][]
    | undefined
): [number, number][][][] {
  if (!geometry || (Array.isArray(geometry) && geometry.length === 0)) {
    return [[[[0, 0]]]];
  }

  if (
    Array.isArray(geometry[0]) &&
    Array.isArray(geometry[0][0]) &&
    Array.isArray(geometry[0][0][0])
  ) {
    return geometry as [number, number][][][];
  }

  if (
    Array.isArray(geometry[0]) &&
    Array.isArray(geometry[0][0]) &&
    !Array.isArray(geometry[0][0][0])
  ) {
    return [geometry as [number, number][][]];
  }

  const flatGeometry = geometry as [number, number][];
  if (!flatGeometry || flatGeometry.length === 0) {
    return [[[[0, 0]]]];
  }

  const filtered = flatGeometry.filter((coord) => {
    if (!coord || !Array.isArray(coord) || coord.length < 2) {
      return false;
    }
    const [x, y] = coord;
    if (typeof x === 'string' && x === '__INFINITY__') return false;
    if (typeof y === 'string' && y === '__INFINITY__') return false;
    return (
      typeof x === 'number' && typeof y === 'number' && !isNaN(x) && !isNaN(y)
    );
  }) as [number, number][];

  if (filtered.length === 0) {
    return [[[[0, 0]]]];
  }

  const first = filtered[0];
  const last = filtered[filtered.length - 1];
  const isClosed = first[0] === last[0] && first[1] === last[1];
  const closed = isClosed ? filtered : [...filtered, first];

  return [[closed]];
}

function splitParcelInHalf(
  geometry: [number, number][]
): [[number, number][], [number, number][]] {
  if (!geometry || geometry.length < 3) {
    return [
      [
        [0, 0],
        [0.001, 0],
        [0.001, 0.001],
        [0, 0.001],
        [0, 0],
      ],
      [
        [0, 0],
        [0.001, 0],
        [0.001, 0.001],
        [0, 0.001],
        [0, 0],
      ],
    ];
  }

  const validCoords = geometry.filter((coord) => {
    if (!coord || !Array.isArray(coord) || coord.length < 2) {
      return false;
    }
    const [x, y] = coord;
    if (typeof x === 'string' && x === '__INFINITY__') return false;
    if (typeof y === 'string' && y === '__INFINITY__') return false;
    return (
      typeof x === 'number' && typeof y === 'number' && !isNaN(x) && !isNaN(y)
    );
  }) as [number, number][];

  if (validCoords.length < 3) {
    return [
      [
        [0, 0],
        [0.001, 0],
        [0.001, 0.001],
        [0, 0.001],
        [0, 0],
      ],
      [
        [0, 0],
        [0.001, 0],
        [0.001, 0.001],
        [0, 0.001],
        [0, 0],
      ],
    ];
  }

  const coords =
    validCoords[0][0] === validCoords[validCoords.length - 1][0] &&
    validCoords[0][1] === validCoords[validCoords.length - 1][1]
      ? validCoords.slice(0, -1)
      : validCoords;

  let minLng = coords[0][0];
  let maxLng = coords[0][0];
  let minLat = coords[0][1];
  let maxLat = coords[0][1];

  for (const coord of coords) {
    minLng = Math.min(minLng, coord[0]);
    maxLng = Math.max(maxLng, coord[0]);
    minLat = Math.min(minLat, coord[1]);
    maxLat = Math.max(maxLat, coord[1]);
  }

  const width = maxLng - minLng;
  const height = maxLat - minLat;
  const splitByWidth = width > height;

  const centerLng = (minLng + maxLng) / 2;
  const centerLat = (minLat + maxLat) / 2;

  const zone1Coords: [number, number][] = [];
  const zone2Coords: [number, number][] = [];

  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    const nextCoord = coords[(i + 1) % coords.length];

    if (splitByWidth) {
      if (coord[0] <= centerLng) {
        zone1Coords.push(coord);
      } else {
        zone2Coords.push(coord);
      }

      if (
        (coord[0] < centerLng && nextCoord[0] > centerLng) ||
        (coord[0] > centerLng && nextCoord[0] < centerLng)
      ) {
        const t = (centerLng - coord[0]) / (nextCoord[0] - coord[0]);
        const intersectionLat = coord[1] + t * (nextCoord[1] - coord[1]);
        const intersection: [number, number] = [centerLng, intersectionLat];
        zone1Coords.push(intersection);
        zone2Coords.push(intersection);
      }
    } else {
      if (coord[1] <= centerLat) {
        zone1Coords.push(coord);
      } else {
        zone2Coords.push(coord);
      }

      if (
        (coord[1] < centerLat && nextCoord[1] > centerLat) ||
        (coord[1] > centerLat && nextCoord[1] < centerLat)
      ) {
        const t = (centerLat - coord[1]) / (nextCoord[1] - coord[1]);
        const intersectionLng = coord[0] + t * (nextCoord[0] - coord[0]);
        const intersection: [number, number] = [intersectionLng, centerLat];
        zone1Coords.push(intersection);
        zone2Coords.push(intersection);
      }
    }
  }

  const closePolygon = (coords: [number, number][]): [number, number][] => {
    if (coords.length < 3) {
      return [
        [0, 0],
        [0.001, 0],
        [0.001, 0.001],
        [0, 0.001],
        [0, 0],
      ];
    }
    const first = coords[0];
    const last = coords[coords.length - 1];
    if (first[0] !== last[0] || first[1] !== last[1]) {
      return [...coords, first];
    }
    return coords;
  };

  return [closePolygon(zone1Coords), closePolygon(zone2Coords)];
}

function convertFarmDataToFarms(farmDataRecords: FarmDataRecord[]): Farm[] {
  return farmDataRecords.map((farmData) => {
    const parcels: Parcel[] = (farmData.children || []).map((parcelData) => {
      const zones: Zone[] = [];

      if (parcelData.geometry && parcelData.geometry.length >= 3) {
        const [zone1Coords, zone2Coords] = splitParcelInHalf(
          parcelData.geometry
        );

        const zone1Coordinates = convertGeometryToCoordinates(zone1Coords);
        const zone2Coordinates = convertGeometryToCoordinates(zone2Coords);

        zones.push({
          id: `zone-${parcelData.id}-0`,
          name: 'Zone 1',
          coordinates: zone1Coordinates,
          metrics: generateZoneMetrics(`${farmData.id}-${parcelData.id}-0`),
        });

        zones.push({
          id: `zone-${parcelData.id}-1`,
          name: 'Zone 2',
          coordinates: zone2Coordinates,
          metrics: generateZoneMetrics(`${farmData.id}-${parcelData.id}-1`),
        });
      } else {
        zones.push({
          id: `zone-${parcelData.id}-0`,
          name: 'Zone 1',
          coordinates: [
            [
              [
                [0, 0],
                [0.001, 0],
                [0.001, 0.001],
                [0, 0.001],
                [0, 0],
              ],
            ],
          ],
          metrics: generateZoneMetrics(`${farmData.id}-${parcelData.id}-0`),
        });
        zones.push({
          id: `zone-${parcelData.id}-1`,
          name: 'Zone 2',
          coordinates: [
            [
              [
                [0.001, 0],
                [0.002, 0],
                [0.002, 0.001],
                [0.001, 0.001],
                [0.001, 0],
              ],
            ],
          ],
          metrics: generateZoneMetrics(`${farmData.id}-${parcelData.id}-1`),
        });
      }

      const parcelCoordinates = parcelData.geometry
        ? convertGeometryToCoordinates(parcelData.geometry)
        : zones[0]?.coordinates || [[[[0, 0]]]];

      const parcelMetrics = calculateAverageMetrics(zones);
      const avgPh = parcelMetrics.phGrassland;

      return {
        id: parcelData.id,
        name: parcelData.name,
        coordinates: parcelCoordinates,
        pH: avgPh,
        zones,
        metrics: parcelMetrics,
      };
    });

    const allZones = parcels.flatMap((p) => p.zones);
    const farmMetrics =
      allZones.length > 0
        ? calculateAverageMetrics(allZones)
        : generateZoneMetrics(farmData.id);

    return {
      id: farmData.id,
      name: farmData.name,
      parcels,
      metrics: farmMetrics,
    };
  });
}

let loadedFarms: Farm[] | null = null;

type FarmItem = {
  id: string;
  name: string;
  area: number;
  parcels: number;
  lat?: number;
  lng?: number;
  children?: Array<{
    id: string;
    name: string;
    area: number;
    type: string;
    geometry?: number[][];
    eosdaFieldId?: string;
    zoningId?: string;
    request_id?: string;
    children?: Array<{ id: string; name: string; area?: number }>;
  }>;
};

function convertFarmItemsToFarms(farmItems: FarmItem[]): Farm[] {
  return farmItems.map((farmItem) => {
    const parcels: Parcel[] = (farmItem.children || [])
      .filter((child) => child.type === 'parcel' && child.geometry && Array.isArray(child.geometry) && child.geometry.length >= 3) // Filter out groups and parcels without valid geometry
      .map((parcelData) => {
        const zones: Zone[] = [];
        const geometry = parcelData.geometry as [number, number][];

        if (geometry && geometry.length >= 3) {
          const [zone1Coords, zone2Coords] = splitParcelInHalf(geometry);

          const zone1Coordinates = convertGeometryToCoordinates(zone1Coords);
          const zone2Coordinates = convertGeometryToCoordinates(zone2Coords);

          zones.push({
            id: `zone-${parcelData.id}-0`,
            name: 'Zone 1',
            coordinates: zone1Coordinates,
            metrics: generateZoneMetrics(`${farmItem.id}-${parcelData.id}-0`),
          });

          zones.push({
            id: `zone-${parcelData.id}-1`,
            name: 'Zone 2',
            coordinates: zone2Coordinates,
            metrics: generateZoneMetrics(`${farmItem.id}-${parcelData.id}-1`),
          });
        } else {
          zones.push({
            id: `zone-${parcelData.id}-0`,
            name: 'Zone 1',
            coordinates: [
              [
                [
                  [0, 0],
                  [0.001, 0],
                  [0.001, 0.001],
                  [0, 0.001],
                  [0, 0],
                ],
              ],
            ],
            metrics: generateZoneMetrics(`${farmItem.id}-${parcelData.id}-0`),
          });

          zones.push({
            id: `zone-${parcelData.id}-1`,
            name: 'Zone 2',
            coordinates: [
              [
                [
                  [0.001, 0],
                  [0.002, 0],
                  [0.002, 0.001],
                  [0.001, 0.001],
                  [0.001, 0],
                ],
              ],
            ],
            metrics: generateZoneMetrics(`${farmItem.id}-${parcelData.id}-1`),
          });
        }

        const parcelCoordinates = geometry
          ? convertGeometryToCoordinates(geometry)
          : zones[0]?.coordinates || [[[[0, 0]]]];

        const parcelMetrics = calculateAverageMetrics(zones);
        const avgPh = parcelMetrics.phGrassland;

        return {
          id: parcelData.id,
          name: parcelData.name,
          coordinates: parcelCoordinates,
          pH: avgPh,
          zones,
          metrics: parcelMetrics,
        };
      });

    const allZones = parcels.flatMap((p) => p.zones);
    const farmMetrics =
      allZones.length > 0
        ? calculateAverageMetrics(allZones)
        : generateZoneMetrics(farmItem.id);

    return {
      id: farmItem.id,
      name: farmItem.name,
      parcels,
      metrics: farmMetrics,
    };
  });
}

function loadFarmsSync(): Farm[] {
  if (loadedFarms !== null) {
    return loadedFarms;
  }

  try {
    const farmItems = (Array.isArray(farmDataJson) ? farmDataJson : []) as unknown as FarmItem[];

    if (farmItems && farmItems.length > 0) {
      loadedFarms = convertFarmItemsToFarms(farmItems);
      return loadedFarms;
    }

    loadedFarms = [];
    return loadedFarms;
  } catch (error) {
    console.error('Failed to load farms from farm-data.json:', error);
    loadedFarms = [];
    return loadedFarms;
  }
}

loadFarmsSync();

export async function loadFarmsFromAPI(): Promise<Farm[]> {
  return loadFarmsSync();
}

export function getFarms(): Farm[] {
  if (loadedFarms === null) {
    return loadFarmsSync();
  }
  return loadedFarms;
}

export function getInitialMapCenter(): [number, number] {
  const farms = getFarms();
  if (farms.length > 0 && farms[0].parcels.length > 0) {
    const firstParcel = farms[0].parcels[0];
    if (firstParcel.coordinates && firstParcel.coordinates[0]?.[0]?.[0]) {
      const [lng, lat] = firstParcel.coordinates[0][0][0];
      return [lng, lat];
    }
  }
  return [-6.816008322278037, 52.81398909630343];
}

export const farms: Farm[] = getFarms();

export function getSoilDashboardParcels() {
  return getFarms().flatMap((farmItem) =>
    farmItem.parcels.map((parcel) => ({
      id: parcel.id,
      name: parcel.name,
      coordinates: parcel.coordinates,
      pH: parcel.pH ?? parcel.metrics.phGrassland,
      visible: true,
      zIndex: 5,
    }))
  );
}

export const soilDashboardParcels = getSoilDashboardParcels();

export type SelectedEntityType = 'farm' | 'parcel' | 'zone' | null;
export type SelectedEntity =
  | {
      type: 'farm';
      id: string;
      name: string;
    }
  | {
      type: 'parcel';
      id: string;
      name: string;
    }
  | {
      type: 'zone';
      id: string;
      name: string;
    }
  | null;

export function getZoneMetrics(zoneId: string): ZoneMetrics | null {
  for (const farmItem of getFarms()) {
    for (const parcel of farmItem.parcels) {
      const zone = parcel.zones.find((z) => z.id === zoneId);
      if (zone) {
        return zone.metrics;
      }
    }
  }
  return null;
}

export function getParcelMetrics(parcelId: string): ZoneMetrics | null {
  for (const farmItem of getFarms()) {
    const parcel = farmItem.parcels.find((p) => p.id === parcelId);
    if (parcel) {
      return parcel.metrics;
    }
  }
  return null;
}

export function getFarmMetrics(farmId?: string): ZoneMetrics {
  if (farmId) {
    const farmItem = getFarms().find((f) => f.id === farmId);
    if (farmItem) {
      return farmItem.metrics;
    }
  }
  const farms = getFarms();
  if (farms.length > 0) {
    return farms[0].metrics;
  }
  return generateZoneMetrics('default');
}

export function getAllFarmsMetrics(): ZoneMetrics {
  const allZonesFromAllFarms: Zone[] = [];

  getFarms().forEach((farmItem) => {
    farmItem.parcels.forEach((parcel) => {
      allZonesFromAllFarms.push(...parcel.zones);
    });
  });

  if (allZonesFromAllFarms.length === 0) {
    return generateZoneMetrics('default');
  }

  return calculateAverageMetrics(allZonesFromAllFarms);
}

export function getMetricsForSelectedEntity(
  selected: SelectedEntity
): ZoneMetrics | null {
  if (!selected) return null;

  switch (selected.type) {
    case 'zone':
      return getZoneMetrics(selected.id);
    case 'parcel':
      return getParcelMetrics(selected.id);
    case 'farm':
      return getFarmMetrics(selected.id);
    default:
      return null;
  }
}
function getMetricPropertyFromId(
  metricId: string | null
): keyof ZoneMetrics | null {
  if (!metricId) return null;

  const metricMap: Record<string, keyof ZoneMetrics> = {
    'ph-grassland': 'phGrassland',
    'ph-cereals-maize': 'phCerealsMaize',
    'lime-requirement': 'lime',
    'phosphorous-p-grassland': 'pIndexGrassland',
    'phosphorous-p-other-crop': 'pIndexOtherCrops',
    'potassium-k-mineral-soil': 'kIndexMineralSoil',
    'potassium-k-peat-soil': 'kIndexPeatSoil',
    'organic-matter-om': 'organicMatter',
    'magnesium-mg': 'magnesiumMg',
    'calcium-c': 'calciumC',
    'copper-cu': 'copperCu',
    'manganese-mn': 'manganeseMn',
    'zinc-zn': 'zincZn',
    'boron-b': 'boronB',
    // Group keys default to phGrassland for pH group
    ph: 'phGrassland',
    'phosphorous-p': 'pIndexGrassland',
    'potassium-k': 'kIndexMineralSoil',
  };

  return metricMap[metricId] || null;
}

export function getMapParcelsForSelectedEntity(
  selected: SelectedEntity,
  metricId?: string | null
) {
  const metricProperty = getMetricPropertyFromId(metricId || null);
  const useMetric = metricProperty !== null;
  const farms = getFarms();

  if (!selected) {
    if (useMetric && metricProperty) {
      return farms.flatMap((farmItem) =>
        farmItem.parcels.map((parcel) => ({
          id: parcel.id,
          name: parcel.name,
          coordinates: parcel.coordinates,
          pH: parcel.metrics[metricProperty] as number,
          visible: true,
          zIndex: 5,
        }))
      );
    }
    return getSoilDashboardParcels();
  }

  switch (selected.type) {
    case 'zone': {
      for (const farmItem of farms) {
        for (const parcel of farmItem.parcels) {
          const zone = parcel.zones.find((z) => z.id === selected.id);
          if (zone) {
            const metricValue =
              useMetric && metricProperty
                ? (zone.metrics[metricProperty] as number)
                : zone.metrics.phGrassland;
            return [
              {
                id: zone.id,
                name: zone.name,
                coordinates: zone.coordinates,
                pH: metricValue,
                visible: true,
                zIndex: 5,
                fillColor: '#00AF4D',
                borderColor: '#00AF4D',
              },
            ];
          }
        }
      }
      return [];
    }
    case 'parcel': {
      for (const farmItem of farms) {
        const parcel = farmItem.parcels.find((p) => p.id === selected.id);
        if (parcel) {
          const metricValue =
            useMetric && metricProperty
              ? (parcel.metrics[metricProperty] as number)
              : parcel.pH ?? parcel.metrics.phGrassland;
          return [
            {
              id: parcel.id,
              name: parcel.name,
              coordinates: parcel.coordinates,
              pH: metricValue,
              visible: true,
              zIndex: 5,
              fillColor: '#00AF4D',
              borderColor: '#00AF4D',
            },
          ];
        }
      }
      return [];
    }
    case 'farm': {
      const farmItem = farms.find((f) => f.id === selected.id);
      if (farmItem) {
        return farmItem.parcels.map((parcel) => {
          const metricValue =
            useMetric && metricProperty
              ? (parcel.metrics[metricProperty] as number)
              : parcel.pH ?? parcel.metrics.phGrassland;
          return {
            id: parcel.id,
            name: parcel.name,
            coordinates: parcel.coordinates,
            pH: metricValue,
            visible: true,
            zIndex: 5,
            fillColor: '#00AF4D',
            borderColor: '#00AF4D',
          };
        });
      }
      return [];
    }
    default:
      return [];
  }
}

export function getEntityType(id: string): SelectedEntityType {
  const farms = getFarms();
  if (farms.some((f) => f.id === id)) return 'farm';
  if (farms.some((f) => f.parcels.some((p) => p.id === id))) return 'parcel';
  if (
    farms.some((f) => f.parcels.some((p) => p.zones.some((z) => z.id === id)))
  )
    return 'zone';
  return null;
}

export function getEntityName(id: string): string | null {
  const farms = getFarms();
  const farmItem = farms.find((f) => f.id === id);
  if (farmItem) return farmItem.name;
  for (const farmItem of farms) {
    const parcel = farmItem.parcels.find((p) => p.id === id);
    if (parcel) return parcel.name;
  }
  for (const farmItem of farms) {
    for (const parcel of farmItem.parcels) {
      const zone = parcel.zones.find((z) => z.id === id);
      if (zone) return zone.name;
    }
  }
  return null;
}

function generateParcelLabel(farmIndex: number, parcelIndex: number): string {
  const farmNumber = farmIndex + 1;
  const parcelLetter = String.fromCharCode(65 + parcelIndex);
  return `${farmNumber}${parcelLetter}`;
}

export interface ParcelPhData {
  name: string;
  ph: number;
  id: string;
}

export function getAllParcelsPhData(): ParcelPhData[] {
  const result: ParcelPhData[] = [];
  getFarms().forEach((farmItem, farmIndex) => {
    farmItem.parcels.forEach((parcel, parcelIndex) => {
      result.push({
        id: parcel.id,
        name: generateParcelLabel(farmIndex, parcelIndex),
        ph: parcel.metrics.phGrassland,
      });
    });
  });
  return result;
}
