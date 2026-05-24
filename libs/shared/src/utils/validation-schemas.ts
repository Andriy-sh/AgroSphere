import { z } from 'zod';

export const clientFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  businessType: z.string().min(1, 'Business type is required'),
  businessName: z.string().min(1, 'Business name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  contactName: z.string().optional(),
  contactRole: z.string().optional(),
  address: z.string().optional(),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  county: z.string().optional(),
  country: z.string().optional(),
  postcode: z.string().optional(),
  eircode: z.string().optional(),
  accountNo: z.string().optional(),
  accountNo2: z.string().optional(),
  leadConsultant: z.string().optional(),
  farmType: z.array(z.string()).optional(),
  herdNo: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;

export interface ExistingClient {
  id: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  address?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  county?: string;
  country?: string;
  postcode?: string;
  eircode?: string;
  phone?: string;
  accountNo?: string;
  herdNo?: string;
  asgn?: string | null;
  tasks?: number | null;
  product?: string;
  tags?: string[];
  avatar?: string;
  initials?: string;
  isOwn?: boolean;
}

export interface ValidationWarning {
  type: 'warning';
  field: string;
  message: string;
}

export interface ValidationError {
  type: 'error';
  field: string;
  message: string;
}

export type ValidationIssue = ValidationWarning | ValidationError;

export const checkDuplicateClient = (
  formData: ClientFormData,
  existingClients: ExistingClient[],
  excludeClientId?: string
): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];
  const normalize = (str: string) =>
    str.toLowerCase().trim().replace(/\s+/g, ' ');

  existingClients.forEach((client) => {
    if (excludeClientId && client.id === excludeClientId) {
      return;
    }
    if (
      formData.firstName &&
      formData.lastName &&
      client.name &&
      normalize(`${formData.firstName} ${formData.lastName}`) ===
        normalize(client.name)
    ) {
      issues.push({
        type: 'warning',
        field: 'name',
        message: 'A client with the same first and last name already exists',
      });
    }

    const formAddress = [formData.addressLine1, formData.addressLine2]
      .filter(Boolean)
      .join(', ');

    if (
      formAddress &&
      client.address &&
      normalize(formAddress) === normalize(client.address)
    ) {
      issues.push({
        type: 'warning',
        field: 'address',
        message: 'A client with the same address already exists',
      });
    }

    if (
      formData.eircode &&
      client.eircode &&
      normalize(formData.eircode) === normalize(client.eircode)
    ) {
      issues.push({
        type: 'warning',
        field: 'eircode',
        message: 'A client with the same eircode already exists',
      });
    }

    if (
      formData.phone &&
      client.phone &&
      normalize(formData.phone) === normalize(client.phone)
    ) {
      issues.push({
        type: 'warning',
        field: 'phone',
        message: 'A client with the same phone number already exists',
      });
    }

    if (
      formData.email &&
      client.email &&
      normalize(formData.email) === normalize(client.email)
    ) {
      issues.push({
        type: 'error',
        field: 'email',
        message: 'This email address is already in use',
      });
    }

    if (
      formData.accountNo &&
      client.accountNo &&
      normalize(formData.accountNo) === normalize(client.accountNo)
    ) {
      issues.push({
        type: 'error',
        field: 'accountNo',
        message: 'Account number is already in use',
      });
    }

    if (
      formData.herdNo &&
      client.herdNo &&
      normalize(formData.herdNo) === normalize(client.herdNo)
    ) {
      issues.push({
        type: 'error',
        field: 'herdNo',
        message: 'Herd number is already in use',
      });
    }
  });

  return issues;
};
