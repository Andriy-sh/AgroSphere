import { FormFarm } from '@@agrosphere/shared';
import { Client, Farm } from '../types';

export function transformClientsToFormFarms(clients: Client[]): FormFarm[] {
  return clients.flatMap((client: Client) =>
    client.farms.map((farm: Farm) => ({
      id: farm.id,
      name: farm.name,
      area: farm.size,
      fields: farm.fields.map((field) => ({
        value: field.id,
        label: field.name,
        area: field.area,
        children: field.zones.map((zone) => ({
          value: zone.id,
          label: zone.name,
        })),
      })),
      selectedFields: [],
      remainingCount: farm.fields.length,
      total: farm.fields.length,
      isActive: true,
      clientId: client.id,
    }))
  );
}

export function filterFarmsByClient(
  formFarms: FormFarm[],
  clientId: string
): FormFarm[] {
  if (!clientId) return [];
  return formFarms.filter((farm) => farm.clientId === clientId);
}

