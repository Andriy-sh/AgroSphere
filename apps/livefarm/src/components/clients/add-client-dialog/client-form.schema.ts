import { z } from 'zod';
import type { ExistingClient } from '@@agrosphere/shared';

const normalize = (str: string) =>
  str.toLowerCase().trim().replace(/\s+/g, ' ');

const baseClientSchema = {
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
};

export function createClientFormSchema(
  existingClients: ExistingClient[] = [],
  excludeClientId?: string,
  mode: 'add' | 'edit' = 'add'
) {
  return z
    .object(baseClientSchema)
    .superRefine((data, ctx) => {
      if (data.email) {
        const duplicateEmail = existingClients.find((client) => {
          if (excludeClientId && client.id === excludeClientId) return false;
          return (
            client.email && normalize(client.email) === normalize(data.email)
          );
        });

        if (duplicateEmail) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'This email address is already in use',
            path: ['email'],
          });
        }
      }

      if (data.accountNo) {
        const duplicateAccount = existingClients.find((client) => {
          if (excludeClientId && client.id === excludeClientId) return false;
          return (
            client.accountNo &&
            normalize(client.accountNo) === normalize(data.accountNo!)
          );
        });

        if (duplicateAccount) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Account number is already in use',
            path: ['accountNo'],
          });
        }
      }

      if (data.herdNo) {
        const duplicateHerd = existingClients.find((client) => {
          if (excludeClientId && client.id === excludeClientId) return false;
          return (
            client.herdNo &&
            normalize(client.herdNo) === normalize(data.herdNo!)
          );
        });

        if (duplicateHerd) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Herd number is already in use',
            path: ['herdNo'],
          });
        }
      }
    })
    .refine(
      (data) => {
        if (!data.phone) return true;
        const duplicatePhone = existingClients.find((client) => {
          if (excludeClientId && client.id === excludeClientId) return false;
          return (
            client.phone && normalize(client.phone) === normalize(data.phone!)
          );
        });
        return !duplicatePhone;
      },
      {
        message: 'A client with the same phone number already exists',
        path: ['phone'],
      }
    );
}

export const clientFormSchemaBase = z.object(baseClientSchema);

export type ClientFormDataBase = z.infer<typeof clientFormSchemaBase>;

export const clientFormSchema = clientFormSchemaBase;
export type { ClientFormData } from '@@agrosphere/shared';
