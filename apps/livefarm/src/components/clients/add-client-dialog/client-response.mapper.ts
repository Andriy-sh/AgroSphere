import type { Client } from '@@agrosphere/shared';
import type { ClientData } from '@@agrosphere/shared';

export function mapClientToClientData(client: Client): ClientData {
  const fullName = `${client.first_name} ${client.last_name}`.trim();
  const fullAddress = [
    client.address_line_1,
    client.address_line_2,
    client.city,
    client.county,
    client.country,
    client.eircode,
  ]
    .filter(Boolean)
    .join(', ');

  return {
    id: client.id,
    name: client.first_name,
    surname: client.last_name,
    address: fullAddress,
    addressLine1: client.address_line_1,
    addressLine2: client.address_line_2,
    city: client.city,
    county: client.county,
    country: client.country || undefined,
    eircode: client.eircode,
    phone: client.mobile,
    email: client.email,
    herdNo: client.herd_no || '',
    farmType: client.farm_type || undefined,
    tags: client.tags || [],
    business_name: client.business_name,
    business_type: client.business_type,
    first_name: client.first_name,
    last_name: client.last_name,
    full_name: client.full_name,
    mobile: client.mobile,
    full_address: client.full_address,
    contact_name: client.contact_name,
    contact_role: client.contact_role,
    account_number: client.account_number,
    derogation: client.derogation,
    organic: client.organic,
    status: client.status,
    created_at: client.created_at,
    updated_at: client.updated_at,
  };
}

