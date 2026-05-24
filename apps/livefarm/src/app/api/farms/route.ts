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
  // Allow additional properties like children, etc.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
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
    if (Array.isArray(parsed)) {
      return parsed.map((farm: FarmRecord) => {
        const latitude = farm.latitude ?? farm.lat;
        const longitude = farm.longitude ?? farm.lng;

        return {
          ...farm,
          area: farm.area ?? 0,
          parcels: farm.parcels ?? 0,
          lat: latitude,
          lng: longitude,
        };
      });
    }
    return [];
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    console.error('Failed to read farm data file', error);
    return [];
  }
}

async function writeFarmsToFile(farms: FarmRecord[]): Promise<void> {
  const content = JSON.stringify(farms, null, 2);
  await fs.writeFile(DATA_FILE_PATH, content, 'utf-8');
}

export async function GET() {
  try {
    const farms = await readFarmsFromFile();
    return NextResponse.json({ farms });
  } catch (error) {
    console.error('Failed to load farms', error);
    return NextResponse.json(
      { message: 'Failed to load farms' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const latitude = body.lat ?? body.latitude;
    const longitude = body.lng ?? body.longitude;

    const newFarm: FarmRecord = {
      id: body.id,
      name: body.name,
      area: body.area ?? 0,
      parcels: body.parcels ?? 0,
      lat: latitude,
      lng: longitude,
    };

    if (!newFarm.id || !newFarm.name || latitude == null || longitude == null) {
      return NextResponse.json(
        { message: 'id, name, and coordinates are required' },
        { status: 400 }
      );
    }

    const farms = await readFarmsFromFile();
    farms.push(newFarm);
    await writeFarmsToFile(farms);

    return NextResponse.json({ farm: newFarm }, { status: 201 });
  } catch (error) {
    console.error('Failed to save farm', error);
    return NextResponse.json(
      { message: 'Failed to save farm' },
      { status: 500 }
    );
  }
}
