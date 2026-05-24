import type { ClientFormData } from '@@agrosphere/shared';
import type { CreateClientRequest } from '@@agrosphere/shared';
import type { Client } from '@@agrosphere/shared';

export function mapFormToCreateRequest(
  formData: ClientFormData
): CreateClientRequest {
  return {
    business_name: formData.businessName || '',
    business_type: formData.businessType || '',
    first_name: formData.firstName || '',
    last_name: formData.lastName || '',
    mobile: formData.phone || '',
    email: formData.email?.toLowerCase() || '',
    address_line_1: formData.addressLine1 || '',
    address_line_2: formData.addressLine2 || '',
    city: formData.city || '',
    county: formData.county || '',
    eircode: formData.eircode || '',
    contact_name: formData.contactName || '',
    contact_role: formData.contactRole || undefined,
    account_number: formData.accountNo || undefined,
    derogation: false,
    farm_type: formData.farmType?.[0] || undefined,
    herd_no: formData.herdNo || undefined,
    organic: false,
  };
}

export function mapFormToUpdateRequest(
  formData: ClientFormData
): Partial<Client> {
  return {
    first_name: formData.firstName,
    last_name: formData.lastName,
    business_name: formData.businessName,
    business_type: formData.businessType,
    email: formData.email?.toLowerCase(),
    mobile: formData.phone,
    contact_name: formData.contactName,
    contact_role: formData.contactRole || null,
    address_line_1: formData.addressLine1,
    address_line_2: formData.addressLine2,
    city: formData.city,
    county: formData.county,
    country: formData.country || null,
    eircode: formData.eircode,
    account_number: formData.accountNo || null,
    farm_type: formData.farmType?.[0] || null,
    herd_no: formData.herdNo || null,
  };
}

