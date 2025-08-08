import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '../../lib/validations';
import type { ProjectFormData } from '../../lib/validations';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { FormField } from './FormField';
import { FormSelect } from './FormSelect';
import Button from '../ui/Button';

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  initialData?: Partial<ProjectFormData>;
  isLoading?: boolean;
  submitText?: string;
}

const statusOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'active', label: 'Active' },
  { value: 'on-hold', label: 'On Hold' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const ProjectForm = memo(({
  onSubmit,
  initialData,
  isLoading = false,
  submitText = 'Create Project'
}: ProjectFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      status: 'planning',
      priority: 'medium',
      color: '#4F46E5',
      ...initialData
    },
    mode: 'onChange'
  });

  const { clearPersistedData } = useFormPersistence({
    key: 'project',
    watch,
    setValue,
    exclude: ['color'] // Don't persist color picker
  });

  const handleFormSubmit = (data: ProjectFormData) => {
    onSubmit(data);
    clearPersistedData();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        label="Project Name"
        name="name"
        register={register}
        error={errors.name}
        required
        placeholder="Enter project name"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder="Enter project description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormSelect
          label="Status"
          name="status"
          options={statusOptions}
          register={register}
          error={errors.status}
          required
        />

        <FormSelect
          label="Priority"
          name="priority"
          options={priorityOptions}
          register={register}
          error={errors.priority}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Start Date"
          name="start_date"
          type="date"
          register={register}
          error={errors.start_date}
        />

        <FormField
          label="Deadline"
          name="deadline"
          type="date"
          register={register}
          error={errors.deadline}
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Color <span className="text-red-500">*</span>
        </label>
        <input
          type="color"
          {...register('color')}
          className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.color && (
          <p className="text-sm text-red-500">{errors.color.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!isValid || isLoading}
        className="w-full"
      >
        {isLoading ? 'Creating...' : submitText}
      </Button>
    </form>
  );
});