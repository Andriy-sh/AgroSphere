import type { ClientFormData } from '@@agrosphere/shared';
import type { ClientData } from '@@agrosphere/shared';
import type { ClientFormMode } from './add-client.types';

export function getClientFormDefaults(
  mode: ClientFormMode,
  existingClient?: ClientData
): ClientFormData {
  if (mode === 'edit' && existingClient) {
    return {
      firstName: existingClient.first_name || '',
      lastName: existingClient.last_name || '',
      businessType: existingClient.business_type || '',
      businessName: existingClient.business_name || '',
      email: existingClient.email || '',
      phone: existingClient.mobile || '',
      contactName: existingClient.contact_name || '',
      contactRole: existingClient.contact_role || '',
      address: existingClient.full_address || '',
      addressLine1: existingClient.addressLine1 || '',
      addressLine2: existingClient.addressLine2 || '',
      city: existingClient.city || '',
      county: existingClient.county || '',
      country: existingClient.country || 'Ireland',
      eircode: existingClient.eircode || '',
      accountNo: existingClient.account_number || '',
      accountNo2: '',
      leadConsultant: '',
      farmType: existingClient.farmType ? [existingClient.farmType] : [],
      herdNo: existingClient.herdNo || '',
      tags: existingClient.tags || [],
    };
  }

  return {
    firstName: '',
    lastName: '',
    businessType: '',
    businessName: '',
    email: '',
    phone: '',
    contactName: '',
    contactRole: '',
    address: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    country: 'Ireland',
    eircode: '',
    accountNo: '',
    accountNo2: '',
    leadConsultant: '',
    farmType: [],
    herdNo: '',
    tags: [],
  };
}

