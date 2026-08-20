import { z } from 'zod';

export const taskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE'], {
  errorMap: () => ({ message: 'Invalid task status' }),
});

export const taskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH'], {
  errorMap: () => ({ message: 'Invalid task priority' }),
});

export const createTaskSchema = z.object({
  title: z
    .string({ required_error: 'Title is required' })
    .min(1, 'Title is required')
    .max(200, 'Title cannot exceed 200 characters')
    .trim(),
  description: z.string().optional().default(''),
  status: taskStatusEnum.optional().default('TODO'),
  priority: taskPriorityEnum.optional().default('MEDIUM'),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val ? new Date(val) : null))
    .refine((date) => date === null || !isNaN(date.getTime()), {
      message: 'Invalid due date format',
    }),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title cannot be empty').max(200).trim().optional(),
  description: z.string().optional(),
  status: taskStatusEnum.optional(),
  priority: taskPriorityEnum.optional(),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .transform((val) => (val === null ? null : val ? new Date(val) : undefined))
    .refine((date) => date === undefined || date === null || !isNaN(date.getTime()), {
      message: 'Invalid due date format',
    }),
});

export const queryTaskSchema = z.object({
  search: z.string().optional(),
  status: z.union([taskStatusEnum, z.literal('ALL')]).optional(),
  priority: z.union([taskPriorityEnum, z.literal('ALL')]).optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type QueryTaskInput = z.infer<typeof queryTaskSchema>;
