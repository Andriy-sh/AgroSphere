export interface Farm {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  address: string;
  size: number;
  cropType: string;
  fields: Array<{
    id: string;
    name: string;
    area: number;
    cropType: string;
    zones: Array<{
      id: string;
      name: string;
      coordinates: [number, number][][][];
    }>;
  }>;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  tags?: string[];
  farms: Farm[];
}

