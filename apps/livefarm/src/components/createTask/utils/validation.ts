import { z } from 'zod';

export const createTaskFormSchema = z.object({
  lab: z.string().min(1, 'Lab is required'),
  client: z.string().min(1, 'Client is required'),
  taskType: z.string().min(1, 'Task type is required'),
  assignedTo: z.string().min(1, 'Organization is required'),
  assignedUser: z.string().min(1, 'Assigned user is required'),
  priority: z.string().min(1, 'Priority is required'),
  startAfter: z.string().min(1, 'Start date is required'),
  completeBy: z.string(),
  description: z.string(),
});

export const createTaskRequestSchema = z.object({
  task_type: z.string().min(1, 'Task type is required'),
  farmer_hashid: z.string().min(1, 'Farmer hashid is required'),
  lab: z.number().positive('Lab must be a positive number'),
  assigned_to_hashid: z.array(z.string()),
  assigned_organization_hashid: z
    .string()
    .min(1, 'Organization hashid is required'),
  priority: z.string().min(1, 'Priority is required'),
  active_date: z.string().min(1, 'Active date is required'),
  complete_by: z.string().optional(),
  note: z.string().optional(),
  farms: z
    .array(z.object({ hashid: z.string() }))
    .min(1, 'At least one farm is required'),
});

export type CreateTaskFormInput = z.infer<typeof createTaskFormSchema>;
export type CreateTaskRequestInput = z.infer<typeof createTaskRequestSchema>;
