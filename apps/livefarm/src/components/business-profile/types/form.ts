import { z } from 'zod';

export const businessProfileSchema = z
  .object({
    userType: z.enum(['farmer', 'agri-business'], {
      message: 'Please select your account type',
    }),
    businessName: z
      .string()
      .min(1, 'Business name is required')
      .trim(),
    email: z
      .string()
      .email('Please enter a valid email address')
      .min(1, 'Email is required'),
    businessType: z.string().min(1, 'Please select your business type'),
    farmCategory: z.string().optional(),
    businessCategory: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.userType === 'farmer') {
      if (!data.farmCategory || data.farmCategory.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your category',
          path: ['farmCategory'],
        });
      }
    }
    if (data.userType === 'agri-business') {
      if (!data.businessCategory || data.businessCategory.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Please select your category',
          path: ['businessCategory'],
        });
      }
    }
  });

export type BusinessProfileFormData = z.infer<typeof businessProfileSchema>;

export type UserType = 'farmer' | 'agri-business';

export interface RadioOption {
  value: string;
  label: string;
}

