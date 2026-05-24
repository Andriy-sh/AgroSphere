import { z } from 'zod';

export const applicationFormSchema = z
  .object({
    field: z.string().min(1, 'Field is required'),
    date: z.string().min(1, 'Date is required'),
    applicationType: z.string().min(1, 'Application type is required'),
    product: z.string().min(1, 'Product is required'),
    rate: z.number().optional(),
  })
  .refine((data) => data.rate !== undefined, {
    message: 'Rate is required',
    path: ['rate'],
  })
  .refine((data) => data.rate === undefined || data.rate > 0, {
    message: 'Rate must be greater than 0',
    path: ['rate'],
  });

export type ApplicationFormData = {
  field: string;
  date: string;
  applicationType: string;
  product: string;
  rate?: number | undefined;
};

export const harvestFormSchema = z
  .object({
    field: z.string().min(1, 'Field is required'),
    date: z.string().min(1, 'Date is required'),
    harvestType: z.string().min(1, 'Harvest type is required'),
    yield: z.number().optional(),
  })
  .refine((data) => data.yield !== undefined, {
    message: 'Yield is required',
    path: ['yield'],
  })
  .refine((data) => data.yield === undefined || data.yield > 0, {
    message: 'Yield must be greater than 0',
    path: ['yield'],
  });

export type HarvestFormData = {
  field: string;
  date: string;
  harvestType: string;
  yield?: number | undefined;
};

export const soilTestFormSchema = z
  .object({
    field: z.string().min(1, 'Field is required'),
    testDate: z.string().min(1, 'Test date is required'),
    minNMin: z.number().optional(),
    maxNMin: z.number().optional(),
    scenario: z.string().min(1, 'Scenario is required'),
  })
  .refine((data) => data.minNMin !== undefined, {
    message: 'Min N-Min is required',
    path: ['minNMin'],
  })
  .refine((data) => data.minNMin === undefined || data.minNMin >= 0, {
    message: 'Min N-Min must be greater than or equal to 0',
    path: ['minNMin'],
  })
  .refine((data) => data.maxNMin !== undefined, {
    message: 'Max N-Min is required',
    path: ['maxNMin'],
  })
  .refine((data) => data.maxNMin === undefined || data.maxNMin >= 0, {
    message: 'Max N-Min must be greater than or equal to 0',
    path: ['maxNMin'],
  })
  .refine(
    (data) => {
      if (data.minNMin === undefined || data.maxNMin === undefined) return true;
      return data.maxNMin >= data.minNMin;
    },
    {
      message: 'Max N-Min must be greater than or equal to Min N-Min',
      path: ['maxNMin'],
    }
  );

export type SoilTestFormData = {
  field: string;
  testDate: string;
  minNMin?: number | undefined;
  maxNMin?: number | undefined;
  scenario: string;
};
