import { memo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, } from '../../lib/validations';
import type { TaskFormData } from '../../lib/validations';
import { useFormPersistence } from '../../hooks/useFormPersistence';
import { FormField } from './FormField';
import { FormSelect } from './FormSelect';
import Button from '../ui/Button';

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  initialData?: Partial<TaskFormData>;
  isLoading?: boolean;
  submitText?: string;
}

const statusOptions = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export const TaskForm = memo(({
  onSubmit,
  initialData,
  isLoading = false,
  submitText = 'Create Task'
}: TaskFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: 'todo',
      priority: 'medium',
      ...initialData
    },
    mode: 'onChange'
  });

  const { clearPersistedData } = useFormPersistence({
    key: 'task',
    watch,
    setValue
  });

  const handleFormSubmit = (data: TaskFormData) => {
    onSubmit(data);
    clearPersistedData();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <FormField
        label="Task Title"
        name="title"
        register={register}
        error={errors.title}
        required
        placeholder="Enter task title"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          {...register('description')}
          placeholder="Enter task description"
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

      <FormField
        label="Due Date"
        name="due_date"
        type="datetime-local"
        register={register}
        error={errors.due_date}
      />

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