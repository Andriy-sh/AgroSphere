import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface FarmRecord {
  id: string;
  name: string;
  area?: number;
  parcels?: number;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
  children?: ParcelRecord[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ParcelRecord {
  id: string;
  name: string;
  type: string;
  area: number;
  geometry: number[][];
  children?: ZoneRecord[];
  eosdaFieldId?: string;
  history?: Array<{
    id: string;
    createdAt: string;
    zonesCount: number;
    method: string;
    parcelWithZones: {
      parcelId: string;
      parcelCoordinates: number[][];
      zones: Array<{
        zoneId: string;
        zoneName?: string;
        coordinates: number[][];
        area?: number;
      }>;
      splitLines: Array<{
        coordinates: number[][];
      }>;
      area?: number;
    };
  }>;
}

interface ZoneRecord {
  id: string;
  name: string;
  area: number;
}

interface CreateParcelRequestBody {
  farmId: string;
  name: string;
  parcelId?: string;
  area: number;
  effectiveArea?: number;
  soilType?: string;
  geometry: number[][];
  zones?: ZoneRecord[];
  eosdaFieldId?: string;
}

interface UpdateParcelRequestBody {
  farmId: string;
  parcelId: string;
  name?: string;
  parcelCode?: string;
  area?: number;
  effectiveArea?: number;
  soilType?: string;
  geometry?: number[][];
  eosdaFieldId?: string;
}

const DATA_FILE_PATH = path.join(
  process.cwd(),
  'src',
  'data',
  'json',
  'farm-data.json'
);

async function readFarmsFromFile(): Promise<FarmRecord[]> {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(fileContent);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((farm: FarmRecord) => {
      const latitude = farm.latitude ?? farm.lat;
      const longitude = farm.longitude ?? farm.lng;

      return {
        area: 0,
        parcels: 0,
        children: [],
        ...farm,
        lat: latitude,
        lng: longitude,
      };
    });
  } catch (error) {
    console.error('Failed to read farm data file (parcels)', error);
    return [];
  }
}

async function writeFarmsToFile(farms: FarmRecord[]): Promise<void> {
  const content = JSON.stringify(farms, null, 2);
  await fs.writeFile(DATA_FILE_PATH, content, 'utf-8');
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateParcelRequestBody;

    if (!body.farmId || !body.name || !body.geometry || body.geometry.length === 0) {
      return NextResponse.json(
        { message: 'farmId, name and geometry are required' },
        { status: 400 }
      );
    }

    const farms = await readFarmsFromFile();
    const farmIndex = farms.findIndex((farm) => farm.id === body.farmId);

    if (farmIndex === -1) {
      return NextResponse.json(
        { message: `Farm with id ${body.farmId} not found` },
        { status: 404 }
      );
    }

    const farm = farms[farmIndex];

    const parcelId =
      body.parcelId && body.parcelId.trim().length > 0
        ? body.parcelId
        : `parcel-${Date.now()}`;

    const newParcel: ParcelRecord = {
      id: parcelId,
      name: body.name,
      type: 'parcel',
      area: body.area,
      geometry: body.geometry,
      children: body.zones ?? [],
      eosdaFieldId: body.eosdaFieldId,
    };

    const existingChildren = farm.children ?? [];
    const updatedChildren = [...existingChildren, newParcel];

    const totalArea = updatedChildren.reduce(
      (sum, parcel) => sum + (parcel.area || 0),
      0
    );

    const updatedFarm: FarmRecord = {
      ...farm,
      children: updatedChildren,
      parcels: updatedChildren.length,
      area: totalArea,
    };

    const updatedFarms = [...farms];
    updatedFarms[farmIndex] = updatedFarm;

    await writeFarmsToFile(updatedFarms);

    return NextResponse.json(
      {
        farm: updatedFarm,
        parcel: newParcel,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to save parcel', error);
    return NextResponse.json(
      { message: 'Failed to save parcel' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as UpdateParcelRequestBody;

    if (!body.farmId || !body.parcelId) {
      return NextResponse.json(
        { message: 'farmId and parcelId are required' },
        { status: 400 }
      );
    }

    const farms = await readFarmsFromFile();
    const farmIndex = farms.findIndex((farm) => farm.id === body.farmId);

    if (farmIndex === -1) {
      return NextResponse.json(
        { message: `Farm with id ${body.farmId} not found` },
        { status: 404 }
      );
    }

    const farm = farms[farmIndex];
    const existingChildren = farm.children ?? [];
    const parcelIndex = existingChildren.findIndex(
      (parcel) => parcel.id === body.parcelId
    );

    if (parcelIndex === -1) {
      return NextResponse.json(
        { message: `Parcel with id ${body.parcelId} not found` },
        { status: 404 }
      );
    }

    const existingParcel = existingChildren[parcelIndex] as ParcelRecord;

    const updatedParcel: ParcelRecord = {
      ...existingParcel,
      ...(body.name !== undefined && { name: body.name }),
      ...(body.parcelCode !== undefined && { id: body.parcelCode }),
      ...(body.area !== undefined && { area: body.area }),
      ...(body.geometry !== undefined && { geometry: body.geometry }),
      ...(body.eosdaFieldId !== undefined && { eosdaFieldId: body.eosdaFieldId }),
    };

    const updatedChildren = [...existingChildren];
    updatedChildren[parcelIndex] = updatedParcel;

    const totalArea = updatedChildren.reduce(
      (sum, parcel) => sum + (parcel.area || 0),
      0
    );

    const updatedFarm: FarmRecord = {
      ...farm,
      children: updatedChildren,
      parcels: updatedChildren.length,
      area: totalArea,
    };

    const updatedFarms = [...farms];
    updatedFarms[farmIndex] = updatedFarm;

    await writeFarmsToFile(updatedFarms);

    return NextResponse.json(
      {
        farm: updatedFarm,
        parcel: updatedParcel,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update parcel', error);
    return NextResponse.json(
      { message: 'Failed to update parcel' },
      { status: 500 }
    );
  }
}


