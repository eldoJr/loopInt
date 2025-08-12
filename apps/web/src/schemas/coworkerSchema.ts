import { z } from 'zod';

export const coworkerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  position: z.string().min(1, 'Position is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  status: z.enum(['active', 'inactive', 'pending']),
  contractType: z.enum(['full-time', 'part-time', 'contractor', 'intern']),
  department: z.string().optional(),
  skills: z.array(z.string()).default([]),
  salary: z.number().min(0, 'Salary must be positive').optional(),
  positionDescription: z.string().max(500, 'Position description must be less than 500 characters').optional(),
  linkedin: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  skype: z.string().optional(),
  isIndividual: z.boolean().default(false),
  photo: z.any().optional(),
  resumeFile: z.any().optional(),
});

export type CoworkerFormData = z.infer<typeof coworkerSchema>;