import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name too long'),
  description: z.string().max(2000, 'Description must be under 2000 characters').optional(),
  status: z.enum(['planning', 'active', 'on-hold', 'completed', 'cancelled']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  start_date: z.string().min(1, 'Start date is required'),
  deadline: z.string().min(1, 'Deadline is required'),
  progress: z.number().min(0).max(100),
  budget: z.number().min(0, 'Budget must be positive').optional(),
  team_id: z.string().optional(),
  client_id: z.string().optional(),
  tags: z.array(z.string()).default([]),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  is_favorite: z.boolean().default(false),
}).refine(
  (data) => new Date(data.start_date) <= new Date(data.deadline),
  {
    message: 'Deadline must be after start date',
    path: ['deadline'],
  }
);

export type ProjectFormData = z.infer<typeof projectSchema>;