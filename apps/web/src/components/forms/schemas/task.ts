import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Task title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.string().optional(),
  project_id: z.string().optional(),
  user_id: z.string().min(1, 'User ID is required'),
  user_name: z.string().min(1, 'User name is required')
});

export type TaskFormData = z.infer<typeof taskSchema>;