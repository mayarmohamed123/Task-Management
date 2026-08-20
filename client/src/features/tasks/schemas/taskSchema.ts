import { z } from 'zod';

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  description: z.string().optional().default(''),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
    required_error: 'Status is required',
  }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH'], {
    required_error: 'Priority is required',
  }),
  dueDate: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val === '' ? null : val)),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
