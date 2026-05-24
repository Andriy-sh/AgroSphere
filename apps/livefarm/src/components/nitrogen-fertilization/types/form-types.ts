export type ZonePrescription = {
  zoneId: number;
  zoneKey: string; 
  rateKgHa: string;
  zoneArea: number; 
  zoneAreaHa: number; 
  kmean?: number; 
  fertilizerAmount?: number; 
};

export type ApplicationStrategy = 'increase' | 'decrease' | 'manual';

export enum Step {
  SETUP = 1,
  ZONES = 2,
}

export type NitrogenFertilizationParcelOption = {
  id: string;
  name: string;
};

