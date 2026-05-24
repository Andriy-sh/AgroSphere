import { z } from 'zod';
import type { CreateFarmRequest } from '@@agrosphere/shared';

export const createFarmFormSchema = z.object({
  name: z.string().min(1, 'Farm name is required').trim(),
  farmLocation: z
    .object({
      location: z.tuple([z.number(), z.number()]).nullable().optional(),
      location_xy: z.tuple([z.number(), z.number()]).nullable().optional(),
    })
    .nullable()
    .optional(),
});

export type CreateFarmFormData = z.infer<typeof createFarmFormSchema>;

const formDataKeys = Object.keys(
  createFarmFormSchema.shape
) as (keyof CreateFarmFormData)[];

export function isValidFormField(key: string): key is keyof CreateFarmFormData {
  return formDataKeys.includes(key as keyof CreateFarmFormData);
}

export function mapFormDataToApiRequest(
  data: CreateFarmFormData
): CreateFarmRequest {
  return {
    name: data.name,
    farmLocation:
      data.farmLocation?.location && data.farmLocation.location_xy
        ? {
            location: data.farmLocation.location,
            location_xy: data.farmLocation.location_xy,
          }
        : null,
  };
}
